(function(){
"use strict";

/* Flash: fastest natural movement + fastest native Dash recovery among survivors. */
if(CHARACTER_DEFINITIONS.the_flash){
  CHARACTER_DEFINITIONS.the_flash.mods ||= {};
  CHARACTER_DEFINITIONS.the_flash.mods.move=4.0;
  CHARACTER_DEFINITIONS.the_flash.mods.dashCooldown=.52;
  CHARACTER_DEFINITIONS.the_flash.desc={
    en:"LEGENDARY — The fastest natural survivor at 4.0× base movement speed. Movement itself becomes Speed Force damage, and his Dash recovers far faster than standard survivors.",
    vi:"LEGENDARY — Survivor có tốc độ thuần bằng 4.0× tốc độ cơ bản. Chuyển động biến thành sát thương Speed Force và Dash hồi nhanh hơn rõ rệt so với survivor thường."
  };
}

/* Naming rule: SKIN / TRANG PHỤC everywhere user-facing. */
I18N.en.customization="SKIN";I18N.en.skins="SKIN";
I18N.vi.customization="TRANG PHỤC";I18N.vi.skins="TRANG PHỤC";

function localizeSkinTerms(root){
  if(!root||VSX.lang!=="vi")return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){
    if(!n.nodeValue||!/(skin|skins|ngoại trang)/i.test(n.nodeValue))continue;
    n.nodeValue=n.nodeValue.replace(/exclusive skin/gi,"trang phục độc quyền").replace(/orb skin/gi,"trang phục orb").replace(/skins?/gi,"trang phục").replace(/ngoại trang/gi,"trang phục");
  }
}

/* Sticky BACK footer in every Armory tab, including future ones. */
function syncArmoryStickyBack(){const b=document.getElementById("vsxArmoryBack"),r=b?.closest(".row");if(r)r.classList.add("vsxArmoryStickyBack");localizeSkinTerms(document.getElementById("vsxArmoryScreen"))}
const UX_ARMORY_BASE=renderArmory;
renderArmory=function(){const r=UX_ARMORY_BASE.apply(this,arguments);syncArmoryStickyBack();return r};

const RANK={common:0,uncommon:1,rare:2,epic:3,legendary:4};
const UI=window.VSX_COLLECTION_UI||{cat:"weapons",query:"",rarity:"all"};window.VSX_COLLECTION_UI=UI;
const CAT_LABELS={
 weapons:{en:"WEAPONS",vi:"VŨ KHÍ"},passives:{en:"PASSIVES",vi:"NỘI TẠI"},allies:{en:"ALLIES",vi:"ĐỒNG MINH"},evolutions:{en:"EVOLUTIONS",vi:"TIẾN HÓA"},mutations:{en:"MUTATIONS",vi:"ĐỘT BIẾN"},synergies:{en:"SYNERGIES",vi:"CỘNG HƯỞNG"},enemies:{en:"ENEMIES",vi:"KẺ ĐỊCH"},bosses:{en:"BOSSES",vi:"BOSS"},characters:{en:"CHARACTERS",vi:"NHÂN VẬT"},skins:{en:"SKIN",vi:"TRANG PHỤC"},packages:{en:"PACKAGES",vi:"GÓI NHÂN VẬT"},achievements:{en:"ACHIEVEMENTS",vi:"THÀNH TỰU"},legendary_relics:{en:"RELICS",vi:"DI VẬT"},trials:{en:"TRIALS",vi:"THỬ THÁCH"}
};
const CATS=["weapons","passives","allies","evolutions","mutations","synergies","enemies","bosses","characters","skins","packages","achievements","legendary_relics","trials"];
function rarityFor(cat,id){
  if(cat==="characters")return (CHARACTER_DEFINITIONS[id]?.rarity||"common").toLowerCase();
  if(cat==="weapons"||cat==="legendary_relics")return (WEAPON_DEFINITIONS[id]?.rarity||"common").toLowerCase();
  if(cat==="skins")return (SKIN_DEFINITIONS[id]?.tier||"common").toLowerCase();
  if(cat==="passives")return (PASSIVE_DEFINITIONS[id]?.rarity||"common").toLowerCase();
  return "common";
}
function supportsRarity(cat){return ["characters","weapons","skins","passives","legendary_relics"].includes(cat)}
function discoveredCount(cat){
  const rows=VSX.codexEntries(cat)||[];
  if(cat==="characters")return rows.filter(r=>isCharacterUnlocked(r[0])).length;
  if(cat==="skins")return rows.filter(r=>!!VSX.save.meta?.skins?.[r[0]]).length;
  if(cat==="packages")return rows.filter(r=>!!VSX.save.meta?.packages?.[r[0]]).length;
  return Object.keys(VSX.save.codex?.[cat]||{}).length;
}
function ensureCollectionTools(){
  const tabs=document.getElementById("vsxCodexTabs"),list=document.getElementById("vsxCodexList");if(!tabs||!list)return null;
  let box=document.getElementById("vsxCollectionTools");
  if(!box){box=document.createElement("div");box.id="vsxCollectionTools";box.innerHTML=`<input id="vsxCollectionSearch" type="search"><select id="vsxCollectionRarity"></select><span id="vsxCollectionResultCount"></span>`;tabs.insertAdjacentElement("afterend",box)}
  const search=box.querySelector("#vsxCollectionSearch"),sel=box.querySelector("#vsxCollectionRarity");
  search.placeholder=VSX.lang==="vi"?"Tìm theo tên hoặc nội dung...":"Search name or information...";search.value=UI.query;
  sel.innerHTML=`<option value="all">${VSX.lang==="vi"?"TẤT CẢ ĐỘ HIẾM":"ALL RARITIES"}</option>${["common","uncommon","rare","epic","legendary"].map(r=>`<option value="${r}">${r.toUpperCase()}</option>`).join("")}`;sel.value=UI.rarity;sel.style.display=supportsRarity(UI.cat)?"":"none";
  search.oninput=()=>{UI.query=search.value;applyCollectionFilter()};sel.onchange=()=>{UI.rarity=sel.value;applyCollectionFilter()};return box
}
function chip(label,cls=""){const s=document.createElement("span");s.className=`vsxCollectionChip ${cls}`;s.textContent=label;return s}
function decorateCards(cat){
  const list=document.getElementById("vsxCodexList"),rows=VSX.codexEntries(cat)||[],cards=[...list.children].filter(x=>x.classList.contains("vsxCodexItem"));
  cards.forEach((card,i)=>{const row=rows[i];if(!row)return;const id=row[0],rarity=rarityFor(cat,id);card.dataset.codexId=id;card.dataset.codexName=String(row[1]||"").toLowerCase();card.dataset.rarity=rarity;card.dataset.originalIndex=String(i);
    if(cat==="weapons"||cat==="passives"||cat==="legendary_relics"){
      let head=card.querySelector(":scope > .vsxCodexCardHead");const title=card.querySelector(":scope > b");
      if(!head&&title){head=document.createElement("div");head.className="vsxCodexCardHead";title.before(head);head.appendChild(title)}
      if(head&&!head.querySelector(".vsxRarityBadge")){const c=chip(rarity.toUpperCase(),`vsxRarityBadge ${rarity}`);head.appendChild(c)}
    }
    if(cat==="skins"&&!card.querySelector(".vsxRarityBadge")){const title=card.querySelector(":scope > b");if(title){let head=document.createElement("div");head.className="vsxCodexCardHead";title.before(head);head.appendChild(title);head.appendChild(chip(rarity.toUpperCase(),`vsxRarityBadge ${rarity}`))}}
  });
  if(cat==="characters"||cat==="weapons"||cat==="skins"||cat==="passives"||cat==="legendary_relics"){
    cards.sort((a,b)=>(RANK[a.dataset.rarity]??0)-(RANK[b.dataset.rarity]??0)||Number(a.dataset.originalIndex)-Number(b.dataset.originalIndex)).forEach(c=>list.appendChild(c));
  }
}
function applyCollectionFilter(){
  const list=document.getElementById("vsxCodexList");if(!list)return;const q=(UI.query||"").trim().toLocaleLowerCase(VSX.lang==="vi"?"vi":"en"),rar=UI.rarity||"all";let shown=0,total=0;
  list.querySelectorAll(":scope > .vsxCodexItem").forEach(card=>{total++;const hay=((card.dataset.codexName||"")+" "+card.textContent).toLocaleLowerCase(VSX.lang==="vi"?"vi":"en"),okQ=!q||hay.includes(q),okR=!supportsRarity(UI.cat)||rar==="all"||card.dataset.rarity===rar,show=okQ&&okR;card.style.display=show?"":"none";if(show)shown++});
  let empty=document.getElementById("vsxCollectionEmpty");if(!shown){if(!empty){empty=document.createElement("div");empty.id="vsxCollectionEmpty";list.appendChild(empty)}empty.textContent=VSX.lang==="vi"?"Không tìm thấy mục phù hợp.":"No matching entries."}else empty?.remove();
  const out=document.getElementById("vsxCollectionResultCount");if(out)out.textContent=`${VSX.lang==="vi"?"HIỂN THỊ":"SHOWING"} ${shown}/${total}`;
}
function setActiveTab(cat){document.querySelectorAll("#vsxCodexTabs button").forEach(b=>b.classList.toggle("selected",b.dataset.codexCat===cat))}

const UX_CODEX_RENDER_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){UI.cat=cat;const r=UX_CODEX_RENDER_BASE.call(VSX,cat);ensureCollectionTools();const sel=document.getElementById("vsxCollectionRarity");if(sel)sel.style.display=supportsRarity(cat)?"":"none";decorateCards(cat);setActiveTab(cat);localizeSkinTerms(document.getElementById("vsxCollectionScreen"));applyCollectionFilter();return r};

const UX_COLLECTION_SHOW_BASE=VSX.showCollection;
VSX.showCollection=function(){
  UX_COLLECTION_SHOW_BASE.apply(this,arguments);
  const tabs=document.getElementById("vsxCodexTabs");if(!tabs)return;tabs.innerHTML="";
  for(const cat of CATS){const rows=VSX.codexEntries(cat)||[];if(!rows.length)continue;const b=document.createElement("button");b.dataset.codexCat=cat;b.textContent=`${CAT_LABELS[cat]?.[VSX.lang]||cat.toUpperCase()} ${discoveredCount(cat)}/${rows.length}`;b.onclick=()=>{UI.cat=cat;UI.query="";UI.rarity="all";const search=document.getElementById("vsxCollectionSearch");if(search)search.value="";VSX.renderCodex(cat)};tabs.appendChild(b)}
  ensureCollectionTools();UI.cat="weapons";UI.query="";UI.rarity="all";VSX.renderCodex("weapons");
};

/* Keep tab/section labels synced after language changes and future renders. */
const UX_LANG_BASE=vsxApplyLanguage;
vsxApplyLanguage=function(){const r=UX_LANG_BASE.apply(this,arguments);if(document.getElementById("vsxCollectionScreen")?.classList.contains("active"))VSX.showCollection();if(document.getElementById("vsxArmoryScreen")?.classList.contains("active")){renderArmory();syncArmoryStickyBack()}return r};

/* Publish-facing diagnostics for future patches/QA. */
window.VSX_COLLECTION_UX_API={
 rarityRank:{...RANK},
 getState:()=>({...UI}),
 flashTuning:()=>({...CHARACTER_DEFINITIONS.the_flash.mods}),
 rerender:()=>VSX.renderCodex(UI.cat),
 selfTest(){const f=CHARACTER_DEFINITIONS.the_flash?.mods||{},base=window.VSX_UNIFIED_ENEMY_ADMIN?.baseInfo||{};return{flashMove:f.move,flashDashCooldown:f.dashCooldown,enemyBaseInfo:Object.keys(base).length,search:!!document.getElementById("vsxCollectionSearch"),stickyBack:!!document.querySelector("#vsxArmoryScreen .vsxArmoryStickyBack")}}
};

syncArmoryStickyBack();
})();
