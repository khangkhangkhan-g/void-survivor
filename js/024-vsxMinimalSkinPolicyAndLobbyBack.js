(function(){
"use strict";
/* Skin policy: player cosmetics are circular fills/gradients + number/effects only.
   Future SKIN_DEFINITIONS automatically inherit the minimal orb renderer above. */
window.VSX_SKIN_RENDER_POLICY="minimal-orb";

function backLabel(){return VSX?.lang==="vi"?"QUAY VỀ":"BACK"}
function ensureBackChip(screen){
  if(!screen||screen.querySelector(':scope > .vsxBackHotkeyChip'))return;
  const chip=document.createElement('div');chip.className='vsxBackHotkeyChip';chip.innerHTML=`<kbd>ESC</kbd><span>${backLabel()}</span>`;screen.appendChild(chip);
}
function refreshBackHints(){
  for(const id of ['vsxSetupScreen','vsxArmoryScreen','vsxSettingsScreen','vsxCollectionScreen','vsxAdminScreen'])ensureBackChip(document.getElementById(id));
  const titlePanel=document.querySelector('#titleScreen .panel');if(titlePanel&&!titlePanel.querySelector('.vsxMenuEscHint')){const n=document.createElement('div');n.className='vsxMenuEscHint';n.textContent=VSX?.lang==='vi'?'ESC · QUAY VỀ TRONG MENU':'ESC · BACK IN MENUS';titlePanel.appendChild(n)}
  document.querySelectorAll('.vsxBackHotkeyChip span').forEach(x=>x.textContent=backLabel());
  const hint=document.querySelector('#titleScreen .vsxMenuEscHint');if(hint)hint.textContent=VSX?.lang==='vi'?'ESC · QUAY VỀ TRONG MENU':'ESC · BACK IN MENUS';
}
function lobbyBack(){
  if(document.getElementById('vsxAdminScreen')?.classList.contains('active')||window.VSX_ADMIN?.open){if(typeof adminClose==='function')adminClose();return true}
  const routes=[['vsxSettingsScreen','vsxSettingsBack'],['vsxArmoryScreen','vsxArmoryBack'],['vsxCollectionScreen','vsxCollectionBack'],['vsxSetupScreen','vsxSetupBack']];
  for(const [sid,bid] of routes){const sc=document.getElementById(sid);if(sc?.classList.contains('active')){const b=document.getElementById(bid);if(b)b.click();else{sc.classList.remove('active');document.getElementById('titleScreen')?.classList.add('active')}return true}}
  const go=document.getElementById('gameOverScreen'),menu=document.getElementById('menuBtn');
  if(go?.classList.contains('active')){menu?.click();return true}
  return false;
}
window.vsxLobbyBack=lobbyBack;
addEventListener('load',refreshBackHints,{once:true});setTimeout(refreshBackHints,0);
/* Static screens already exist; avoid a subtree observer that can self-trigger on text updates. */
document.addEventListener('keydown',e=>{if(e.code!=="Escape"||e.ctrlKey||e.altKey||e.metaKey)return;if(lobbyBack()){e.preventDefault();e.stopImmediatePropagation();game?.input?.clear?.()}},true);
if(typeof vsxApplyLanguage==='function'){const base=vsxApplyLanguage;vsxApplyLanguage=function(){const r=base.apply(this,arguments);refreshBackHints();return r}}
})();
