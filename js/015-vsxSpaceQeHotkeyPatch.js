(function(){
"use strict";
function syncContinueHotkeys(){
  const chest=document.getElementById("chestContinue");
  if(chest) chest.textContent=VSX?.lang==="vi"?"SPACE - TIẾP TỤC":"SPACE - CONTINUE";
  const up=document.getElementById("vsxUpgradeContinue");
  if(up && document.getElementById("vsxUpgradeConfirm")?.classList.contains("active")){
    up.textContent=VSX?.lang==="vi"?"SPACE - TIẾP TỤC":"SPACE - CONTINUE";
  }
}
const _openChest=Game.prototype.openChest;
Game.prototype.openChest=function(){
  const r=_openChest.apply(this,arguments);
  syncContinueHotkeys();
  return r;
};
const _applyLang=window.vsxApplyLanguage;
if(typeof _applyLang==="function"){
  window.vsxApplyLanguage=function(){
    const r=_applyLang.apply(this,arguments);
    syncContinueHotkeys();
    return r;
  };
}
const _renderLevel=Game.prototype.renderLevelChoices;
Game.prototype.renderLevelChoices=function(){
  const r=_renderLevel.apply(this,arguments);
  const cur=this.player?.energySkipStacks*10||0;
  if(skipUpgradeBtn){
    skipUpgradeBtn.innerHTML=`Q - ${t("skip")}<span class="boost">${VSX.lang==="vi"?`Tăng XP từ lượt bỏ: +${cur}% -> +${cur+10}%`:`Energy / XP gain: +${cur}% -> +${cur+10}% from skips`}</span>`;
  }
  if(rerollUpgradeBtn){
    const left=this.rerollsRemaining??0,max=this.rerollsMax??3;
    rerollUpgradeBtn.disabled=left<=0;
    rerollUpgradeBtn.innerHTML=`E - ${t("reroll")} (${left}/${max})<span class="boost">${left>0?(VSX.lang==="vi"?"Đổi mới cả 3 thẻ mà không tiêu cấp":"Refresh all 3 choices without spending this level"):(VSX.lang==="vi"?"Đã hết reroll":"No rerolls remaining this run")}</span>`;
  }
  return r;
};

// Final state-aware keyboard layer:
// SPACE = Continue/confirm screens; Q = Skip; E = Reroll only while Level Up.
// Gameplay keeps SPACE = Ultimate and E = Interact.
document.addEventListener("keydown",function(ev){
  if(!window.game) return;
  if(game.state==="LEVEL_UP"){
    if(ev.code==="KeyQ"){
      ev.preventDefault(); ev.stopImmediatePropagation();
      game.skipLevelUp(); return;
    }
    if(ev.code==="KeyE"){
      ev.preventDefault(); ev.stopImmediatePropagation();
      game.rerollLevelUp(); return;
    }
    if(ev.code==="Digit4"||ev.code==="Digit5"){
      ev.preventDefault(); ev.stopImmediatePropagation(); return;
    }
  }
  if(ev.code==="Space"){
    if(game.state==="CHEST_REWARD"){
      ev.preventDefault(); ev.stopImmediatePropagation();
      game.closeChest(); return;
    }
    if(game.state==="UPGRADE_CONFIRM"){
      ev.preventDefault(); ev.stopImmediatePropagation();
      closeUpgradeConfirm(); return;
    }
  }
},true);

syncContinueHotkeys();
})();
