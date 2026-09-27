// ======================================================
// MERGE CONFLICT RESOLVER — ALLIES + BIG BOSSES
// ======================================================
(function(){
  const MERGE_UPDATE_BASE=Game.prototype.update;
  Game.prototype.update=function(dt){
    if(this.state==="PLAYING"&&this.player){
      const nextWave=1+Math.floor(((this.time||0)+dt)/60);
      if(nextWave>=5&&nextWave%2===1&&nextWave!==(this.wave||1)&&!this.bigBossWavesSpawned?.has?.(nextWave)){
        this.pendingBigBossWave=this.pendingBigBossWave||nextWave;
        if(Number.isFinite(this.trialPortalCooldown)&&this.trialPortalCooldown<8)this.trialPortalCooldown=8;
      }
    }
    return MERGE_UPDATE_BASE.call(this,dt);
  };

  const MERGE_RECRUIT_BASE=Game.prototype.spawnRecruitChallenge;
  Game.prototype.spawnRecruitChallenge=function(id){
    return MERGE_RECRUIT_BASE.call(this,id);
  };

  const MERGE_MINI_BASE=Game.prototype.spawnMiniBoss;
  Game.prototype.spawnMiniBoss=function(){if(this.pendingBigBossWave||this.boss?.bigBoss)return;return MERGE_MINI_BASE.call(this)};
  const MERGE_EVENT_BASE=Game.prototype.startWorldEvent;
  Game.prototype.startWorldEvent=function(){if(this.pendingBigBossWave||this.boss?.bigBoss)return;return MERGE_EVENT_BASE.call(this)};

  if(typeof startTrial==="function"){
    const MERGE_TRIAL_BASE=startTrial;
    startTrial=function(id){
      return MERGE_TRIAL_BASE(id);
    };
  }

  const MERGE_RECRUIT_SUCCESS_BASE=Game.prototype.recruitAlly;
  Game.prototype.recruitAlly=function(id,x,y){
    const r=MERGE_RECRUIT_SUCCESS_BASE.call(this,id,x,y);
    if(this.pendingBigBossWave)this.lastMajorEncounterTime=Math.min(this.lastMajorEncounterTime||this.time,this.time-3);
    return r;
  };
  const MERGE_RECRUIT_FAIL_BASE=Game.prototype.failRecruitChallenge;
  Game.prototype.failRecruitChallenge=function(id){
    const r=MERGE_RECRUIT_FAIL_BASE.call(this,id);
    if(this.pendingBigBossWave)this.lastMajorEncounterTime=Math.min(this.lastMajorEncounterTime||this.time,this.time-3);
    return r;
  };

  renderStoryAllyHud=function(g){
    const el=document.getElementById("vsxAllyHud");if(!el||!g.player)return;
    const roster=[];
    if(g.mbappeAlly)roster.push({
    id:"mb9",name:"MB9",hp:g.mbappeAlly.hp,max:g.mbappeAlly.maxHp,dead:g.mbappeAlly.dead,color:"#ffd84d",glyph:"9",role:null,
    state:g.mbappeAlly.dead?`${VSX.lang==="vi"?"HỒI SINH":"REVIVE"} 00:${String(Math.max(0,Math.ceil(g.mbappeAlly.reviveTimer??60))).padStart(2,"0")}`:null
  });
    for(const w of g.player.weapons||[])if(w.id==="virgil_vandijk"&&w.vvdAlly)roster.push({id:"vvd4",name:"VVD4",hp:1,max:1,dead:false,color:"#ff6868",glyph:"4",role:null,state:null});
    for(const a of g.storyAllies||[])roster.push({id:a.id,name:allyShort(a.id),hp:a.hp,max:a.maxHp,dead:a.dead,color:a.def.color,glyph:a.def.glyph,role:a.def.role?.[VSX.lang]||null,state:null});
    if(g.contractAlly&&!g.contractAlly.leave){const a=g.contractAlly;roster.push({id:"contract_"+a.id,name:a.def.name[VSX.lang],hp:a.hp,max:a.maxHp,dead:a.dead,color:a.def.color,glyph:(a.id||"A").slice(0,2).toUpperCase(),role:VSX.lang==="vi"?"Hợp Đồng":"Contract",state:a.dead?null:(VSX.lang==="vi"?`ĐẾN ĐỢT ${CONTRACT_LAST_WAVE}`:`UNTIL W${CONTRACT_LAST_WAVE}`)})}
    const living=roster.filter(a=>!a.dead),down=roster.filter(a=>a.dead),ordered=living.concat(down);
    const cards=ordered.map(a=>{
      const role=a.role?`<small class="vsxAllyRole">${VSX.esc(a.role)}</small>`:"";
      if(a.dead)return `<div class="vsxAllyCard vsxDown"><span class="vsxAllyIcon" style="background:${a.color};color:#07111d">${VSX.esc(a.glyph)}</span><div><div class="vsxAllyName">${VSX.esc(a.name)}${role}</div></div><span class="vsxAllyState">${t("down")}</span></div>`;
      return `<div class="vsxAllyCard"><span class="vsxAllyIcon" style="background:${a.color};color:#07111d">${VSX.esc(a.glyph)}</span><div><div class="vsxAllyName">${VSX.esc(a.name)}${role}</div><div class="vsxAllyBar"><i style="width:${100*clamp(a.hp/Math.max(1,a.max),0,1)}%"></i></div></div><span class="vsxAllyState">${a.state||t("active")}</span></div>`;
    }).join("");
    const obj=currentRecruitObjective(g);
    el.innerHTML=`<div class="vsxAllyHead"><b>${t("allyNetwork")}</b><span>${t("squadCount")} ${g.countActiveAllies()}</span></div>${cards||`<div class="vsxAllyState">${VSX.lang==="vi"?"Chưa có tín hiệu đồng minh":"No allied signals yet"}</div>`}${obj?`<div class="vsxRecruitObjective"><b>${t("recruitment")}</b><br>${VSX.esc(obj)}</div>`:""}`;
  };

  const MERGE_LANG_BASE=vsxApplyLanguage;
  vsxApplyLanguage=function(){const r=MERGE_LANG_BASE();if(game?.player)renderStoryAllyHud(game);return r};
})();
