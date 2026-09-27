(function(){
"use strict";
/* Football Legends: natural movement speed is 1.5x base for R9, P10 and R10. */
for(const id of ["ronaldo_r9","pele_p10","ronaldinho_r10"]){const d=CHARACTER_DEFINITIONS[id];if(d){d.mods ||= {};d.mods.move=1.5}}

const PICK_STATE=window.VSX_CHARACTER_PICK_STATE ||= {query:"",rarity:"all"};
const RARITIES=["common","uncommon","rare","epic","legendary"];
function pickL(en,vi){return VSX.lang==="vi"?vi:en}
function ensurePickTools(){
 const grid=document.getElementById("vsxCharacterGrid");if(!grid)return null;
 let tools=document.getElementById("vsxCharacterPickTools");
 if(!tools){
   tools=document.createElement("div");tools.id="vsxCharacterPickTools";
   tools.innerHTML=`<input id="vsxCharacterPickSearch" type="search" autocomplete="off"><select id="vsxCharacterPickRarity"></select><span id="vsxCharacterPickCount"></span>`;
   grid.insertAdjacentElement("beforebegin",tools);
   const input=tools.querySelector("#vsxCharacterPickSearch"),sel=tools.querySelector("#vsxCharacterPickRarity");
   input.addEventListener("input",()=>{PICK_STATE.query=input.value;applyPickFilter()});
   sel.addEventListener("change",()=>{PICK_STATE.rarity=sel.value;applyPickFilter()});
 }
 const input=tools.querySelector("#vsxCharacterPickSearch"),sel=tools.querySelector("#vsxCharacterPickRarity");
 input.placeholder=pickL("SEARCH SURVIVOR","TÌM NHÂN VẬT");input.setAttribute("aria-label",input.placeholder);input.value=PICK_STATE.query||"";
 const current=PICK_STATE.rarity||"all";
 sel.innerHTML=`<option value="all">${pickL("ALL RARITIES","TẤT CẢ ĐỘ HIẾM")}</option>`+RARITIES.map(r=>`<option value="${r}">${r.toUpperCase()}</option>`).join("");
 sel.value=RARITIES.includes(current)?current:"all";PICK_STATE.rarity=sel.value;
 return tools;
}
function applyPickFilter(){
 const grid=document.getElementById("vsxCharacterGrid"),tools=ensurePickTools();if(!grid||!tools)return;
 const q=String(PICK_STATE.query||"").trim().toLocaleLowerCase(),rar=PICK_STATE.rarity||"all";
 let shown=0,total=0;
 for(const card of grid.querySelectorAll(":scope > .vsxPick")){
   const id=card.dataset.characterId,d=CHARACTER_DEFINITIONS[id];if(!d)continue;total++;
   const hay=[id,d.name?.en,d.name?.vi,d.desc?.en,d.desc?.vi].filter(Boolean).join(" ").toLocaleLowerCase();
   const cardR=String(card.dataset.rarity||d.rarity||"common").toLowerCase();
   const ok=(!q||hay.includes(q))&&(rar==="all"||cardR===rar);
   card.classList.toggle("vsxPickFilteredOut",!ok);if(ok)shown++;
 }
 const count=tools.querySelector("#vsxCharacterPickCount");if(count)count.textContent=`${shown} / ${total}`;
}
const PICK_RENDER_BASE=VSX.renderSetup;
VSX.renderSetup=function(){const r=PICK_RENDER_BASE.apply(this,arguments);ensurePickTools();applyPickFilter();return r};
/* Language changes re-render Setup through existing wrappers; this keeps labels/filter state synchronized. */
queueMicrotask(()=>{ensurePickTools();applyPickFilter()});
window.VSX_CHARACTER_PICK_FILTER={state:PICK_STATE,apply:applyPickFilter,reset(){PICK_STATE.query="";PICK_STATE.rarity="all";const i=document.getElementById("vsxCharacterPickSearch");if(i)i.value="";const s=document.getElementById("vsxCharacterPickRarity");if(s)s.value="all";applyPickFilter()}};
})();
