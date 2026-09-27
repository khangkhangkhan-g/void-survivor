(()=>{
'use strict';
const SIX={cr7_goat:{num:'7',cls:'pt',skin:'cr7_portugal_7'},m10_goat:{num:'10',cls:'ar',skin:'m10_argentina_10'},n10_neymar:{num:'10',cls:'brn10',skin:'n10_brazil_10'},rm_mbappe_k10:{num:'10',cls:'fr',skin:'rm_mbappe_france_10'},rm_vini_v7:{num:'7',cls:'brv7',skin:'rm_vini_brazil_7'},rm_jude_j5:{num:'5',cls:'en',skin:'rm_jude_england_5'}};
const L=(en,vi)=>VSX.lang==='vi'?vi:en;
function circle(id){const x=SIX[id];return x?`<span class="shirt vsxSixSkinCircle ${x.cls}"><b>${x.num}</b></span>`:''}
function skinName(id){const x=SIX[id];return x?SKIN_DEFINITIONS[x.skin]?.name?.[VSX.lang]||'':''}
function decorate(){
  document.querySelectorAll('#vsxCharacterGrid .vsxPick').forEach(card=>{const id=card.dataset.characterId;if(!SIX[id])return;const b=card.querySelector(':scope > .vsxGoatSetupBadge');if(b)b.innerHTML=`${circle(id)}<span><small>${L('SIGNATURE SKIN','SKIN ĐẶC TRƯNG')}</small><br>${skinName(id)}</span>`});
  document.querySelectorAll('#vsxUnifiedSurvivorShop [data-rm-card]').forEach(card=>{const desc=card.querySelector('.vsxUnifiedSurvivorDesc'),row=card.querySelector('.rmSurvJerseyRow');if(desc&&row&&desc.nextElementSibling!==row)desc.after(row)});
}
function overflow(){const bad=[];document.querySelectorAll('#vsxUnifiedSurvivorShop [data-rm-card],#vsxRoyalThreePackage .rmFighter,#vsxRoyalThreePackage .rmBuyCard').forEach(el=>{if(el.clientWidth&&el.scrollWidth>el.clientWidth+2)bad.push(el.dataset.rmCard||el.className)});return bad}
const A=renderArmory;renderArmory=function(){const r=A.apply(this,arguments);queueMicrotask(decorate);return r};
const S=VSX.renderSetup;VSX.renderSetup=function(){const r=S.apply(this,arguments);queueMicrotask(decorate);return r};
const C=VSX.renderCodex;VSX.renderCodex=function(cat){const r=C.apply(this,arguments);queueMicrotask(decorate);return r};
queueMicrotask(decorate);
window.VSX_ROYAL_THREE_AUDIT={selfTest(){const e=[];Object.values(SIX).forEach(x=>{if(!SKIN_DEFINITIONS[x.skin])e.push('missing '+x.skin)});const o=overflow();if(o.length)e.push('overflow '+o.join('|'));return{ok:!e.length,errors:e,paceWave1:1.5,paceWave10:4,judeSpeed:1.5,mbappeUltBurst:5,viniUltBurst:5,burstSeconds:3,setupBadges:document.querySelectorAll('#vsxCharacterGrid .vsxSixSkinCircle').length,rmCards:document.querySelectorAll('#vsxUnifiedSurvivorShop [data-rm-card]').length}}};
})();
