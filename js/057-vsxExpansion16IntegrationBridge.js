(()=>{
'use strict';
const X16_IDS=window.VSX_EXPANSION16?.ids||[];
const X16_SET=new Set(X16_IDS);
/* The Starter-12 economy owns the canonical Shop catalog. Expansion16 is loaded
   before it in this corrected build so the catalog snapshots all 16 characters. */
function x16Refresh(){try{window.VSX_EXPANSION16?.refresh?.()}catch(e){console.warn('[X16 refresh]',e)}}
if(typeof renderArmory==='function'){
  const X16_FINAL_ARMORY_BASE=renderArmory;
  renderArmory=function(){const r=X16_FINAL_ARMORY_BASE.apply(this,arguments);if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='survivors')queueMicrotask(x16Refresh);return r};
  window.renderArmory=renderArmory;
}
if(typeof VSX?.renderSetup==='function'){
  const X16_FINAL_SETUP_BASE=VSX.renderSetup;
  VSX.renderSetup=function(){const r=X16_FINAL_SETUP_BASE.apply(this,arguments);queueMicrotask(x16Refresh);return r};
}
if(typeof VSX?.renderCodex==='function'){
  const X16_FINAL_CODEX_BASE=VSX.renderCodex;
  VSX.renderCodex=function(cat){const r=X16_FINAL_CODEX_BASE.apply(this,arguments);if(cat==='characters')queueMicrotask(x16Refresh);return r};
}
window.VSX_EXPANSION16_INTEGRATION_QA=function(){
  const errors=[];
  const econ=window.VSX_SURVIVOR_ECONOMY?.catalog;
  if(!econ)errors.push('survivor economy catalog unavailable');
  else for(const id of X16_IDS){if(!econ.ordered?.includes(id))errors.push(`${id}: not in canonical Shop catalog`)}
  for(const id of X16_IDS){
    const d=CHARACTER_DEFINITIONS[id];
    if(!d)errors.push(`${id}: character missing`);
    if(d&&!WEAPON_DEFINITIONS[d.weapon])errors.push(`${id}: weapon missing`);
    if(d&&typeof ATTACK_BEHAVIORS[WEAPON_DEFINITIONS[d.weapon]?.behavior]!=='function')errors.push(`${id}: attack behavior missing`);
  }
  const shop=document.querySelectorAll('#vsxUnifiedSurvivorShop [data-store-character^="x16_"]').length;
  const pick=X16_IDS.filter(id=>document.querySelector(`#vsxCharacterGrid .vsxPick[data-character-id="${id}"]`)).length;
  const collection=X16_IDS.filter(id=>document.querySelector(`#vsxCodexList [data-codex-id="${id}"]`)).length;
  return{ok:!errors.length,errors,ids:X16_IDS.length,catalog:X16_IDS.filter(id=>econ?.ordered?.includes(id)).length,shop,pick,collection};
};
queueMicrotask(()=>{
  x16Refresh();
  if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='survivors'&&document.getElementById('vsxArmoryScreen')?.classList.contains('active'))renderArmory();
});
})();
