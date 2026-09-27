(()=>{
'use strict';
const STARTER_12=[
 'striker','tank','captain','technician','speedster','gambler',
 'arcanist','marksman','blood_reaver','warden','stormcaller','field_medic'
];
const STARTER_SET=new Set(STARTER_12);
const RARITY_ORDER=['common','uncommon','rare','epic','legendary'];
const RARITY_COLOR={common:'#c8d1dc',uncommon:'#53db83',rare:'#56a9ff',epic:'#ca72ff',legendary:'#ffcc58'};
const PRICE_BAND={
 common:{min:2500,max:4990},
 uncommon:{min:5200,max:9900},
 rare:{min:10500,max:19500},
 epic:{min:20500,max:33500},
 legendary:{min:34500,max:80000}
};
const L=(en,vi)=>VSX.lang==='vi'?vi:en;
const esc=v=>VSX.esc?VSX.esc(v):String(v??'');
const ORIGINAL_FREE_NONSTARTER=new Set(Object.entries(CHARACTER_DEFINITIONS).filter(([id,d])=>!STARTER_SET.has(id)&&!d.shopOnly).map(([id])=>id));
const ORIGINAL_PAID_NONSTARTER=new Set(Object.entries(CHARACTER_DEFINITIONS).filter(([id,d])=>!STARTER_SET.has(id)&&!!d.shopOnly).map(([id])=>id));

function rarityOf(id){const r=String(CHARACTER_DEFINITIONS[id]?.rarity||'common').toLowerCase();return RARITY_ORDER.includes(r)?r:'common'}
function buildCatalog(){
 const groups={common:[],uncommon:[],rare:[],epic:[],legendary:[]};
 Object.keys(CHARACTER_DEFINITIONS).forEach(id=>{if(!STARTER_SET.has(id))groups[rarityOf(id)].push(id)});
 // Stable future-proof ordering: explicit storeOrder first, then existing definition order.
 const definitionOrder=new Map(Object.keys(CHARACTER_DEFINITIONS).map((id,i)=>[id,i]));
 for(const rarity of RARITY_ORDER){
   groups[rarity].sort((a,b)=>{
     const ao=Number.isFinite(CHARACTER_DEFINITIONS[a]?.storeOrder)?CHARACTER_DEFINITIONS[a].storeOrder:10000;
     const bo=Number.isFinite(CHARACTER_DEFINITIONS[b]?.storeOrder)?CHARACTER_DEFINITIONS[b].storeOrder:10000;
     return ao-bo||(definitionOrder.get(a)||0)-(definitionOrder.get(b)||0);
   });
 }
 const meta={},ordered=[];
 let prev=0;
 for(const rarity of RARITY_ORDER){
   const band=PRICE_BAND[rarity],ids=groups[rarity],n=ids.length;
   ids.forEach((id,i)=>{
     let cost=n<=1?band.min:Math.round(band.min+(band.max-band.min)*(i/(n-1)));
     // Guarantee strict top-to-bottom growth even after future roster additions.
     cost=Math.max(cost,prev+1);cost=Math.min(cost,band.max);if(cost<=prev)cost=prev+1;
     meta[id]={id,rarity,currency:'score',cost,color:RARITY_COLOR[rarity],index:i};ordered.push(id);prev=cost;
   });
 }
 return {groups,meta,ordered};
}
const STORE=buildCatalog();

function ensureEconomySave(){
 VSX.save.meta ||= {};
 VSX.save.meta.unlockedCharacters ||= {};
 VSX.save.meta.unlockedWeapons ||= {};
 VSX.save.meta.survivorStoreOwned ||= {};
 // First migration: preserve content that was already explicitly shop-gated and owned.
 if((VSX.save.meta.survivorEconomyVersion||0)<2){
   for(const id of ORIGINAL_PAID_NONSTARTER){if(VSX.save.meta.unlockedCharacters[id])VSX.save.meta.survivorStoreOwned[id]=true}
   VSX.save.meta.survivorEconomyVersion=2;
 }
 // Starters are the only always-free survivors.
 for(const id of STARTER_12){VSX.save.meta.unlockedCharacters[id]=true;CHARACTER_DEFINITIONS[id].shopOnly=false}
 // Every non-starter is shop-gated. Legacy free survivors are actively re-locked unless purchased in the new store.
 for(const id of STORE.ordered){
   const d=CHARACTER_DEFINITIONS[id]; if(!d)continue; d.shopOnly=true;
   if(ORIGINAL_FREE_NONSTARTER.has(id))VSX.save.meta.unlockedCharacters[id]=!!VSX.save.meta.survivorStoreOwned[id];
 }
 if(!STARTER_SET.has(VSX.selectedCharacter)&&!isCharacterUnlocked(VSX.selectedCharacter))VSX.selectedCharacter='striker';
 vsxSave?.();
}
ensureEconomySave();

function ultInfo(id){try{const x=window.VSX_EXPANSION16?.ultInfo?.[id];if(x)return x;const a=window.VSX_ARCADE_EXPANSION?.ultInfo?.(id);if(a)return a;return{name:{en:String(id||'ULTIMATE').replaceAll('_',' ').toUpperCase(),vi:String(id||'ULTIMATE').replaceAll('_',' ').toUpperCase()}}}catch(e){return{name:{en:String(id||'ULTIMATE').replaceAll('_',' ').toUpperCase(),vi:String(id||'ULTIMATE').replaceAll('_',' ').toUpperCase()}}}}
function footballSkin(id){
 const map={
  cr7_goat:{num:'7',skin:'cr7_portugal_7',bg:'linear-gradient(90deg,#0e8b50 0 36%,#b51f31 36% 100%)',fg:'#f5d77a'},
  m10_goat:{num:'10',skin:'m10_argentina_10',bg:'repeating-linear-gradient(180deg,#eef9ff 0 20%,#65c9ff 20% 40%,#eef9ff 40% 60%,#65c9ff 60% 80%,#eef9ff 80% 100%)',fg:'#277da4'},
  n10_neymar:{num:'10',skin:'n10_brazil_10',bg:'linear-gradient(160deg,#ffd91f 0 58%,#11a24e 58% 100%)',fg:'#0f7c49'},
  rm_mbappe_k10:{num:'10',skin:'rm_mbappe_france_10',bg:'linear-gradient(90deg,#17398d 0 34%,#f6f4ef 34% 66%,#d0143c 66%)',fg:'#111'},
  rm_vini_v7:{num:'7',skin:'rm_vini_brazil_7',bg:'linear-gradient(180deg,#f6f4ef 0 72%,#0d8f46 72% 88%,#ffd91f 88%)',fg:'#111'},
  rm_jude_j5:{num:'5',skin:'rm_jude_england_5',bg:'linear-gradient(90deg,#f6f4ef 0 42%,#c8102e 42% 58%,#f6f4ef 58%)',fg:'#1a245a'}
 };
 return map[id]||null;
}
function signatureMarkup(id){const f=footballSkin(id);if(!f)return'';const n=SKIN_DEFINITIONS[f.skin]?.name?.[VSX.lang]||L('Signature Skin','Skin Đặc Trưng');return `<div class="vsxCatalogSignature"><span class="skinDot" style="background:${f.bg};color:${f.fg}">${f.num}</span><span><b>${esc(L('SIGNATURE SKIN','SKIN ĐẶC TRƯNG'))}</b><br>${esc(n)}</span></div>`}
function characterCard(id,globalIndex){
 const d=CHARACTER_DEFINITIONS[id],m=STORE.meta[id],owned=isCharacterUnlocked(id),u=ultInfo(d.ultimate);
 const card=document.createElement('article');
 card.className=`vsxShopCard vsxSurvivorShopCard vsxUnifiedSurvivorCard ${m.rarity}${owned?' owned':''}`;
 card.dataset.storeCharacter=id;card.dataset.storeCost=String(m.cost);card.dataset.rarity=m.rarity;
 if(id.startsWith('rm_'))card.dataset.rmCard=id;
 card.style.setProperty('--surv-color',m.color);
 card.innerHTML=`<div class="vsxUnifiedSurvivorHead"><span class="vsxRarityBadge ${m.rarity}">${m.rarity.toUpperCase()}</span><span class="vsxShopOwnedChip ${owned?'owned':''}">${owned?L('OWNED','SỞ HỮU'):L('LOCKED','CHƯA SỞ HỮU')}</span><span class="vsxCatalogOrder">#${String(globalIndex+1).padStart(2,'0')}</span></div><h3>${esc(d.name?.[VSX.lang]||id)}</h3><p class="vsxUnifiedSurvivorDesc">${esc(d.desc?.[VSX.lang]||'')}</p>${signatureMarkup(id)}<div class="vsxSurvivorMeta vsxUnifiedSurvivorMeta"><span><b>${L('Weapon','Vũ khí')}:</b> ${esc(weaponName(d.weapon))}</span><span><b>${L('Ultimate','Tuyệt Kỹ')}:</b> ${esc(u.name?.[VSX.lang]||d.ultimate||'—')}</span></div><div class="vsxUnifiedSurvivorFooter"><p class="vsxPrice"><small>${L('SURVIVOR PRICE','GIÁ NHÂN VẬT')}</small><strong>${m.cost.toLocaleString('en-US')} ${L('SCORE','ĐIỂM')}</strong></p><button ${owned||!walletCan('score',m.cost)?'disabled':''}>${owned?L('OWNED','ĐÃ SỞ HỮU'):L('BUY','MUA')}</button></div>`;
 const btn=card.querySelector('button');if(btn&&!owned)btn.onclick=()=>buySurvivor(id);
 return card;
}
function buySurvivor(id){
 const m=STORE.meta[id],d=CHARACTER_DEFINITIONS[id];if(!m||!d)return false;if(isCharacterUnlocked(id))return true;
 if(!walletSpend('score',m.cost))return false;
 VSX.save.meta.survivorStoreOwned[id]=true;
 VSX.save.meta.unlockedCharacters[id]=true;
 VSX.save.meta.unlockedWeapons[d.weapon]=true;
 if(typeof vsxDiscover==='function'){vsxDiscover('characters',id);vsxDiscover('weapons',d.weapon)}
 vsxSave?.();
 VSX.announce?.(L('SURVIVOR UNLOCKED','ĐÃ MỞ KHÓA NHÂN VẬT'),d.name?.[VSX.lang]||id,m.color);
 renderArmory();return true;
}
function normalizeStoreCopy(){
 const root=document.getElementById('vsxUnifiedSurvivorShop');if(!root||!root.classList.contains('vsxFullSurvivorCatalog'))return;
 const total=STORE.ordered.length;
 const title=root.querySelector('.vsxSectionTitle');if(title)title.textContent=L('SURVIVOR MARKET','CHỢ NHÂN VẬT');

 for(const rarity of RARITY_ORDER){
   const block=root.querySelector(`.vsxRarityBlock.${rarity}`),ids=STORE.groups[rarity];if(!block||!ids.length)continue;
   const lo=STORE.meta[ids[0]].cost,hi=STORE.meta[ids[ids.length-1]].cost,head=block.querySelector('.vsxRarityHeader');
   if(head)head.innerHTML=`<div><span class="vsxRarityBadge ${rarity}">${rarity.toUpperCase()}</span><b>${L(`${rarity.toUpperCase()} SURVIVORS`,`${rarity.toUpperCase()} · NHÂN VẬT`)}</b></div><span class="vsxCatalogRange">${ids.length} · ${lo.toLocaleString('en-US')} → ${hi.toLocaleString('en-US')} ${L('SCORE','ĐIỂM')}</span>`;
 }
}
function renderFullSurvivorStore(){
 if(typeof ARMORY_TAB==='undefined'||ARMORY_TAB!=='survivors')return;
 const c=document.getElementById('vsxArmoryContent');if(!c)return;
 const total=STORE.ordered.length;
 const summaries=RARITY_ORDER.map(r=>`<span class="${r}">${r.toUpperCase()} · ${STORE.groups[r].length}</span>`).join('');
 c.innerHTML=`<section id="vsxUnifiedSurvivorShop" class="vsxFullSurvivorCatalog"><div class="vsxSectionTitle">${L('SURVIVOR MARKET','CHỢ NHÂN VẬT')}</div><div class="vsxShopRaritySummary">${summaries}</div><div id="vsxUnifiedSurvivorGroups"></div></section>`;
 const root=c.querySelector('#vsxUnifiedSurvivorGroups');let globalIndex=0;
 for(const rarity of RARITY_ORDER){
   const ids=STORE.groups[rarity];if(!ids.length)continue;
   const block=document.createElement('section');block.className=`vsxRarityBlock ${rarity}`;
   block.innerHTML=`<div class="vsxRarityHeader"></div><div class="vsxShopGrid vsxUnifiedSurvivorGrid"></div>`;
   const grid=block.querySelector('.vsxUnifiedSurvivorGrid');for(const id of ids)grid.appendChild(characterCard(id,globalIndex++));root.appendChild(block);
 }
 normalizeStoreCopy();queueMicrotask(normalizeStoreCopy);setTimeout(normalizeStoreCopy,0);
}

function ensureStarterNotice(){
 const grid=document.getElementById('vsxCharacterGrid');if(!grid)return;
 let n=document.getElementById('vsxStarterEconomyNotice');if(!n){n=document.createElement('div');n.id='vsxStarterEconomyNotice';grid.insertAdjacentElement('beforebegin',n)}
 const unlockedShop=STORE.ordered.filter(isCharacterUnlocked).length;
 n.innerHTML=`<b>${L('STARTER 12 · COMMON','STARTER 12 · COMMON')}</b> · ${L('The first 12 survivors are always available. Purchased survivors appear below automatically.','12 nhân vật đầu luôn được chọn miễn phí. Nhân vật đã mua sẽ tự xuất hiện bên dưới.')} <span>${L('Shop unlocked','Đã mua')}: ${unlockedShop}/${STORE.ordered.length}</span>`;
}
function groupSurvivorPick(){
 const grid=document.getElementById('vsxCharacterGrid');if(!grid)return;
 grid.querySelectorAll(':scope > .vsxPickRarityHeader').forEach(x=>x.remove());
 const cards=[...grid.querySelectorAll(':scope > .vsxPick')];
 cards.forEach(c=>{const id=c.dataset.characterId;if(id&&CHARACTER_DEFINITIONS[id])c.dataset.rarity=rarityOf(id)});
 const groups=[
  {key:'starter',rarity:'common',label:'COMMON · STARTER 12',cards:cards.filter(c=>STARTER_SET.has(c.dataset.characterId))},
  {key:'common_shop',rarity:'common',label:L('COMMON · SHOP UNLOCKS','COMMON · ĐÃ MUA TRONG SHOP'),cards:cards.filter(c=>!STARTER_SET.has(c.dataset.characterId)&&c.dataset.rarity==='common')},
  ...['uncommon','rare','epic','legendary'].map(r=>({key:r,rarity:r,label:r.toUpperCase(),cards:cards.filter(c=>c.dataset.rarity===r)}))
 ];
 let cursor=null;
 for(const g of groups){
   if(!g.cards.length)continue;
   const h=document.createElement('div');h.className='vsxPickRarityHeader';h.dataset.pickHeader=g.key;h.dataset.pickRarity=g.rarity;h.style.setProperty('--pick-rarity-color',RARITY_COLOR[g.rarity]);
   h.innerHTML=`<b>${g.label}</b><em>${g.cards.length} ${L('AVAILABLE','ĐANG CÓ')}</em>`;
   if(!cursor){grid.insertBefore(h,grid.firstChild);cursor=h}else{cursor.after(h);cursor=h}
   for(const card of g.cards){cursor.after(card);cursor=card}
 }
 updatePickHeaders();ensureStarterNotice();
}
function updatePickHeaders(){
 const grid=document.getElementById('vsxCharacterGrid');if(!grid)return;
 for(const h of grid.querySelectorAll(':scope > .vsxPickRarityHeader')){
   const key=h.dataset.pickHeader;
   let cards=[];
   if(key==='starter')cards=[...grid.querySelectorAll(':scope > .vsxPick')].filter(c=>STARTER_SET.has(c.dataset.characterId));
   else if(key==='common_shop')cards=[...grid.querySelectorAll(':scope > .vsxPick[data-rarity="common"]')].filter(c=>!STARTER_SET.has(c.dataset.characterId));
   else cards=[...grid.querySelectorAll(`:scope > .vsxPick[data-rarity="${h.dataset.pickRarity}"]`)];
   const visible=cards.filter(c=>!c.classList.contains('vsxPickFilteredOut'));
   h.classList.toggle('vsxHeaderHidden',visible.length===0);
   const em=h.querySelector('em');if(em)em.textContent=`${visible.length} ${L('AVAILABLE','ĐANG CÓ')}`;
 }
}

const ECONOMY_RENDER_ARMORY_BASE=renderArmory;
renderArmory=function(){const r=ECONOMY_RENDER_ARMORY_BASE.apply(this,arguments);if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='survivors')renderFullSurvivorStore();return r};
const ECONOMY_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){
 ensureEconomySave();
 if(!STARTER_SET.has(VSX.selectedCharacter)&&!isCharacterUnlocked(VSX.selectedCharacter))VSX.selectedCharacter='striker';
 const r=ECONOMY_SETUP_BASE.apply(this,arguments);queueMicrotask(()=>{groupSurvivorPick();window.VSX_CHARACTER_PICK_FILTER?.apply?.();updatePickHeaders()});return r;
};
const ECONOMY_BEGIN_BASE=VSX.beginRun;
VSX.beginRun=function(){if(!isCharacterUnlocked(VSX.selectedCharacter))VSX.selectedCharacter='striker';return ECONOMY_BEGIN_BASE.apply(this,arguments)};
if(window.VSX_CHARACTER_PICK_FILTER?.apply){const PICK_APPLY_BASE=window.VSX_CHARACTER_PICK_FILTER.apply.bind(window.VSX_CHARACTER_PICK_FILTER);window.VSX_CHARACTER_PICK_FILTER.apply=function(){const r=PICK_APPLY_BASE();queueMicrotask(updatePickHeaders);return r}}

function injectEconomyAdmin(){
 const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||!window.VSX_ADMIN?.open||!['run','meta','loadout','collection','player'].includes(VSX_ADMIN.tab)||document.getElementById('vsxAdminSurvivorEconomy'))return;
 const card=document.createElement('div');card.id='vsxAdminSurvivorEconomy';card.className='vsxAdminCard';
 card.innerHTML=`<h3>${L('SURVIVOR ECONOMY · QA','KINH TẾ NHÂN VẬT · QA')}</h3><p>${L(`Starter 12 are permanently free. All ${STORE.ordered.length} other survivors are rarity-priced Shop unlocks.`,`Starter 12 luôn miễn phí. ${STORE.ordered.length} nhân vật còn lại được mở qua Shop với giá theo độ hiếm.`)}</p><select id="admEconomySurvivor">${STORE.ordered.map(id=>`<option value="${id}">${esc(CHARACTER_DEFINITIONS[id].name?.[VSX.lang]||id)} · ${rarityOf(id).toUpperCase()} · ${STORE.meta[id].cost.toLocaleString('en-US')}</option>`).join('')}</select><div class="row"><button id="admEconomyUnlock">${L('UNLOCK SELECTED','MỞ NHÂN VẬT ĐÃ CHỌN')}</button><button id="admEconomyReset">${L('RESET TO STARTER 12','RESET VỀ STARTER 12')}</button></div>`;
 grid.appendChild(card);const sel=card.querySelector('#admEconomySurvivor');
 card.querySelector('#admEconomyUnlock').onclick=()=>{const id=sel.value,d=CHARACTER_DEFINITIONS[id];VSX.save.meta.survivorStoreOwned[id]=true;VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[d.weapon]=true;vsxSave?.();VSX.announce?.('ADMIN',d.name?.[VSX.lang]||id,RARITY_COLOR[rarityOf(id)])};
 card.querySelector('#admEconomyReset').onclick=()=>{for(const id of STORE.ordered){VSX.save.meta.survivorStoreOwned[id]=false;VSX.save.meta.unlockedCharacters[id]=false}for(const id of STARTER_12)VSX.save.meta.unlockedCharacters[id]=true;VSX.selectedCharacter='striker';vsxSave?.();VSX.announce?.('ADMIN',L('STARTER 12 ONLY','CHỈ CÒN STARTER 12'),'#73f5bd')};
}
if(window.VSX_ADMIN){const OPEN_BASE=VSX_ADMIN.openPanel;if(typeof OPEN_BASE==='function')VSX_ADMIN.openPanel=function(){const r=OPEN_BASE.apply(this,arguments);queueMicrotask(injectEconomyAdmin);return r};const ac=document.getElementById('vsxAdminContent');if(ac)new MutationObserver(()=>{if(VSX_ADMIN.open)queueMicrotask(injectEconomyAdmin)}).observe(ac,{childList:true,subtree:false})}

queueMicrotask(()=>{ensureEconomySave();if(document.getElementById('vsxCharacterGrid')){groupSurvivorPick();window.VSX_CHARACTER_PICK_FILTER?.apply?.()}if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='survivors')renderFullSurvivorStore()});
window.VSX_SURVIVOR_ECONOMY={
 starter:[...STARTER_12],catalog:STORE,
 buy:buySurvivor,renderShop:renderFullSurvivorStore,
 selfTest(){
  const errors=[];
  const free=Object.keys(CHARACTER_DEFINITIONS).filter(id=>!CHARACTER_DEFINITIONS[id].shopOnly);
  if(free.length!==12||free.some(id=>!STARTER_SET.has(id)))errors.push(`free survivor policy mismatch: ${free.join(',')}`);
  if(STORE.ordered.length!==Object.keys(CHARACTER_DEFINITIONS).length-12)errors.push('catalog count mismatch');
  const prices=STORE.ordered.map(id=>STORE.meta[id].cost);for(let i=1;i<prices.length;i++)if(prices[i]<=prices[i-1])errors.push(`price order fails at ${i}`);
  const cards=[...document.querySelectorAll('#vsxUnifiedSurvivorShop [data-store-character]')];for(const c of cards)if(c.clientWidth&&c.scrollWidth>c.clientWidth+2)errors.push(`shop overflow ${c.dataset.storeCharacter}`);
  return{ok:!errors.length,errors,starterCount:STARTER_12.length,shopCount:STORE.ordered.length,priceMin:prices[0],priceMax:prices.at(-1),pickCards:document.querySelectorAll('#vsxCharacterGrid .vsxPick').length,shopCards:cards.length};
 }
};
})();
