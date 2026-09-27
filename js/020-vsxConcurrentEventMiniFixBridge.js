(function(){
"use strict";
// During a Void Trial, the normal Game loop is paused. Keep only the event cooldown clock alive.
window.VSX_TRIAL_EVENT_TICK=function(dt){
 if(!VSX_TRIAL?.active||!game?.player||game.worldEvent)return;
 game.vsxWorldCooldown=Math.max(0,(game.vsxWorldCooldown??30)-dt);
 game.vsxEventReady=game.vsxWorldCooldown<=0;
 if(game.vsxEventReady){const started=game.startWorldEvent?.();if(started)game.vsxEventReady=false}
};
function setMiniAttr(){const sc=document.getElementById("vsxEventMinigame");if(!sc)return;const owner=sc.dataset.owner||"";if(!owner||owner==="legacy")sc.dataset.mini=VSX.eventDebug?.mini?.id||sc.dataset.mini||""}
const _startMini=VSX.startEventMinigame;
VSX.startEventMinigame=function(id){if(VSX_ADMIN?.open&&typeof adminClose==="function")adminClose();const r=_startMini(id);setMiniAttr();return r};
// Existing internal callers use the local function, so observe screen activation to keep control layout in sync.
const miniScreen=document.getElementById("vsxEventMinigame");if(miniScreen)new MutationObserver(()=>{if(miniScreen.classList.contains("active")&&(!miniScreen.dataset.owner||miniScreen.dataset.owner==="legacy")){miniScreen.dataset.mini=VSX.eventDebug?.mini?.id||miniScreen.dataset.mini||""}}).observe(miniScreen,{attributes:true,attributeFilter:["class"]});
const left=document.getElementById("vsxMiniLeft"),right=document.getElementById("vsxMiniRight"),action=document.getElementById("vsxMiniAction");
function bindHold(btn,codes){if(!btn)return;const down=e=>{e.preventDefault();for(const c of codes)VSX.eventDebug?.mini?.keys?.add?.(c);btn.classList.add("vsxMiniPressed")},up=e=>{e?.preventDefault?.();for(const c of codes)VSX.eventDebug?.mini?.keys?.delete?.(c);btn.classList.remove("vsxMiniPressed")};btn.addEventListener("pointerdown",down);btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("pointerleave",up)}
bindHold(left,["KeyA","ArrowLeft"]);bindHold(right,["KeyD","ArrowRight"]);
if(action){action.addEventListener("pointerdown",e=>{e.preventDefault();action.classList.add("vsxMiniPressed");document.dispatchEvent(new KeyboardEvent("keydown",{code:"Space",bubbles:true,cancelable:true}))});action.addEventListener("pointerup",e=>{e.preventDefault();action.classList.remove("vsxMiniPressed");document.dispatchEvent(new KeyboardEvent("keyup",{code:"Space",bubbles:true,cancelable:true}))})}
addEventListener("blur",()=>{VSX.eventDebug?.mini?.keys?.clear?.();left?.classList.remove("vsxMiniPressed");right?.classList.remove("vsxMiniPressed");action?.classList.remove("vsxMiniPressed")});
})();
