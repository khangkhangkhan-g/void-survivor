(function(){
'use strict';
const TAG='[VSX ARCHITECTURE AUTHORITY]';
const channels=new Map(),errors=[],features=new Map();
let seq=0,adminRefreshQueued=false,refs=null;
function list(channel){if(!channels.has(channel))channels.set(channel,[]);return channels.get(channel)}
function register(channel,id,fn,opt={}){
 if(!channel||!id||typeof fn!=='function')return false;
 const a=list(channel),old=a.findIndex(x=>x.id===id);if(old>=0)a.splice(old,1);
 a.push({id,fn,priority:Number(opt.priority)||0,order:seq++});a.sort((x,y)=>y.priority-x.priority||x.order-y.order);return true
}
function unregister(channel,id){const a=list(channel),i=a.findIndex(x=>x.id===id);if(i<0)return false;a.splice(i,1);return true}
function captureError(channel,id,e){const row={at:Date.now(),channel,id,error:String(e?.stack||e)};errors.push(row);while(errors.length>80)errors.shift();console.error(TAG,channel,id,e)}
function run(channel,ctx={}){const out=[];for(const h of [...list(channel)]){try{out.push({id:h.id,value:h.fn(ctx)})}catch(e){captureError(channel,h.id,e)}}return out}
function runHandled(channel,ctx={}){for(const h of [...list(channel)]){try{const v=h.fn(ctx);if(v===true)return{handled:true,value:undefined,id:h.id};if(v&&v.handled)return{...v,id:h.id}}catch(e){captureError(channel,h.id,e)}}return{handled:false}}
function effectiveState(){return window.VSX_ADMIN?.open?(VSX_ADMIN.previousState||game?.state):game?.state}
function encounterSnapshot(){const g=(typeof game!=='undefined'?game:null);let novel=false,final8=false;try{novel=!!window.VSX_NOVEL_ALLIES?.state?.().active}catch{}try{final8=!!window.VSX_FINAL8_ALLIES?.state?.().active}catch{}return{
 world:!!(g?.worldEvent||g?.vsxPendingEventBriefing||g?.state==='EVENT_BRIEFING'),
 mini:!!(window.VSX_MINIGAME_SYSTEM?.state?.().active||window.VSX_VOID_RELAY_SERIES?.active||window.VSX_TRIAL?.active||document.getElementById('vsxEventMinigame')?.classList.contains('active')||document.getElementById('vsxTrialScreen')?.classList.contains('active')),
 ally:!!(g?.activeRecruitChallenge||novel||final8),boss:!!(g?.boss||g?.miniBoss),meta:!!g?.metaBusy,state:effectiveState()
}}
const adminGuard={
 snapshot:encounterSnapshot,
 check(kind='generic'){
  const q=encounterSnapshot(),reasons=[];if(!game?.player)reasons.push('no-active-run');
  if(!['PLAYING','PAUSED','ADMIN'].includes(String(q.state||'')))reasons.push('invalid-run-state');
  if(kind==='mutation'&&(q.world||q.mini||q.ally||q.boss||q.meta))reasons.push('encounter-or-meta-active');
  if(kind==='encounter'&&(q.world||q.mini||q.ally||q.boss||q.meta))reasons.push('another-encounter-active');
  return{ok:!reasons.length,kind,reasons,...q}
 },
 announce(result){if(result?.ok)return true;try{VSX.announce?.('ADMIN SAFETY',(VSX.lang==='vi'?'Không thể ép trạng thái lúc này: ':'Cannot force state now: ')+(result?.reasons||[]).join(', '),'#ff9b71')}catch{}return false},
 require(kind){const r=this.check(kind);return r.ok||this.announce(r)}
};
function refreshAdmin(){if(adminRefreshQueued)return;adminRefreshQueued=true;queueMicrotask(()=>{adminRefreshQueued=false;run('admin.refresh',{game,tab:window.VSX_ADMIN?.tab})})}
function registerFeature(id,meta={}){features.set(id,{id,...meta});return true}
function featureAudit(){const rows=[...features.values()].map(x=>{let ok=true,detail=null;try{const r=typeof x.check==='function'?x.check():true;ok=r!==false&&r?.ok!==false;detail=r}catch(e){ok=false;detail=String(e)}return{id:x.id,system:x.system||null,owner:x.owner||null,ok,detail}});return{ok:rows.every(x=>x.ok),rows}}
function captureRefs(){refs={update:Game.prototype.update,render:Game.prototype.render,hud:Game.prototype.updateHUD,dash:Game.prototype.tryDash,codex:VSX.renderCodex,admin:VSX_ADMIN?.openPanel||null}}
function drift(){if(!refs)return{ok:true,pending:true};const cur={update:Game.prototype.update,render:Game.prototype.render,hud:Game.prototype.updateHUD,dash:Game.prototype.tryDash,codex:VSX.renderCodex,admin:VSX_ADMIN?.openPanel||null},changed=Object.keys(cur).filter(k=>cur[k]!==refs[k]);return{ok:!changed.length,changed}}
function selfTest(){return{version:'1.0.0',hooks:Object.fromEntries([...channels].map(([k,v])=>[k,v.map(x=>x.id)])),hookErrors:errors.slice(-12),adminGuard:adminGuard.check('generic'),features:featureAudit(),drift:drift()}}
const obs=new MutationObserver(refreshAdmin),screen=document.getElementById('vsxAdminScreen'),content=document.getElementById('vsxAdminContent');if(screen)obs.observe(screen,{attributes:true,attributeFilter:['class']});if(content)obs.observe(content,{childList:true,subtree:false});
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-admin-tab],#vsxAdminBtn,#vsxLangBtn'))refreshAdmin()},false);
window.VSX_ARCH={version:'1.0.0',register,unregister,run,runHandled,refreshAdmin,adminGuard,registerFeature,featureAudit,errors:()=>errors.slice(),selfTest,drift,sourceMetrics:null};
setTimeout(()=>{captureRefs();refreshAdmin();console.info(TAG,'ready',selfTest())},0);
})();
