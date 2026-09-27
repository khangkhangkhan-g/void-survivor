(function(){
'use strict';
const L=(en,vi)=>VSX.lang==='vi'?vi:en;
const esc=s=>VSX.esc(String(s??''));
// Materialize mutations for every currently loaded eligible weapon; future late weapons are still covered lazily by scan/processMeta.
for(const id of Object.keys(WEAPON_DEFINITIONS))vsxEnsureWeaponMutations(id);

// Collection: keep the 30 narrative-allies count intact, but explain Shop Contract Allies as a separate temporary system.
const CODEX_BASE_MUTATION_CONTRACT=VSX.renderCodex;
VSX.renderCodex=function(cat){
 const r=CODEX_BASE_MUTATION_CONTRACT.call(this,cat);
 if(cat==='allies')queueMicrotask(()=>{
  const list=document.getElementById('vsxCodexList');if(!list||document.getElementById('vsxContractCollectionNote'))return;
  const n=document.createElement('div');n.id='vsxContractCollectionNote';
  n.innerHTML=`<b>${L('SHOP CONTRACT ALLIES · TEMPORARY','ĐỒNG MINH HỢP ĐỒNG SHOP · TẠM THỜI')}</b><br>${L(`Shop Contract Allies are separate from the 30 narrative allies. They deploy from Wave 1 through Wave ${CONTRACT_LAST_WAVE} and automatically depart when Wave ${CONTRACT_LEAVE_WAVE} begins.`,`Đồng minh Hợp Đồng trong Shop tách riêng khỏi 30 đồng minh cốt truyện. Chúng xuất trận từ Đợt 1 đến hết Đợt ${CONTRACT_LAST_WAVE} và tự rời trận khi Đợt ${CONTRACT_LEAVE_WAVE} bắt đầu.`)}`;
  list.prepend(n);
 });
 window.VSX_ARCH?.run('codex.after',{cat,result:r});
 return r;
};

function mutationContractSelfTest(){
 const eligible=Object.keys(WEAPON_DEFINITIONS).filter(id=>!WEAPON_DEFINITIONS[id].rewardOnly),missing=eligible.filter(id=>!(WEAPON_MUTATIONS[id]||[]).length);
 const a=game?.contractAlly,p=game?.player,dist=a&&p?Math.hypot(a.x-p.x,a.y-p.y):null,min=a&&p?(p.radius||16)+a.radius+24:null;
 return{eligibleWeapons:eligible.length,mutationSets:Object.keys(WEAPON_MUTATIONS).filter(id=>(WEAPON_MUTATIONS[id]||[]).length).length,missingMutationSets:missing,contractLastWave:CONTRACT_LAST_WAVE,contractLeaveWave:CONTRACT_LEAVE_WAVE,contract:a?{id:a.id,dead:a.dead,leave:a.leave,distanceToPlayer:dist,minSeparation:min}:null};
}
window.VSX_MUTATION_CONTRACT_FIX={selfTest:mutationContractSelfTest,ensureMutations:()=>{for(const id of Object.keys(WEAPON_DEFINITIONS))vsxEnsureWeaponMutations(id);return mutationContractSelfTest()}};

function injectAdmin(){
 const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');
 if(!grid||!window.VSX_ADMIN?.open||VSX_ADMIN.tab!=='allies'||document.getElementById('vsxAdminMutationContractQa'))return;
 const c=document.createElement('div');c.id='vsxAdminMutationContractQa';c.className='vsxAdminCard';
 c.innerHTML=`<h3>${L('MUTATION + CONTRACT ALLY · QA','ĐỘT BIẾN + ALLY HỢP ĐỒNG · QA')}</h3><p>${L('Checks late-loaded mutation coverage, Wave-6 contract expiry and player/contract formation spacing.','Kiểm tra mutation của weapon load muộn, Hợp Đồng hết sau Đợt 6 và khoảng cách đội hình khỏi sprite người chơi.')}</p><div class="row"><button id="admContractSpawnRaven">${L('SPAWN RAVEN CONTRACT','SPAWN HỢP ĐỒNG QUẠ')}</button><button id="admContractW6">W6</button><button id="admContractW7">W7</button></div><div class="row"><button id="admMutationLateTest">${L('OPEN LATE-WEAPON MUTATION','MỞ MUTATION WEAPON LOAD MUỘN')}</button></div><pre id="admMutationContractOut"></pre>`;
 grid.appendChild(c);const out=c.querySelector('#admMutationContractOut'),refresh=()=>out.textContent=JSON.stringify(mutationContractSelfTest(),null,2);
 c.querySelector('#admContractSpawnRaven').onclick=()=>{if(!game?.player)return;game.contractAlly=new VSX_ContractAlly('raven');refresh()};
 c.querySelector('#admContractW6').onclick=()=>{if(!game?.player)return;game.time=301;game._lastMetaWave=5;game.wave=6;refresh()};
 c.querySelector('#admContractW7').onclick=()=>{if(!game?.player)return;game.time=361;game._lastMetaWave=6;game.wave=7;refresh()};
 c.querySelector('#admMutationLateTest').onclick=()=>{if(!game?.player)return;const w=game.player.weapons.find(x=>x.id==='samba_streetball')||{id:'samba_streetball',def:WEAPON_DEFINITIONS.samba_streetball,level:5,mutationId:null};game.queueMeta('mutation',{weapon:w},0);game.processMeta();refresh()};
 refresh();
}
window.VSX_ARCH?.register('admin.refresh','mutation.contract',injectAdmin,{priority:45});queueMicrotask(()=>window.VSX_ARCH?.refreshAdmin?.());
})();
