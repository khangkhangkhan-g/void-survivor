(function(){
"use strict";

/* Future-proof: wrap the existing Armory title/wallet + tab selector once. */
function ensureArmoryHeader(){
  const screen=document.getElementById("vsxArmoryScreen"),panel=screen?.querySelector(":scope > .panel");
  const meta=document.querySelector("#vsxArmoryScreen .vsxMetaHeader"),tabs=document.getElementById("vsxArmoryTabs");
  if(!panel||!meta||!tabs)return;
  let head=document.getElementById("vsxArmoryStickyHeader");
  if(!head){head=document.createElement("div");head.id="vsxArmoryStickyHeader";head.className="vsxArmoryStickyHeader";meta.before(head);head.append(meta,tabs)}
  const back=document.getElementById("vsxArmoryBack"),row=back?.closest(".row");if(row)row.classList.add("vsxArmoryStickyBack");
}
const POLISH_ARMORY_BASE=renderArmory;
renderArmory=function(){ensureArmoryHeader();const r=POLISH_ARMORY_BASE.apply(this,arguments);ensureArmoryHeader();return r};
ensureArmoryHeader();

/* Compact Collection into three logical navigation groups. */
const NAV_GROUPS=[
  {id:"arsenal",en:"ARSENAL & BUILD",vi:"KHO ĐỒ & BUILD",cats:["weapons","passives","evolutions","mutations","synergies","legendary_relics"]},
  {id:"world",en:"WORLD & COMBAT",vi:"THẾ GIỚI & CHIẾN ĐẤU",cats:["enemies","bosses","allies","trials"]},
  {id:"profile",en:"SURVIVORS & PROGRESS",vi:"NHÂN VẬT & TIẾN ĐỘ",cats:["characters","skins","packages","achievements"]}
];
const POLISH_LABELS={
  weapons:{en:"WEAPONS",vi:"VŨ KHÍ"},passives:{en:"PASSIVES",vi:"NỘI TẠI"},evolutions:{en:"EVOLUTIONS",vi:"TIẾN HÓA"},mutations:{en:"MUTATIONS",vi:"ĐỘT BIẾN"},synergies:{en:"SYNERGIES",vi:"CỘNG HƯỞNG"},legendary_relics:{en:"RELICS",vi:"DI VẬT"},
  enemies:{en:"ENEMIES",vi:"KẺ ĐỊCH"},bosses:{en:"BOSSES",vi:"BOSS"},allies:{en:"ALLIES",vi:"ĐỒNG MINH"},world_objects:{en:"WORLD OBJECTS",vi:"VẬT THỂ THẾ GIỚI"},trials:{en:"TRIALS",vi:"THỬ THÁCH"},
  characters:{en:"CHARACTERS",vi:"NHÂN VẬT"},skins:{en:"SKIN",vi:"TRANG PHỤC"},packages:{en:"PACKAGES",vi:"GÓI NHÂN VẬT"},achievements:{en:"ACHIEVEMENTS",vi:"THÀNH TỰU"}
};
function rebuildCollectionCluster(){
  const tabs=document.getElementById("vsxCodexTabs");if(!tabs)return;
  const current=window.VSX_COLLECTION_UI?.cat||"weapons";
  const existing=new Map([...tabs.querySelectorAll("button[data-codex-cat]")].map(b=>[b.dataset.codexCat,b]));
  tabs.classList.add("vsxCollectionNavCluster");tabs.innerHTML="";
  for(const group of NAV_GROUPS){
    const wrap=document.createElement("section");wrap.className="vsxCollectionNavGroup";wrap.dataset.group=group.id;
    const title=document.createElement("div");title.className="vsxCollectionNavGroupTitle";title.textContent=VSX.lang==="vi"?group.vi:group.en;
    const buttons=document.createElement("div");buttons.className="vsxCollectionNavGroupButtons";
    for(const cat of group.cats){
      let b=existing.get(cat);
      if(!b){
        const rows=VSX.codexEntries(cat)||[];if(!rows.length)continue;
        b=document.createElement("button");b.dataset.codexCat=cat;
        b.onclick=()=>{const UI=window.VSX_COLLECTION_UI;if(UI){UI.cat=cat;UI.query="";UI.rarity="all"}const q=document.getElementById("vsxCollectionSearch");if(q)q.value="";VSX.renderCodex(cat)};
      }
      const rows=VSX.codexEntries(cat)||[];
      let got=0;
      if(cat==="characters")got=rows.filter(r=>isCharacterUnlocked(r[0])).length;
      else if(cat==="skins")got=rows.filter(r=>!!VSX.save.meta?.skins?.[r[0]]).length;
      else if(cat==="packages")got=rows.filter(r=>!!VSX.save.meta?.packages?.[r[0]]).length;
      else got=Object.keys(VSX.save.codex?.[cat]||{}).length;
      const label=POLISH_LABELS[cat]?.[VSX.lang]||cat.toUpperCase();
      b.textContent=`${label} ${got}/${rows.length}`;b.classList.toggle("selected",cat===current);buttons.appendChild(b);
    }
    wrap.append(title,buttons);tabs.appendChild(wrap);
  }
}

const POLISH_SHOW_COLLECTION_BASE=VSX.showCollection;
VSX.showCollection=function(){const r=POLISH_SHOW_COLLECTION_BASE.apply(this,arguments);rebuildCollectionCluster();return r};
const POLISH_RENDER_CODEX_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){const r=POLISH_RENDER_CODEX_BASE.call(this,cat);queueMicrotask(rebuildCollectionCluster);return r};

/* If Collection is already open during language refresh, rebuild labels without changing content. */
window.VSX_SHOP_COLLECTION_POLISH={
  rebuildCollectionCluster,ensureArmoryHeader,
  selfTest(){
    const bat=SKIN_DEFINITIONS.dc_gotham_knight||{};
    return{batmanColor:bat.color,batmanSecondary:bat.secondary,shopHeader:!!document.getElementById("vsxArmoryStickyHeader"),shopFooter:!!document.querySelector("#vsxArmoryScreen .vsxArmoryStickyBack"),collectionGroups:document.querySelectorAll("#vsxCodexTabs .vsxCollectionNavGroup").length};
  }
};
})();
