(function(){
"use strict";

/*
  Canonical Ultimate duration registry.
  seconds = active/effect duration presented to the player.
  mode=instant is a one-cast Ultimate with no persistent active window.
  mode=variable is resolved from the actual Jackpot result at cast time.
  Future survivor patches should call VSX_ULT_DURATION_API.register().
*/
const DEFS={
  power_shot:{seconds:0,mode:"instant"},
  unbreakable:{seconds:7},all_out_attack:{seconds:8},overclock_network:{seconds:8},breakaway:{seconds:6},
  jackpot:{seconds:null,mode:"variable",max:15},

  rift_collapse:{seconds:3.8},deadeye_salvo:{seconds:0,mode:"instant"},crimson_feast:{seconds:8},sanctuary:{seconds:7},
  tempest_crown:{seconds:2.0},mass_triage:{seconds:0,mode:"instant"},phase_hunt:{seconds:.85},carpet_bombing:{seconds:1.35},absolute_winter:{seconds:1.15},
  chrono_lock:{seconds:6},pack_hunt:{seconds:9},

  level_shift:{seconds:9},outbreak:{seconds:10},awaken_lion:{seconds:8},water_festival:{seconds:9},monsoon_updraft:{seconds:7},night_market_rush:{seconds:2.4},
  weigh_the_heart:{seconds:0,mode:"instant"},drop_the_void:{seconds:3.2},sacred_ring:{seconds:10},titanfall:{seconds:12},retake:{seconds:4},nine_dragons:{seconds:3.6},

  il_fenomeno:{seconds:9},kings_hat_trick:{seconds:3.8},joga_bonito:{seconds:10},

  power_mode:{seconds:8},supersonic_lap:{seconds:8},perfect_clear:{seconds:7.5},multiball_jackpot:{seconds:8},checkmate_protocol:{seconds:9},around_the_world:{seconds:8},
  rush_hour:{seconds:8},last_train:{seconds:9},domino_day:{seconds:4.8},jackpot_drop:{seconds:2.7},break_shot:{seconds:1.8},pipe_network:{seconds:9},
  false_awakening:{seconds:10},hall_of_mirrors:{seconds:10},compile_all:{seconds:9},out_of_bounds:{seconds:12},constellation_engine:{seconds:5},masterpiece:{seconds:11},

  royal_sequence:{seconds:10},critical_mass:{seconds:9},long_exposure:{seconds:10},monster_catch:{seconds:9},grand_parade:{seconds:9},collection_day:{seconds:9},

  contingency_protocol:{seconds:10},world_of_cardboard:{seconds:8},amazonian_judgment:{seconds:9},infinite_mass_punch:{seconds:6},emerald_overdrive:{seconds:10},
  king_seven_seas:{seconds:9},boom_tube_network:{seconds:10},azarath_metrion_zinthos:{seconds:10},fate_decree:{seconds:9},one_shot_one_city:{seconds:2.7}
};

function defFor(id){return DEFS[id]||{seconds:null,mode:"unknown"}}
function compactSeconds(v){
  if(!Number.isFinite(v))return "—";
  const rounded=Math.abs(v-Math.round(v))<.045?String(Math.round(v)):v.toFixed(v<2?2:1).replace(/0$/,'').replace(/\.$/,'');
  return `${rounded}s`;
}
function localizedDuration(id,compact=false){
  const d=defFor(id);
  if(d.mode==="instant"||d.seconds===0)return VSX.lang==="vi"?"TỨC THỜI":"INSTANT";
  if(d.mode==="variable")return compact?(VSX.lang==="vi"?"TÙY KẾT QUẢ":"VARIES"):(VSX.lang==="vi"?"TÙY KẾT QUẢ · TỨC THỜI / 12–15 GIÂY":"VARIES · INSTANT / 12–15s");
  if(Number.isFinite(d.seconds)){
    if(compact)return compactSeconds(d.seconds);
    const n=Math.abs(d.seconds-Math.round(d.seconds))<.045?String(Math.round(d.seconds)):d.seconds.toFixed(d.seconds<2?2:1).replace(/0$/,'').replace(/\.$/,'');
    return VSX.lang==="vi"?`${n.replace('.',',')} GIÂY`:`${n}s`;
  }
  return VSX.lang==="vi"?"KHÔNG XÁC ĐỊNH":"—";
}
function currentUltimateId(g=game){return CHARACTER_DEFINITIONS[g?.characterId||VSX.selectedCharacter]?.ultimate||null}

const CORE_BUFF_IDS=new Set(["unbreakable","all_out_attack","overclock_network","breakaway","crimson_feast","sanctuary"]);
function runtimeSource(g,id){
  const states=[
    ["dc",g.vsxDCUlt],["epic6",g.vsxEpic6Ult],["arcade",g.vsxArcadeUlt],["football",g.vsxFootballUlt],["expansion",g.vsxExpansionUlt]
  ];
  for(const [key,u] of states)if(u?.id===id&&Number.isFinite(u.time))return{key,remaining:Math.max(0,u.time)};
  if(id==="chrono_lock"&&g.timeDilation>0)return{key:"chrono",remaining:g.timeDilation};
  if(id==="pack_hunt"&&g.allyBuffTimer>0)return{key:"pack",remaining:g.allyBuffTimer};
  if(id==="retake"&&g.vsxRetakeBuff>0)return{key:"retake",remaining:g.vsxRetakeBuff};
  if(CORE_BUFF_IDS.has(id)&&g.ultimateBuffTimer>0)return{key:"buff",remaining:g.ultimateBuffTimer};
  return null;
}
function sourceRemaining(g,key,id){
  if(key==="dc")return g.vsxDCUlt?.id===id?g.vsxDCUlt.time:null;
  if(key==="epic6")return g.vsxEpic6Ult?.id===id?g.vsxEpic6Ult.time:null;
  if(key==="arcade")return g.vsxArcadeUlt?.id===id?g.vsxArcadeUlt.time:null;
  if(key==="football")return g.vsxFootballUlt?.id===id?g.vsxFootballUlt.time:null;
  if(key==="expansion")return g.vsxExpansionUlt?.id===id?g.vsxExpansionUlt.time:null;
  if(key==="chrono")return g.timeDilation>0?g.timeDilation:null;
  if(key==="pack")return g.allyBuffTimer>0?g.allyBuffTimer:null;
  if(key==="retake")return g.vsxRetakeBuff>0?g.vsxRetakeBuff:null;
  if(key==="buff")return g.ultimateBuffTimer>0?g.ultimateBuffTimer:null;
  return null;
}
function beginDisplayTimer(g,id){
  const d=defFor(id);
  if(d.mode==="variable"){
    const live=Math.max(g.player?.goldenBoostTimer||0,g.player?.tempFrenzy||0);
    if(live>0){g.vsxUltDurationTimer={id,mode:"timed",total:live,remaining:live,bound:null,synthetic:true};return}
    g.vsxUltDurationTimer={id,mode:"instant",total:.9,remaining:.9,bound:null,synthetic:true};return;
  }
  if(d.mode==="instant"||d.seconds===0){g.vsxUltDurationTimer={id,mode:"instant",total:.9,remaining:.9,bound:null,synthetic:true};return}
  if(!Number.isFinite(d.seconds)||d.seconds<=0)return;
  const source=runtimeSource(g,id);
  g.vsxUltDurationTimer={id,mode:"timed",total:Math.max(d.seconds,source?.remaining||0),remaining:source?.remaining??d.seconds,bound:source?.key||null,synthetic:!source};
}
function advanceDisplayTimer(g,dt){
  const q=g.vsxUltDurationTimer;if(!q)return;
  if(g.state==="GAME_OVER"||g.state==="TITLE"){g.vsxUltDurationTimer=null;return}
  if(g.state!=="PLAYING")return;
  if(q.bound){
    const rem=sourceRemaining(g,q.bound,q.id);
    if(rem==null)q.remaining=0;else q.remaining=Math.max(0,rem);
  }else{
    const speed=(typeof VSX_ADMIN!=="undefined"?(VSX_ADMIN.speed||1):1);
    q.remaining=Math.max(0,q.remaining-dt*speed);
  }
  if(q.remaining<=0)g.vsxUltDurationTimer=null;
}

function ensureHudMeta(){
  const ultLabel=document.getElementById("vsxUltLabel"),ability=ultLabel?.closest(".vsxAbility");if(!ability)return null;
  let meta=document.getElementById("vsxUltDurationMeta");
  if(!meta){meta=document.createElement("div");meta.id="vsxUltDurationMeta";meta.innerHTML='<span id="vsxUltDurationMetaLabel"></span><b id="vsxUltDurationMetaValue"></b>';ability.appendChild(meta)}
  return meta;
}
function renderHud(g=game){
  const meta=ensureHudMeta();if(!meta)return;
  const id=currentUltimateId(g),d=defFor(id),timer=g?.vsxUltDurationTimer;
  const lab=meta.querySelector("#vsxUltDurationMetaLabel"),val=meta.querySelector("#vsxUltDurationMetaValue"),ultText=document.getElementById("vsxUltText"),fill=document.getElementById("vsxUltFill"),ability=document.getElementById("vsxUltLabel")?.closest(".vsxAbility");
  meta.classList.remove("active","instant");ability?.classList.remove("vsxUltTimingActive");
  if(timer){
    if(timer.mode==="instant"){
      meta.classList.add("instant");lab.textContent=VSX.lang==="vi"?"ĐANG THI TRIỂN":"CAST";val.textContent=VSX.lang==="vi"?"TỨC THỜI":"INSTANT";
      if(ultText)ultText.textContent=VSX.lang==="vi"?"THI TRIỂN":"CAST";
      if(fill)fill.style.width=`${Math.max(0,Math.min(100,timer.remaining/timer.total*100))}%`;
      return;
    }
    meta.classList.add("active");ability?.classList.add("vsxUltTimingActive");
    lab.textContent=VSX.lang==="vi"?"ULT ĐANG HOẠT ĐỘNG":"ULT ACTIVE";
    const rem=Math.max(0,timer.remaining),shown=rem<10?rem.toFixed(1):Math.ceil(rem).toString();
    val.textContent=`${shown}s / ${compactSeconds(timer.total)}`;
    if(ultText)ultText.textContent=`${shown}s`;
    if(fill)fill.style.width=`${Math.max(0,Math.min(100,rem/Math.max(.001,timer.total)*100))}%`;
    return;
  }
  lab.textContent=VSX.lang==="vi"?"THỜI LƯỢNG ULT":"ULT DURATION";
  val.textContent=localizedDuration(id,true);
  if(d.mode==="instant")meta.classList.add("instant");
  /* Restore the normal charge presentation immediately after a timer/cast ends. */
  if(ultText)ultText.textContent=(g?.ultimateCharge||0)>=100?t("ready"):`${Math.floor(g?.ultimateCharge||0)}%`;
  if(fill)fill.style.width=`${Math.max(0,Math.min(100,g?.ultimateCharge||0))}%`;
}

function decorateSetup(){
  const grid=document.getElementById("vsxCharacterGrid");if(!grid)return;
  for(const card of grid.querySelectorAll(":scope > .vsxPick")){
    const id=card.dataset.characterId;if(!id||!CHARACTER_DEFINITIONS[id])continue;
    card.querySelectorAll(":scope > .vsxPickUltDurationRow").forEach(n=>n.remove());
    const uid=CHARACTER_DEFINITIONS[id].ultimate,d=defFor(uid),row=document.createElement("div");
    row.className="vsxPickUltDurationRow"+(d.mode==="instant"?" instant":"");
    row.innerHTML=`<span>${VSX.lang==="vi"?"THỜI LƯỢNG ULT":"ULT DURATION"}</span><b>${VSX.esc(localizedDuration(uid,true))}</b>`;
    card.appendChild(row);
  }
}
function decorateCollection(){
  const list=document.getElementById("vsxCodexList");if(!list)return;
  for(const card of list.querySelectorAll(":scope > .vsxCharacterCodexCard")){
    const id=card.dataset.codexId;if(!id||!CHARACTER_DEFINITIONS[id])continue;
    card.querySelectorAll(".vsxUltDurationInfo").forEach(n=>n.remove());
    const uid=CHARACTER_DEFINITIONS[id].ultimate,d=defFor(uid),detail=card.querySelector(".vsxCharacterCodexDetail");if(!detail)continue;
    const row=document.createElement("div");row.className="vsxUltDurationInfo"+(d.mode==="instant"?" instant":"");
    row.innerHTML=`<span>${VSX.lang==="vi"?"THỜI LƯỢNG TUYỆT KỸ":"ULT DURATION"}</span><b>${VSX.esc(localizedDuration(uid,false))}</b>`;
    detail.appendChild(row);
  }
}

const DUR_USE_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){
  const id=currentUltimateId(this),before=this.stats?.ultimates||0,r=DUR_USE_BASE.apply(this,arguments),after=this.stats?.ultimates||0;
  if(id&&after>before)beginDisplayTimer(this,id);
  renderHud(this);return r;
};
const DUR_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){const r=DUR_UPDATE_BASE.apply(this,arguments);advanceDisplayTimer(this,dt);renderHud(this);return r};
const DUR_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){const r=DUR_INIT_BASE.apply(this,arguments);this.vsxUltDurationTimer=null;return r};
const DUR_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(){const r=DUR_HUD_BASE.apply(this,arguments);renderHud(this);return r};

const DUR_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){const r=DUR_SETUP_BASE.apply(this,arguments);decorateSetup();return r};
const DUR_CODEX_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){const r=DUR_CODEX_BASE.call(this,cat);if(cat==="characters")decorateCollection();return r};

/* Initial mount + public API for future survivor packs. */
ensureHudMeta();renderHud(game);decorateSetup();
window.VSX_ULT_DURATION_API={
  defs:DEFS,
  register(id,config){if(!id)return false;DEFS[id]=typeof config==="number"?{seconds:config}:({...config});return true},
  get:id=>({...defFor(id)}),
  format:(id,compact=false)=>localizedDuration(id,compact),
  active:()=>game?.vsxUltDurationTimer?({...game.vsxUltDurationTimer}):null,
  missing:()=>Object.entries(CHARACTER_DEFINITIONS).filter(([,d])=>d.ultimate&&!Object.prototype.hasOwnProperty.call(DEFS,d.ultimate)).map(([id,d])=>({character:id,ultimate:d.ultimate})),
  selfTest(){
    const chars=Object.entries(CHARACTER_DEFINITIONS),missing=this.missing();
    return{characters:chars.length,registered:Object.keys(DEFS).length,missing,setupRows:document.querySelectorAll("#vsxCharacterGrid .vsxPickUltDurationRow").length,collectionRows:document.querySelectorAll("#vsxCodexList .vsxUltDurationInfo").length,hud:!!document.getElementById("vsxUltDurationMeta")};
  }
};
})();
