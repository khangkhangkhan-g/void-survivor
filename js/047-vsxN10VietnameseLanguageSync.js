(()=>{
'use strict';
const BASE=window.vsxApplyLanguage;
if(typeof BASE!=='function'||BASE.__n10ViSync)return;
function refreshN10LocalizedSurfaces(){
  try{
    if(document.getElementById('vsxArmoryScreen')?.classList.contains('active') && typeof window.renderArmory==='function') window.renderArmory();
    if(document.getElementById('vsxCollectionScreen')?.classList.contains('active') && typeof VSX?.showCollection==='function') VSX.showCollection();
    if(document.getElementById('vsxSetupScreen')?.classList.contains('active') && typeof VSX?.renderSetup==='function') VSX.renderSetup();
    window.VSX_FOOTBALL_LAYOUT_HELPERS?.refreshN10?.();
  }catch(_){ }
}
function wrapped(){
  const r=BASE.apply(this,arguments);
  queueMicrotask(refreshN10LocalizedSurfaces);
  return r;
}
wrapped.__n10ViSync=true;
window.vsxApplyLanguage=wrapped;
})();
