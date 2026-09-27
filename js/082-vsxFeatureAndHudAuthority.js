(function(){
'use strict';
const L=(en,vi)=>(typeof VSX!=='undefined'&&VSX.lang==='vi')?vi:en;
const defs={
 void_auction:{system:'minigame',owner:'VSX_MINIGAME_SYSTEM',check:()=>({ok:!!window.VSX_MINIGAME_SYSTEM?.ids?.includes?.('void_auction')})},
 crown_hunt:{system:'world-event',owner:'VSX_WORLD_EVENT_SYSTEM',check:()=>({ok:!!WORLD_EVENT_DEFINITIONS?.crown_hunt,minimap:true})},
 gold_rush:{system:'world-event + target-priority',owner:'VSX_WORLD_EVENT_SYSTEM',check:()=>({ok:!!WORLD_EVENT_DEFINITIONS?.gold_rush,targetPriority:true})},
 mimic_moth:{system:'ally-recruit',owner:'VSX_NOVEL_ALLIES',check:()=>({ok:!!window.VSX_NOVEL_ALLIES?.ids?.includes?.('mimic_moth'),bulletLure:true})},
 triple_image:{system:'passive',owner:'PASSIVE_DEFINITIONS',check:()=>({ok:!!PASSIVE_DEFINITIONS?.triple_image,characterWeaponSync:true})}
};
for(const [id,d] of Object.entries(defs))window.VSX_ARCH?.registerFeature(id,d);
function visible(el){if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>1&&r.height>1}
function overlap(a,b,pad=2){const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();return A.left<B.right-pad&&A.right>B.left+pad&&A.top<B.bottom-pad&&A.bottom>B.top+pad}
const HUD_IDS=['statsHud','timerHud','inventoryHud','vsxActionHud','vsxAllyHud','vsxMinimapWrap','bossWrap','vsxEventHud','vsxMiniBossHud','xpWrap','vsxCurrencyHud'];
function hudAudit(){const els=HUD_IDS.map(id=>document.getElementById(id)).filter(visible),pairs=[];for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){if(overlap(els[i],els[j]))pairs.push([els[i].id,els[j].id])}return{ok:!pairs.length&&document.documentElement.scrollWidth<=innerWidth,pairs,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,viewport:[innerWidth,innerHeight],visible:els.map(x=>x.id)}}
let lastAudit=0,last=null;function hudAfter(){const now=performance.now();if(now-lastAudit<350)return;lastAudit=now;last=hudAudit();document.body.classList.toggle('vsxHudConflictDetected',!last.ok)}
window.VSX_ARCH?.register('hud.after','hud.layout-audit',hudAfter,{priority:-100});
function featureAudit(){const arch=window.VSX_ARCH?.featureAudit?.()||{ok:false,rows:[]};const d=window.VSX_ENCOUNTER_DIRECTOR?.state?.(),overlapState=!!(game?.worldEvent&&(window.VSX_MINIGAME_SYSTEM?.state?.().active||window.VSX_VOID_RELAY_SERIES?.active));return{ok:arch.ok&&!overlapState,features:arch.rows,encounterOverlap:overlapState,director:d?{version:d.version,phase:d.phase,active:d.active?{...d.active}:null,nextIn:Number(d.nextIn)||0}:null}}
function adminCard(){if(!window.VSX_ADMIN?.open||VSX_ADMIN.tab!=='run')return;const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||document.getElementById('vsxArchitectureQaAdmin'))return;const c=document.createElement('div');c.id='vsxArchitectureQaAdmin';c.className='vsxAdminCard';const q=window.VSX_ARCH?.selfTest?.(),h=hudAudit(),f=featureAudit();c.innerHTML=`<h3>${L('ARCHITECTURE · AUTHORITY QA','KIẾN TRÚC · QA AUTHORITY')}</h3><p>${L('Central hooks own new Update/Render/HUD/Dash/Codex/Admin extensions. Legacy wrappers remain frozen; new features must register here instead of wrapping Game methods again.','Hook trung tâm sở hữu các extension Update/Render/HUD/Dash/Codex/Admin mới. Wrapper cũ được đóng băng; feature mới phải đăng ký ở đây thay vì wrap Game method thêm.')}</p><div class="vsxPatchBadges"><span>HOOK BUS</span><span>ADMIN GUARD</span><span>HUD AUDIT</span><span>FEATURE OWNERS</span></div><pre>${VSX.esc(JSON.stringify({architecture:q,hud:h,features:f},null,2))}</pre>`;grid.appendChild(c)}
window.VSX_ARCH?.register('admin.refresh','architecture.qa',adminCard,{priority:100});
window.VSX_FEATURE_AUTHORITY={version:'1.0.0',definitions:defs,audit:featureAudit};
window.VSX_HUD_AUTHORITY={version:'1.0.0',audit:hudAudit,last:()=>last};
})();
