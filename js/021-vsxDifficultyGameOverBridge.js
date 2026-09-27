(function(){
"use strict";

// Final setup renderer from the survivor expansion used Object.entries(), which
// places the late-added Easy difficulty after Nightmare. Rebuild only this row.
const VSX_DIFF_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){
  const r=VSX_DIFF_SETUP_BASE.apply(this,arguments);
  const dg=document.getElementById("vsxDifficulty");
  if(dg){
    dg.innerHTML="";
    for(const id of ["easy","normal","hard","nightmare"]){
      const d=DIFFICULTY_DEFINITIONS[id];
      if(!d)continue;
      const b=document.createElement("button");
      b.dataset.difficulty=id;
      b.className=VSX.selectedDifficulty===id?"selected":"";
      b.textContent=d.name[VSX.lang];
      b.onclick=()=>{VSX.selectedDifficulty=id;VSX.renderSetup()};
      dg.appendChild(b);
    }
  }
  return r;
};

function goLabel(en,vi){return VSX.lang==="vi"?vi:en}
function fmtNum(v){return Math.round(Number(v)||0).toLocaleString("en-US")}
function renderDeathDashboard(g){
  const e=document.getElementById("gameOverStats");
  if(!e||!g?.player)return;
  const s=g.stats||{};
  const total=Math.max(1,Number(s.damageDealt)||0);
  const top=Object.entries(s.damageBy||{}).filter(([,v])=>Number(v)>0).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxTop=Math.max(1,...top.map(([,v])=>Number(v)||0));
  const metric=(label,value,primary=false)=>`<div class="vsxDeathMetric${primary?' primary':''}"><small>${VSX.esc(label)}</small><strong>${VSX.esc(value)}</strong></div>`;
  const stat=(label,value)=>`<div class="vsxDeathStat"><span>${VSX.esc(label)}</span><b>${VSX.esc(String(value))}</b></div>`;
  const action=(label,value)=>`<div class="vsxDeathAction"><small>${VSX.esc(label)}</small><b>${VSX.esc(String(value??0))}</b></div>`;
  const sourceName=id=>WEAPON_DEFINITIONS[id]?weaponName(id):id.replaceAll("_"," ").replace(/\b\w/g,m=>m.toUpperCase());
  const damageRows=top.length?top.map(([id,v],i)=>{
    const pct=Number(v)/total*100,rel=Number(v)/maxTop*100;
    return `<div class="vsxDamageRow"><div class="vsxDamageHead"><span class="vsxDamageRank">#${i+1}</span><span class="vsxDamageName" title="${VSX.esc(sourceName(id))}">${VSX.esc(sourceName(id))}</span><span class="vsxDamageValue">${fmtNum(v)} · ${pct.toFixed(1)}%</span></div><div class="vsxDamageBar"><i style="width:${clamp(rel,2,100)}%"></i></div></div>`;
  }).join(""):`<div style="color:#607a91;font-size:10px">—</div>`;
  const currency=g._lastCurrency||{score:0,kills:0};
  e.innerHTML=`<div class="vsxDeathSummary">
    <div class="vsxDeathHero">
      ${metric(goLabel("SURVIVAL","SỐNG SÓT"),fmtTime(g.time||0),true)}
      ${metric(goLabel("SCORE","ĐIỂM"),fmtNum(g.score),true)}
      ${metric(goLabel("KILLS","HẠ GỤC"),fmtNum(g.kills))}
      ${metric(goLabel("LEVEL","CẤP"),String(g.player.level||1))}
      ${metric(goLabel("BOSSES","BOSS"),String(g.bossesDefeated||0))}
    </div>
    <div class="vsxDeathBody">
      <section class="vsxDeathPanel">
        <div class="vsxDeathPanelTitle">${goLabel("RUN STATISTICS","THỐNG KÊ TRẬN")}</div>
        <div class="vsxDeathStatsGrid">
          ${stat(t("damageDealt"),fmtNum(s.damageDealt))}
          ${stat(t("damageTaken"),fmtNum(s.damageTaken))}
          ${stat(t("damagePrevented"),fmtNum(s.damagePrevented))}
          ${stat(t("healing"),fmtNum(s.healing))}
          ${stat(t("xpCollected"),fmtNum(s.xp))}
          ${stat(goLabel("HIGHEST HIT","ĐÒN CAO NHẤT"),fmtNum(s.highestHit))}
        </div>
        <div class="vsxDeathActions">
          ${action(goLabel("REROLLS","ĐỔI LẠI"),s.rerolls)}
          ${action(goLabel("SKIPS","BỎ QUA"),s.skips)}
          ${action(goLabel("DASHES","LƯỚT"),s.dashes)}
          ${action(goLabel("ULTIMATES","TUYỆT KỸ"),s.ultimates)}
        </div>
      </section>
      <section class="vsxDeathPanel">
        <div class="vsxDeathPanelTitle">${t("topDamage")}</div>
        <div class="vsxDamageList">${damageRows}</div>
      </section>
    </div>
    <div class="vsxDeathCurrency">
      <div class="vsxDeathCurrencyTitle">${t("currencyEarned")}</div>
      <div class="vsxDeathCurrencyValue"><span>${t("spendScore")}</span><b>+${fmtNum(currency.score)}</b></div>
      <div class="vsxDeathCurrencyValue"><span>${t("spendKills")}</span><b>+${fmtNum(currency.kills)}</b></div>
    </div>
  </div>`;
  const eyebrow=document.querySelector("#gameOverScreen .vsxPanelEyebrow");
  if(eyebrow)eyebrow.textContent=goLabel("RUN TERMINATED","TRẬN ĐÃ KẾT THÚC");
  const copy=document.querySelector("#gameOverScreen .vsxOverlayCopy");
  if(copy)copy.textContent=goLabel("Run summary and combat breakdown.","Tổng kết trận đấu và hiệu suất chiến đấu.");
}

const VSX_DEATH_END_BASE=Game.prototype.endGame;
Game.prototype.endGame=function(){
  const r=VSX_DEATH_END_BASE.apply(this,arguments);
  if(this.state==="GAME_OVER")renderDeathDashboard(this);
  return r;
};

window.VSX_RENDER_DEATH_DASHBOARD=renderDeathDashboard;
})();
