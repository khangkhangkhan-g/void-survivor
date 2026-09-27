(function(){
"use strict";
const VSX_RARITY_SETUP_BASE=VSX.renderSetup;
const VSX_CHARACTER_RARITY_ORDER=["common","uncommon","rare","epic","legendary"];
const VSX_CHARACTER_RARITY_SET=new Set(VSX_CHARACTER_RARITY_ORDER);
const VSX_CHARACTER_RARITY_RANK=Object.fromEntries(VSX_CHARACTER_RARITY_ORDER.map((r,i)=>[r,i]));
function vsxNormalizeCharacterRarity(v){const r=String(v||"common").toLowerCase();return VSX_CHARACTER_RARITY_SET.has(r)?r:"common"}
function vsxApplyCharacterRarityChips(){
 const grid=document.getElementById("vsxCharacterGrid");if(!grid)return;
 const ids=Object.keys(CHARACTER_DEFINITIONS).filter(id=>isCharacterUnlocked(id));
 const cards=[...grid.children].filter(el=>el.classList.contains("vsxPick"));
 cards.forEach((card,i)=>{
   const id=ids[i],d=CHARACTER_DEFINITIONS[id];if(!id||!d)return;
   const rarity=vsxNormalizeCharacterRarity(d.rarity);
   card.dataset.characterId=id;card.dataset.rarity=rarity;card.dataset.rosterOrder=String(i);
   /* Older renderers inserted badges only for Epic/Legendary. Remove them so every card uses one canonical chip. */
   card.querySelectorAll(":scope > .vsxRarityBadge, :scope > .vsxPickRarityRow").forEach(n=>n.remove());
   const row=document.createElement("div");row.className="vsxPickRarityRow";
   const chip=document.createElement("span");chip.className=`vsxSetupRarityChip ${rarity}`;chip.dataset.rarity=rarity;chip.textContent=rarity.toUpperCase();
   row.appendChild(chip);
   const h3=card.querySelector("h3");if(h3)card.insertBefore(row,h3);else card.prepend(row);
 });
 /* Character Select order: lowest rarity first, then increasingly rare toward the end.
    Preserve the existing roster order inside each rarity tier. */
 [...cards].sort((a,b)=>{
   const ra=VSX_CHARACTER_RARITY_RANK[a.dataset.rarity]??0,rb=VSX_CHARACTER_RARITY_RANK[b.dataset.rarity]??0;
   return ra-rb+(ra===rb?((Number(a.dataset.rosterOrder)||0)-(Number(b.dataset.rosterOrder)||0)):0);
 }).forEach(card=>grid.appendChild(card));
}
VSX.renderSetup=function(){const r=VSX_RARITY_SETUP_BASE.apply(this,arguments);vsxApplyCharacterRarityChips();return r};
window.VSX_APPLY_CHARACTER_RARITY_CHIPS=vsxApplyCharacterRarityChips;
})();
