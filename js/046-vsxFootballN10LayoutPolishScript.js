(()=>{
'use strict';
const N10_ID='n10_neymar', N10_WEAPON='samba_streetball', N10_ULT='the_last_samba', N10_SKIN='n10_brazil_10';
const L=(en,vi)=>(typeof VSX!=='undefined'&&VSX.lang==='vi')?vi:en;
const esc=v=>(typeof VSX!=='undefined'&&VSX.esc)?VSX.esc(v):String(v??'');
const football=window.VSX_FOOTBALL_LAYOUT_REGISTRY=Object.assign(window.VSX_FOOTBALL_LAYOUT_REGISTRY||{}, {
  cr7_goat:{id:'cr7_goat',number:'7',skin:'cr7_portugal_7',jersey1:'#b51f31',jersey2:'#d9b24c',accent:'#d23346',bundle:'GOAT RIVALS',skillClass:'',skillTitle:{en:'FINISHER INSTINCT',vi:'FINISHER INSTINCT'},setupSummary:{en:'Finishing Zones · Aerial Dominance · Second Ball · Explosive Run · Clutch 90+',vi:'Điểm dứt điểm · Không chiến · Sút bồi · Bứt tốc xâm nhập · Clutch 90+'},collectionTitle:{en:'GOAT SKILLSET · FINISHER INSTINCT',vi:'GOAT SKILLSET · FINISHER INSTINCT'},collectionBody:{en:'Finishing Zones reward positioning. Double Dash can trigger Explosive Run. Crosses gain Aerial finish windows, missed kills can leave a Second Ball, and Bosses below 25% HP activate Clutch 90+.',vi:'Điểm Dứt Điểm thưởng cho chạy chỗ đúng vị trí. Dash kép có thể kích hoạt Bứt Tốc Xâm Nhập. Tạt bóng mở cửa sổ không chiến, pha chưa kết liễu có thể để lại bóng hai và Boss dưới 25% HP kích hoạt Clutch 90+.'}},
  m10_goat:{id:'m10_goat',number:'10',skin:'m10_argentina_10',jersey1:'#eef9ff',jersey2:'#65c9ff',accent:'#76cfff',bundle:'GOAT RIVALS',skillClass:'messi',skillTitle:{en:'DRIBBLE FLOW',vi:'DRIBBLE FLOW'},setupSummary:{en:'La Pausa · Nutmeg Gate · One-Two · Vision · Ankle Breaker',vi:'La Pausa · Xâu kim · Bật tường · Vision · Ankle Breaker'},collectionTitle:{en:'GOAT SKILLSET · DRIBBLE FLOW',vi:'GOAT SKILLSET · DRIBBLE FLOW'},collectionBody:{en:'Sharp turns, near-misses and Nutmegs build Flow. La Pausa fools nearby pursuers, One-Two creates return-pass angles, full Flow arms Vision, and repeated left-right cuts can trigger Ankle Breaker.',vi:'Đổi hướng gắt, né sát và xâu kim sẽ tích Flow. La Pausa đánh lừa kẻ bám đuổi, Bật Tường tạo góc chuyền trả, Flow đầy mở Vision và chuỗi đảo trái-phải có thể kích hoạt Ankle Breaker.'}},
  [N10_ID]:{id:N10_ID,number:'10',skin:N10_SKIN,jersey1:'#ffd919',jersey2:'#17884f',accent:'#0e7b49',bundle:'THE LAST SAMBA',skillClass:'neymar',skillTitle:{en:'SAMBA FLOW',vi:'NHỊP SAMBA'},setupSummary:{en:'Bait · Trick Chain · Escape · Create',vi:'Nhử địch · Nối trick · Thoát ra · Tạo cơ hội'},collectionTitle:{en:'GOAT SKILLSET · SAMBA FLOW',vi:'GOAT SKILLSET · NHỊP SAMBA'},collectionBody:{en:'Samba Flow is spent on tricks instead of raw DPS. Neymar plays close to danger, baits enemies into Showboat windows, draws fouls, spawns Free Kick spots and is rewarded for chaining different tricks instead of repeating one move.',vi:'Nhịp Samba là tài nguyên để tung trick chứ không dồn sát thương thô. Neymar phát huy mạnh nhất khi chơi sát đàn quái, nhử địch vào Showboat Window, câu lỗi để mở Điểm Đá Phạt và được thưởng lớn khi nối nhiều trick khác nhau thay vì spam một chiêu.'},shopSmallNote:{en:'Buy the survivor to unlock Neymar and Samba Streetball. The Brazil No.10 cosmetic remains in the bundle below.',vi:'Mua nhân vật sẽ mở Neymar và Samba Streetball. Trang phục Brazil Số 10 nằm trong gói THE LAST SAMBA bên dưới.'}}
});
function weaponName(id){return VSX?.lang==='vi' ? (window.VI_WEAPON?.[id]?.[0]||WEAPON_DEFINITIONS?.[id]?.name||id) : (WEAPON_DEFINITIONS?.[id]?.name||id)}
function durationText(id){return window.VSX_ULT_DURATION_API?.format ? VSX_ULT_DURATION_API.format(id,true) : '11s'}
function profile(id){return football[id]||null}
function ensureN10ShopCard(){
  const card=document.getElementById('vsxN10SurvivorCard');
  if(!card) return;
  const p=profile(N10_ID); card.dataset.characterId=N10_ID; card.classList.add('vsxFootballShopCard');
  const title=card.querySelector('h3'); if(title) title.textContent=`${CHARACTER_DEFINITIONS[N10_ID]?.name?.[VSX.lang]||'Neymar'} — N10`;
  const meta=card.querySelector('.vsxUnifiedSurvivorMeta');
  if(meta){ meta.innerHTML=`<span><b>${esc(L('Weapon','Vũ khí'))}:</b> ${esc(weaponName(N10_WEAPON))}</span>`; }
  card.querySelectorAll('.vsxFootballShopUltRow,.vsxFootballShopSkin,.vsxFootballShopSkill').forEach(n=>n.remove());
  const anchor=meta||card.querySelector('.vsxUnifiedSurvivorDesc');
  if(anchor){
    const ult=document.createElement('div'); ult.className='vsxFootballShopUltRow';
    ult.innerHTML=`<span>${esc(L('ULT DURATION','THỜI LƯỢNG ULT'))}</span><b>${esc(String(durationText(N10_ULT)).toUpperCase())}</b>`;
    const skin=document.createElement('div'); skin.className='vsxGoatSetupBadge vsxFootballShopSkin neymar';
    skin.innerHTML=`<span class="shirt" style="--j1:${p.jersey1};--j2:${p.jersey2};--accent:${p.accent}"><b>${p.number}</b></span><span><small>${esc(L('SIGNATURE SKIN','SKIN ĐẶC TRƯNG'))}</small><br>${esc(SKIN_DEFINITIONS[p.skin]?.name?.[VSX.lang]||'N10 — Brazil No. 10')}</span>`;
    const skill=document.createElement('div'); skill.className='vsxGoatPickSkillset vsxFootballShopSkill neymar';
    skill.innerHTML=`<b>${esc(p.skillTitle[VSX.lang])}</b> · ${esc(p.setupSummary[VSX.lang])}`;
    anchor.after(ult); ult.after(skin); skin.after(skill);
  }
  const note=card.querySelector('.n10SmallNote'); if(note) note.textContent=p.shopSmallNote[VSX.lang];
}
function ensureN10PickAndCollection(){
  const pick=document.querySelector(`#vsxCharacterGrid .vsxPick[data-character-id="${N10_ID}"], #vsxCharacterGrid .vsxPick[data-characterId="${N10_ID}"]`);
  if(pick){
    const p=profile(N10_ID);
    pick.querySelectorAll(':scope > .vsxN10SetupBadge').forEach(n=>n.remove());
    let skin=pick.querySelector(':scope > .vsxGoatSetupBadge');
    if(!skin){ skin=document.createElement('div'); pick.appendChild(skin); }
    skin.className='vsxGoatSetupBadge neymar';
    skin.dataset.footballLayout='skin';
    skin.innerHTML=`<span class="shirt" style="--j1:${p.jersey1};--j2:${p.jersey2};--accent:${p.accent}"><b>${p.number}</b></span><span><small>${esc(L('SIGNATURE SKIN','SKIN ĐẶC TRƯNG'))}</small><br>${esc(SKIN_DEFINITIONS[p.skin]?.name?.[VSX.lang]||'N10 — Brazil No. 10')}</span>`;
    let skill=pick.querySelector(':scope > .vsxGoatPickSkillset');
    if(!skill){ skill=document.createElement('div'); pick.appendChild(skill); }
    skill.className='vsxGoatPickSkillset neymar';
    skill.dataset.footballLayout='skill';
    skill.innerHTML=`<b>${esc(p.skillTitle[VSX.lang])}</b> · ${esc(p.setupSummary[VSX.lang])}`;
  }
  const card=document.querySelector(`#vsxCodexList .vsxCharacterCodexCard[data-codex-id="${N10_ID}"], #vsxCodexList .vsxCharacterCodexCard[data-codexId="${N10_ID}"]`);
  if(card){
    const p=profile(N10_ID), head=card.querySelector('.vsxCharacterCodexHead'), detail=card.querySelector('.vsxCharacterCodexDetail');
    card.querySelectorAll('.vsxN10CollectionBadge,.vsxN10Extra').forEach(n=>n.remove());
    if(head){
      let badge=head.querySelector('.vsxGoatCollectionBadge');
      if(!badge){ badge=document.createElement('span'); head.appendChild(badge); }
      badge.className='vsxGoatCollectionBadge neymar';
      badge.textContent=p.bundle;
    }
    if(detail){
      let info=detail.querySelector('.vsxGoatSkillsetInfo');
      if(!info){ info=document.createElement('div'); detail.appendChild(info); }
      info.className='vsxGoatSkillsetInfo neymar';
      info.innerHTML=`<b>${esc(p.collectionTitle[VSX.lang])}</b><br>${esc(p.collectionBody[VSX.lang])}`;
    }
  }
}
function syncSurvivorShopCounts(){
  const root=document.getElementById('vsxUnifiedSurvivorShop'); if(!root) return;
  for(const rarity of ['rare','epic','legendary']){
    const grid=root.querySelector(`.vsxRarityBlock.${rarity} .vsxUnifiedSurvivorGrid`), block=root.querySelector(`.vsxRarityBlock.${rarity}`);
    if(!grid||!block) continue;
    const count=grid.querySelectorAll('.vsxUnifiedSurvivorCard').length;
    const label=block.querySelector('.vsxRarityHeader > span'); if(label) label.textContent=`${count} ${L('SURVIVORS','NHÂN VẬT')}`;
    const chip=root.querySelector(`.vsxShopRaritySummary .${rarity}`); if(chip) chip.textContent=`${rarity.toUpperCase()} · ${count}`;
  }
  const total=root.querySelectorAll('.vsxUnifiedSurvivorCard').length, intro=root.querySelector('.vsxUnifiedShopIntro');
  if(intro) intro.textContent=VSX.lang==='vi' ? `${total} nhân vật cửa hàng dùng chung một layout và được sắp theo độ hiếm. Rare dễ tiếp cận, Epic có chiều sâu, còn Legendary sở hữu Tuyệt Kỹ đủ sức đổi nhịp giao tranh.` : `${total} shop survivors share one layout and remain sorted by rarity. Rare stays approachable, Epic adds depth, and Legendary Ultimates can reshape combat.`;
}
const ARMORY_BASE=window.renderArmory;
window.renderArmory=function(){ const r=ARMORY_BASE.apply(this,arguments); if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='survivors') queueMicrotask(()=>{ ensureN10ShopCard(); syncSurvivorShopCounts(); }); return r; };
const SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){ const r=SETUP_BASE.apply(this,arguments); queueMicrotask(ensureN10PickAndCollection); return r; };
const CODEX_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){ const r=CODEX_BASE.call(this,cat); if(cat==='characters') queueMicrotask(ensureN10PickAndCollection); return r; };
queueMicrotask(()=>{ try{ ensureN10ShopCard(); ensureN10PickAndCollection(); syncSurvivorShopCounts(); }catch(e){} });
window.VSX_FOOTBALL_LAYOUT_HELPERS=Object.assign(window.VSX_FOOTBALL_LAYOUT_HELPERS||{}, {registry:football, refreshN10:()=>{ensureN10ShopCard();ensureN10PickAndCollection();syncSurvivorShopCounts();}});
})();
