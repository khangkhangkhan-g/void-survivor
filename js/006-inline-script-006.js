/* =========================================================
   VOID SURVIVOR — WAVE / ARMORY / RUN PREP / SETTINGS PATCH
   ========================================================= */
"use strict";

// ---------- Definitions ----------
Object.assign(I18N.en,{
 easy:"EASY",armory:"ARMORY",settings:"SETTINGS",progression:"PROGRESSION",runPrep:"RUN PREP",arsenal:"ARSENAL",loadout:"LOADOUT",customization:"CUSTOMIZATION",
 spendScore:"SCORE",spendKills:"KILLS",lifetime:"LIFETIME",legacyTree:"LEGACY TREE",rerollLab:"REROLL LAB",unlocks:"UNLOCKS",boostPack:"TACTICAL BOOSTS",allyContracts:"ALLY CONTRACTS",dropPool:"DROP POOL",skins:"SKINS",
 wave:"WAVE",boost:"BOOST",boostReady:"READY — B",boostActive:"ACTIVE",wavesLeft:"WAVES LEFT",contractComplete:"CONTRACT COMPLETE — ALLY DEPARTING",filterLimit:"Keep at least 60% of unlocked normal items enabled.",favorite:"FAVORITE",activePool:"ACTIVE POOL",equipped:"EQUIPPED",hire:"HIRE",hired:"HIRED FOR NEXT RUN",unlock:"UNLOCK",buy:"BUY",owned:"OWNED",levelShort:"LV",
 gameplay:"GAMEPLAY",visual:"VISUAL",hudSettings:"HUD",audio:"AUDIO",accessibility:"ACCESSIBILITY",keybinds:"KEYBINDS",resetSettings:"RESET SETTINGS",autoContinue:"Auto Continue after normal upgrades",autoPause:"Pause when browser loses focus",waveAnnouncements:"Wave announcements",screenShake:"Screen shake",damageNumbers:"Damage numbers",particleDensity:"Particle density",hudScale:"HUD scale",compactHud:"Compact HUD",reducedFlashing:"Reduced flashing",highContrast:"High-contrast telegraphs",full:"Full",reduced:"Reduced",critOnly:"Crits only",off:"Off",high:"High",balanced:"Balanced",low:"Low",
 poolWarning:"Disabled from random acquisition. Starter grants and owned upgrades still work.",evolutionWarning:"Disabling this item can make some Evolutions unavailable.",rerollCapacity:"Reroll Capacity",rerollQuality:"Reroll Quality",nextRun:"NEXT RUN",noContract:"No Contract Ally",noBoosts:"No Tactical Boosts equipped",currencyEarned:"ARMORY CURRENCY EARNED",continueHotkey:"SPACE — CONTINUE"
});
Object.assign(I18N.vi,{
 easy:"DỄ",armory:"KHO TRANG BỊ",settings:"CÀI ĐẶT",progression:"PHÁT TRIỂN",runPrep:"CHUẨN BỊ TRẬN",arsenal:"KHO VŨ KHÍ",loadout:"TRANG BỊ",customization:"TÙY BIẾN",
 spendScore:"ĐIỂM",spendKills:"ĐIỂM HẠ GỤC",lifetime:"TỔNG TÍCH LŨY",legacyTree:"CÂY DI SẢN",rerollLab:"PHÒNG ĐỔI LỰA CHỌN",unlocks:"MỞ KHÓA",boostPack:"TĂNG CƯỜNG CHIẾN THUẬT",allyContracts:"HỢP ĐỒNG ĐỒNG MINH",dropPool:"NHÓM RƠI",skins:"NGOẠI TRANG",
 wave:"ĐỢT",boost:"TĂNG CƯỜNG",boostReady:"SẴN SÀNG — B",boostActive:"ĐANG HOẠT ĐỘNG",wavesLeft:"ĐỢT CÒN LẠI",contractComplete:"HẾT HỢP ĐỒNG — ĐỒNG MINH RỜI TRẬN",filterLimit:"Phải giữ ít nhất 60% vật phẩm thường đã mở khóa trong nhóm rơi.",favorite:"ƯU TIÊN",activePool:"NHÓM ĐANG BẬT",equipped:"ĐÃ TRANG BỊ",hire:"THUÊ",hired:"ĐÃ THUÊ CHO TRẬN TỚI",unlock:"MỞ KHÓA",buy:"MUA",owned:"ĐÃ SỞ HỮU",levelShort:"CẤP",
 gameplay:"TRÒ CHƠI",visual:"HÌNH ẢNH",hudSettings:"HUD",audio:"ÂM THANH",accessibility:"TRỢ NĂNG",keybinds:"PHÍM BẤM",resetSettings:"ĐẶT LẠI CÀI ĐẶT",autoContinue:"Tự tiếp tục sau nâng cấp thường",autoPause:"Tự tạm dừng khi chuyển khỏi cửa sổ game",waveAnnouncements:"Thông báo chuyển Đợt",screenShake:"Độ rung màn hình",damageNumbers:"Mật độ số sát thương",particleDensity:"Mật độ hiệu ứng hạt",hudScale:"Kích thước HUD",compactHud:"HUD gọn",reducedFlashing:"Giảm nhấp nháy",highContrast:"Cảnh báo nguy hiểm tương phản cao",full:"Đầy đủ",reduced:"Giảm",critOnly:"Chỉ chí mạng",off:"Tắt",high:"Cao",balanced:"Cân bằng",low:"Thấp",
 poolWarning:"Đã tắt khỏi nhóm rơi ngẫu nhiên. Vũ khí khởi đầu và nâng cấp đồ đang sở hữu vẫn hoạt động.",evolutionWarning:"Tắt vật phẩm này có thể khiến một số hướng Tiến Hóa không thể hoàn thành.",rerollCapacity:"Số Lượt Đổi",rerollQuality:"Chất Lượng Đổi",nextRun:"TRẬN TIẾP THEO",noContract:"Không thuê Đồng Minh",noBoosts:"Chưa trang bị Tăng Cường",currencyEarned:"TÀI NGUYÊN KHO TRANG BỊ NHẬN ĐƯỢC",continueHotkey:"SPACE — TIẾP TỤC"
});

DIFFICULTY_DEFINITIONS.easy={name:{en:"Easy",vi:"Dễ"},hp:.82,damage:.75,speed:.92,elite:.65,score:.75,spawn:.78,currency:.80};
DIFFICULTY_DEFINITIONS.normal.spawn=.94;DIFFICULTY_DEFINITIONS.normal.currency=1;
DIFFICULTY_DEFINITIONS.hard.spawn=.98;DIFFICULTY_DEFINITIONS.hard.currency=1.35;
DIFFICULTY_DEFINITIONS.nightmare.spawn=1.02;DIFFICULTY_DEFINITIONS.nightmare.currency=1.80;

// Two shop-exclusive normal weapons and passives. They are never granted before purchase.
Object.assign(WEAPON_DEFINITIONS,{
 ion_repeater:{name:"Ion Repeater",desc:"A rapid ion rifle that ramps its projectile cadence through continuous pressure.",rarity:"rare",shopLocked:true,tags:["projectile","rapid","electric"],behavior:"singleProjectile",damage:17,cooldown:.34,speed:720,size:5,pierce:1,knockback:22,maxLevel:5,levels:lv({}, {damageMul:1.22},{pierceAdd:1},{cooldownMul:.82},{special:"empowered5"})},
 graviton_disc:{name:"Graviton Disc",desc:"A heavy ricochet disc that bends through clustered enemies with strong knockback.",rarity:"epic",shopLocked:true,tags:["projectile","physical","control"],behavior:"ricochet",damage:29,cooldown:1.38,speed:500,size:11,bounce:3,knockback:70,maxLevel:5,levels:lv({}, {bounceAdd:1},{damageMul:1.24},{sizeMul:1.18},{special:"rampingBounce"})}
});
VI_WEAPON.ion_repeater=["Súng Lặp Ion","Súng ion tốc độ cao duy trì áp lực liên tục bằng nhịp bắn dày và xuyên mục tiêu."];
VI_WEAPON.graviton_disc=["Đĩa Trọng Lực","Đĩa nặng nảy qua cụm địch, bẻ hướng liên tục và hất văng mục tiêu mạnh."];
WEAPON_MUTATIONS.ion_repeater=[{id:"ion_repeater__tempo",name:{en:"Overdrive",vi:"Quá Tải Nhịp Bắn"},desc:{en:"Faster pressure and extra pierce.",vi:"Tăng mạnh nhịp bắn và khả năng xuyên."},mods:{cooldownMul:.78,pierceAdd:1,damageMul:.94}},{id:"ion_repeater__power",name:{en:"Ion Lance",vi:"Thương Ion"},desc:{en:"Heavier ion bolts with larger impact.",vi:"Đạn ion nặng hơn, sát thương và kích thước tăng mạnh."},mods:{damageMul:1.55,sizeMul:1.25,cooldownMul:1.16}}];
WEAPON_MUTATIONS.graviton_disc=[{id:"graviton_disc__tempo",name:{en:"Orbital Skip",vi:"Nảy Quỹ Đạo"},desc:{en:"More ricochets and faster throws.",vi:"Tăng số lần nảy và ném nhanh hơn."},mods:{bounceAdd:2,cooldownMul:.82,damageMul:.94}},{id:"graviton_disc__power",name:{en:"Mass Driver",vi:"Đĩa Siêu Trọng"},desc:{en:"Massively heavier disc impacts.",vi:"Đĩa nặng hơn rất nhiều, tăng sát thương và lực hất."},mods:{damageMul:1.58,sizeMul:1.22,knockbackMul:1.35,cooldownMul:1.15}}];

Object.assign(PASSIVE_DEFINITIONS,{
 phase_battery:{name:"Phase Battery",desc:"Dash cooldown is reduced by 4% per level.",maxLevel:5,rarity:"rare",shopLocked:true},
 tactical_insight:{name:"Tactical Insight",desc:"Ultimate charge gained is increased by 4% per level.",maxLevel:5,rarity:"rare",shopLocked:true}
});
VI_PASSIVE.phase_battery=["Pin Dịch Chuyển","Giảm 4% hồi chiêu Lướt mỗi cấp."];
VI_PASSIVE.tactical_insight=["Trực Giác Chiến Thuật","Tăng 4% lượng Tuyệt Kỹ nhận được mỗi cấp."];

Object.assign(CHARACTER_DEFINITIONS,{
 chronomancer:{name:{en:"Chronomancer",vi:"Thời Thuật Sư"},desc:{en:"Controls combat tempo with longer effects and accelerated Ultimate charging. Shop unlock.",vi:"Điều khiển nhịp giao tranh bằng hiệu ứng kéo dài và nạp Tuyệt Kỹ nhanh hơn. Nhân vật mở khóa trong Kho Trang Bị."},weapon:"void_rift",mods:{duration:1.18,move:.96},ultimate:"chrono_lock",shopOnly:true},
 beastmaster:{name:{en:"Beastmaster",vi:"Ngự Thú Sư"},desc:{en:"A companion specialist whose allies hit harder. Shop unlock.",vi:"Chuyên gia đồng minh, tăng sức tấn công của đội hình triệu hồi. Nhân vật mở khóa trong Kho Trang Bị."},weapon:"drone",mods:{allyDamage:1.16,allySpeed:1.08},ultimate:"pack_hunt",shopOnly:true}
});

const META_UPGRADES={
 vitality:{name:{en:"Legacy Vitality",vi:"Sinh Lực Di Sản"},desc:{en:"+2% Max HP per level.",vi:"+2% Máu Tối Đa mỗi cấp."},max:8,currency:"score",base:2200,scale:1.55},
 power:{name:{en:"Legacy Power",vi:"Sức Mạnh Di Sản"},desc:{en:"+1.5% damage per level.",vi:"+1,5% sát thương mỗi cấp."},max:8,currency:"score",base:2600,scale:1.58},
 mobility:{name:{en:"Legacy Mobility",vi:"Cơ Động Di Sản"},desc:{en:"+1% movement speed per level.",vi:"+1% tốc độ di chuyển mỗi cấp."},max:6,currency:"score",base:2100,scale:1.55},
 recovery:{name:{en:"Legacy Recovery",vi:"Hồi Phục Di Sản"},desc:{en:"+2% healing per level.",vi:"+2% hiệu quả hồi phục mỗi cấp."},max:7,currency:"score",base:1900,scale:1.52},
 magnet:{name:{en:"Salvage Magnet",vi:"Nam Châm Thu Gom"},desc:{en:"+4 pickup radius per level.",vi:"+4 bán kính hút vật phẩm mỗi cấp."},max:8,currency:"score",base:1500,scale:1.48},
 xp:{name:{en:"Learning Protocol",vi:"Kinh Nghiệm Chiến Đấu"},desc:{en:"+1% XP gain per level.",vi:"+1% XP nhận được mỗi cấp."},max:8,currency:"score",base:2400,scale:1.58},
 armor:{name:{en:"Legacy Plating",vi:"Giáp Di Sản"},desc:{en:"+1 Armor per level.",vi:"+1 Giáp mỗi cấp."},max:2,currency:"kills",base:2500,scale:2.0}
};
const BOOST_DEFINITIONS={
 firepower:{name:{en:"Firepower",vi:"Hỏa Lực"},desc:{en:"+15% damage while active.",vi:"+15% sát thương khi kích hoạt."},cost:850},
 rapid:{name:{en:"Rapid Assault",vi:"Tấn Công Thần Tốc"},desc:{en:"+12% attack speed while active.",vi:"+12% tốc độ ra đòn khi kích hoạt."},cost:800},
 armor:{name:{en:"Reinforced Suit",vi:"Giáp Gia Cường"},desc:{en:"+2 Armor while active.",vi:"+2 Giáp khi kích hoạt."},cost:700},
 sprint:{name:{en:"Sprint Module",vi:"Mô-đun Bứt Tốc"},desc:{en:"+12% movement speed while active.",vi:"+12% tốc độ di chuyển khi kích hoạt."},cost:650},
 recovery:{name:{en:"Recovery Kit",vi:"Bộ Hồi Phục"},desc:{en:"+20% healing while active.",vi:"+20% hiệu quả hồi phục khi kích hoạt."},cost:650},
 magnet:{name:{en:"Magnet Array",vi:"Mảng Từ Hút"},desc:{en:"+80 pickup radius while active.",vi:"+80 bán kính hút XP/vật phẩm khi kích hoạt."},cost:500},
 lucky:{name:{en:"Tactical Fortune",vi:"Vận May Chiến Thuật"},desc:{en:"+1.5 temporary Luck while active.",vi:"+1,5 Điểm May Mắn tạm thời khi kích hoạt."},cost:900},
 reroll:{name:{en:"Reserve Reroll",vi:"Lượt Đổi Dự Phòng"},desc:{en:"Temporarily adds one reroll during the 5-wave Boost window.",vi:"Tạm thời thêm 1 lượt Đổi trong thời gian Tăng Cường 5 Đợt."},cost:950}
};
const CONTRACT_LAST_WAVE=6,CONTRACT_LEAVE_WAVE=7;
const CONTRACT_DEFINITIONS={
 ember:{name:{en:"Ember Lynx",vi:"Linh Miêu Hỏa Diệm"},role:{en:"Melee Burn",vi:"Cận Chiến Thiêu Đốt"},unlock:2600,hire:900,color:"#ff7b45",hp:.42},
 bulwark:{name:{en:"Bulwark Hound",vi:"Khuyển Hộ Vệ"},role:{en:"Tank / Interceptor",vi:"Chống Chịu / Đỡ Đòn"},unlock:3200,hire:1100,color:"#83b9d8",hp:.72},
 oracle:{name:{en:"Oracle Sprite",vi:"Tinh Linh Tiên Tri"},role:{en:"Vulnerability Support",vi:"Hỗ Trợ Đánh Dấu"},unlock:3000,hire:1000,color:"#d59cff",hp:.38},
 engineer:{name:{en:"Scrap Engineer",vi:"Kỹ Sư Phế Liệu"},role:{en:"Ranged Support",vi:"Hỗ Trợ Tầm Xa"},unlock:3600,hire:1250,color:"#f3bd65",hp:.52},
 raven:{name:{en:"Volt Raven",vi:"Quạ Lôi Điện"},role:{en:"Chain Lightning",vi:"Sét Chuyền"},unlock:3400,hire:1200,color:"#78c8ff",hp:.40},
 medic:{name:{en:"Medic Automaton",vi:"Người Máy Quân Y"},role:{en:"Healing Support",vi:"Hỗ Trợ Hồi Phục"},unlock:4000,hire:1350,color:"#70efb3",hp:.50}
};
const SHOP_UNLOCKS={
 weapons:[{id:"ion_repeater",cost:2200},{id:"graviton_disc",cost:3200}],
 passives:[{id:"phase_battery",cost:2600},{id:"tactical_insight",cost:2800}],
 characters:[{id:"chronomancer",cost:4200},{id:"beastmaster",cost:4600}]
};
const SKIN_DEFINITIONS={
 default:{name:{en:"Core Blue",vi:"Xanh Lõi"},currency:"score",cost:0,color:"#42a5ff"},
 crimson:{name:{en:"Crimson Pulse",vi:"Xung Đỏ Thẫm"},currency:"kills",cost:1800,color:"#ff546e"},
 void:{name:{en:"Void Violet",vi:"Tím Hư Không"},currency:"kills",cost:2200,color:"#a879ff"},
 gold:{name:{en:"Golden Champion",vi:"Nhà Vô Địch Vàng"},currency:"score",cost:8500,color:"#ffd45d"},
 frost:{name:{en:"Frozen Core",vi:"Lõi Băng"},currency:"score",cost:6500,color:"#79e5ff"}
};

function defaultMetaSettings(){return{autoContinue:true,autoPause:true,waveAnnouncements:true,eventBriefings:true,screenShake:1,damageNumbers:"full",particleDensity:"balanced",hudScale:1,compactHud:false,reducedFlashing:false,highContrast:false}}
function ensureArmorySave(){
 const s=VSX.save;
 s.records.easy||=vsxDefaultRecord();
 s.wallet||={score:0,kills:0,lifetimeScore:0,lifetimeKills:0};
 s.meta||={};s.meta.upgrades||={};s.meta.rerollCapacity??=0;s.meta.rerollQuality??=0;s.meta.unlockedWeapons||={};s.meta.unlockedPassives||={};s.meta.unlockedCharacters||={};s.meta.contractLicenses||={};s.meta.boostInventory||={};s.meta.skins||={default:true};
 s.loadout||={boosts:[],contract:null,weaponDisabled:{},passiveDisabled:{},favoriteWeapons:[],favoritePassives:[],skin:"default"};
 s.settings={...defaultMetaSettings(),...(s.settings||{})};
 // Existing content remains available. Only explicit shopLocked content starts locked.
 for(const [id,d] of Object.entries(WEAPON_DEFINITIONS))if(!d.shopLocked)s.meta.unlockedWeapons[id]=true;
 for(const [id,d] of Object.entries(PASSIVE_DEFINITIONS))if(!d.shopLocked)s.meta.unlockedPassives[id]=true;
 for(const [id,d] of Object.entries(CHARACTER_DEFINITIONS))if(!d.shopOnly)s.meta.unlockedCharacters[id]=true;
 for(const k of Object.keys(META_UPGRADES))s.meta.upgrades[k]??=0;
 for(const k of Object.keys(BOOST_DEFINITIONS))s.meta.boostInventory[k]??=0;
 vsxSave();
}
ensureArmorySave();

function walletCan(currency,cost){return (VSX.save.wallet?.[currency]||0)>=cost}
function walletSpend(currency,cost){if(!walletCan(currency,cost))return false;VSX.save.wallet[currency]-=cost;vsxSave();return true}
function upgradeCost(id){const d=META_UPGRADES[id],l=VSX.save.meta.upgrades[id]||0;return Math.round(d.base*Math.pow(d.scale,l))}
function isWeaponUnlocked(id){const d=WEAPON_DEFINITIONS[id];return !!d&&!d.shopLocked||!!VSX.save.meta.unlockedWeapons[id]}
function isPassiveUnlocked(id){const d=PASSIVE_DEFINITIONS[id];return !!d&&!d.shopLocked||!!VSX.save.meta.unlockedPassives[id]}
function isCharacterUnlocked(id){const d=CHARACTER_DEFINITIONS[id];return !!d&&!d.shopOnly||!!VSX.save.meta.unlockedCharacters[id]}
function normalWeaponPool(){return Object.keys(WEAPON_DEFINITIONS).filter(id=>!WEAPON_DEFINITIONS[id].rewardOnly&&isWeaponUnlocked(id))}
function normalPassivePool(){return Object.keys(PASSIVE_DEFINITIONS).filter(id=>isPassiveUnlocked(id))}
function isPoolDisabled(type,id){return !!VSX.save.loadout[type==="weapon"?"weaponDisabled":"passiveDisabled"]?.[id]}
function activePoolCount(type){const a=type==="weapon"?normalWeaponPool():normalPassivePool();return a.filter(id=>!isPoolDisabled(type,id)).length}
function minPoolRequired(type){const a=type==="weapon"?normalWeaponPool():normalPassivePool(),hard=type==="weapon"?18:24;return Math.min(a.length,Math.max(hard,Math.ceil(a.length*.60)))}
function poolToggle(type,id,enabled){const key=type==="weapon"?"weaponDisabled":"passiveDisabled",map=VSX.save.loadout[key];if(enabled){delete map[id];vsxSave();return true}if(activePoolCount(type)-1<minPoolRequired(type)){VSX.announce(t("dropPool"),t("filterLimit"),"#ff9b71");return false}map[id]=true;vsxSave();return true}
function toggleFavorite(type,id){const key=type==="weapon"?"favoriteWeapons":"favoritePassives",arr=VSX.save.loadout[key]||=[];const i=arr.indexOf(id);if(i>=0)arr.splice(i,1);else{if(arr.length>=2)arr.shift();arr.push(id)}VSX.save.loadout[key]=arr;vsxSave()}

// ---------- UI creation ----------
(function(){
 const actions=document.getElementById("vsxTopActions");if(actions&&!document.getElementById("vsxArmoryBtn")){const a=document.createElement("button");a.id="vsxArmoryBtn";a.textContent=t("armory");const s=document.createElement("button");s.id="vsxSettingsBtn";s.textContent=t("settings");actions.insertBefore(a,document.getElementById("vsxLangBtn"));actions.insertBefore(s,document.getElementById("vsxLangBtn"));a.onclick=()=>showArmory("progression");s.onclick=()=>showSettings("gameplay")}
 if(!document.getElementById("vsxArmoryScreen")){const sc=document.createElement("div");sc.id="vsxArmoryScreen";sc.className="screen";sc.innerHTML=`<div class="panel"><div class="vsxMetaHeader"><h2 id="vsxArmoryTitle"></h2><div class="vsxWallet" id="vsxWallet"></div></div><div class="vsxShopTabs" id="vsxArmoryTabs"></div><div id="vsxArmoryContent"></div><div class="row" style="margin-top:14px"><button id="vsxArmoryBack"></button></div></div>`;document.body.appendChild(sc);document.getElementById("vsxArmoryBack").onclick=()=>{sc.classList.remove("active");titleScreen.classList.add("active")}}
 if(!document.getElementById("vsxSettingsScreen")){const sc=document.createElement("div");sc.id="vsxSettingsScreen";sc.className="screen";sc.innerHTML=`<div class="panel"><h2 id="vsxSettingsTitle"></h2><div class="vsxShopTabs" id="vsxSettingsTabs"></div><div id="vsxSettingsContent"></div><div class="row" style="margin-top:14px"><button id="vsxSettingsBack"></button></div></div>`;document.body.appendChild(sc);document.getElementById("vsxSettingsBack").onclick=()=>{sc.classList.remove("active");titleScreen.classList.add("active")}}
 const ah=document.getElementById("vsxActionHud");if(ah&&!document.getElementById("vsxBoostControl")){const q=document.createElement("div");q.id="vsxBoostControl";q.innerHTML=`<div class="vsxAbilityLine"><span id="vsxBoostLabel"></span><span id="vsxBoostText"></span></div><button id="vsxBoostButton"></button>`;ah.appendChild(q);document.getElementById("vsxBoostButton").onclick=()=>game.activateTacticalBoost?.()}
 if(!document.getElementById("vsxWaveHud")){const w=document.createElement("div");w.id="vsxWaveHud";w.className="hudBox";hud.appendChild(w)}
 game.input.gameKeys.add("KeyB");
})();

let ARMORY_TAB="progression",SETTINGS_TAB="gameplay";
function walletHTML(){const w=VSX.save.wallet;return `<span>${t("spendScore")} <b>${Math.floor(w.score)}</b></span><span>${t("spendKills")} <b>${Math.floor(w.kills)}</b></span><span>${t("lifetime")} S ${Math.floor(w.lifetimeScore)} · K ${Math.floor(w.lifetimeKills)}</span>`}
function renderArmoryTabs(){const box=document.getElementById("vsxArmoryTabs"),tabs=[["progression",t("progression")],["runprep",t("runPrep")],["arsenal",t("arsenal")],["loadout",t("loadout")],["customization",t("customization")]];box.innerHTML="";for(const [id,label] of tabs){const b=document.createElement("button");b.textContent=label;b.className=id===ARMORY_TAB?"selected":"";b.onclick=()=>{ARMORY_TAB=id;renderArmory()};box.appendChild(b)}}
function showArmory(tab="progression"){ARMORY_TAB=tab;titleScreen.classList.remove("active");document.getElementById("vsxArmoryScreen").classList.add("active");renderArmory()}
function renderArmory(){ensureArmorySave();document.getElementById("vsxArmoryTitle").textContent=t("armory");document.getElementById("vsxArmoryBack").textContent=t("back");document.getElementById("vsxWallet").innerHTML=walletHTML();renderArmoryTabs();const c=document.getElementById("vsxArmoryContent");if(ARMORY_TAB==="progression")renderProgression(c);else if(ARMORY_TAB==="runprep")renderRunPrep(c);else if(ARMORY_TAB==="arsenal")renderArsenal(c);else if(ARMORY_TAB==="loadout")renderLoadout(c);else renderCustomization(c)}

function shopCard(name,desc,extra,buttonText,disabled,onClick,cls=""){const d=document.createElement("div");d.className=`vsxShopCard ${cls}`;d.innerHTML=`<h3>${VSX.esc(name)}</h3><p>${VSX.esc(desc)}</p>${extra||""}`;if(buttonText){const r=document.createElement("div");r.className="row";const b=document.createElement("button");b.textContent=buttonText;b.disabled=!!disabled;if(onClick)b.onclick=onClick;r.appendChild(b);d.appendChild(r)}return d}
function renderProgression(c){c.innerHTML=`<div class="vsxSectionTitle">${t("legacyTree")}</div><div class="vsxShopGrid" id="vsxLegacyGrid"></div><div class="vsxSectionTitle">${t("rerollLab")}</div><div class="vsxShopGrid" id="vsxRerollGrid"></div><div class="vsxSectionTitle">${t("unlocks")}</div><div class="vsxShopGrid" id="vsxUnlockGrid"></div>`;const g=document.getElementById("vsxLegacyGrid");for(const [id,d] of Object.entries(META_UPGRADES)){const l=VSX.save.meta.upgrades[id]||0,cost=upgradeCost(id),max=l>=d.max,cur=d.currency;g.appendChild(shopCard(d.name[VSX.lang],d.desc[VSX.lang],`<small>${t("levelShort")} ${l}/${d.max}</small><p class="vsxPrice">${max?t("owned"):cost+" "+(cur==="score"?t("spendScore"):t("spendKills"))}</p>`,max?t("owned"):t("buy"),max||!walletCan(cur,cost),()=>{if(walletSpend(cur,cost)){VSX.save.meta.upgrades[id]=l+1;vsxSave();renderArmory()}}))}
 const rg=document.getElementById("vsxRerollGrid"),cap=VSX.save.meta.rerollCapacity||0,q=VSX.save.meta.rerollQuality||0,capCost=Math.round(5000*Math.pow(1.7,cap)),qCost=Math.round(4200*Math.pow(1.6,q));rg.appendChild(shopCard(t("rerollCapacity"),VSX.lang==="vi"?"Tăng số lượt Đổi cơ bản của mỗi trận. Tối đa 8 lượt.":"Increase base rerolls per run, up to 8.",`<small>${3+cap}/8</small><p class="vsxPrice">${cap>=5?t("owned"):capCost+" "+t("spendScore")}</p>`,cap>=5?t("owned"):t("buy"),cap>=5||!walletCan("score",capCost),()=>{if(walletSpend("score",capCost)){VSX.save.meta.rerollCapacity=cap+1;vsxSave();renderArmory()}}));rg.appendChild(shopCard(t("rerollQuality"),VSX.lang==="vi"?"Giảm thẻ lặp và tăng nhẹ chất lượng lựa chọn khi Đổi. Không cộng trực tiếp vào Luck.":"Reduces repeats and modestly improves reroll choice quality without adding generic Luck.",`<small>${q}/5</small><p class="vsxPrice">${q>=5?t("owned"):qCost+" "+t("spendScore")}</p>`,q>=5?t("owned"):t("buy"),q>=5||!walletCan("score",qCost),()=>{if(walletSpend("score",qCost)){VSX.save.meta.rerollQuality=q+1;vsxSave();renderArmory()}}));
 const ug=document.getElementById("vsxUnlockGrid");for(const o of SHOP_UNLOCKS.weapons){const d=WEAPON_DEFINITIONS[o.id],owned=isWeaponUnlocked(o.id);ug.appendChild(shopCard(weaponName(o.id),weaponDesc(o.id),`<p class="vsxPrice">${owned?t("owned"):o.cost+" "+t("spendKills")}</p>`,owned?t("owned"):t("unlock"),owned||!walletCan("kills",o.cost),()=>{if(walletSpend("kills",o.cost)){VSX.save.meta.unlockedWeapons[o.id]=true;vsxDiscover("weapons",o.id);vsxSave();renderArmory()}}))}for(const o of SHOP_UNLOCKS.passives){const d=PASSIVE_DEFINITIONS[o.id],owned=isPassiveUnlocked(o.id);ug.appendChild(shopCard(passiveName(o.id),passiveDesc(o.id),`<p class="vsxPrice">${owned?t("owned"):o.cost+" "+t("spendKills")}</p>`,owned?t("owned"):t("unlock"),owned||!walletCan("kills",o.cost),()=>{if(walletSpend("kills",o.cost)){VSX.save.meta.unlockedPassives[o.id]=true;vsxDiscover("passives",o.id);vsxSave();renderArmory()}}))}for(const o of SHOP_UNLOCKS.characters){const d=CHARACTER_DEFINITIONS[o.id],owned=isCharacterUnlocked(o.id);ug.appendChild(shopCard(d.name[VSX.lang],d.desc[VSX.lang],`<p class="vsxPrice">${owned?t("owned"):o.cost+" "+t("spendKills")}</p>`,owned?t("owned"):t("unlock"),owned||!walletCan("kills",o.cost),()=>{if(walletSpend("kills",o.cost)){VSX.save.meta.unlockedCharacters[o.id]=true;vsxDiscover("characters",o.id);vsxSave();renderArmory()}}))}}

function renderRunPrep(c){c.innerHTML=`<div class="vsxSectionTitle">${t("boostPack")} · ${VSX.save.loadout.boosts.length}/3</div><div class="vsxShopGrid" id="vsxBoostGrid"></div><div class="vsxSectionTitle">${t("allyContracts")}</div><div class="vsxShopGrid" id="vsxContractGrid"></div>`;const bg=document.getElementById("vsxBoostGrid");for(const [id,d] of Object.entries(BOOST_DEFINITIONS)){const inv=VSX.save.meta.boostInventory[id]||0,sel=VSX.save.loadout.boosts.includes(id);const card=shopCard(d.name[VSX.lang],d.desc[VSX.lang],`<small>${VSX.lang==="vi"?"Kho":"Owned"}: ${inv} · ${sel?t("equipped"):""}</small><p class="vsxPrice">${d.cost} ${t("spendScore")}</p>`,t("buy"),!walletCan("score",d.cost),()=>{if(walletSpend("score",d.cost)){VSX.save.meta.boostInventory[id]=(VSX.save.meta.boostInventory[id]||0)+1;vsxSave();renderArmory()}});const row=card.querySelector(".row");const e=document.createElement("button");e.textContent=sel?(VSX.lang==="vi"?"BỎ TRANG BỊ":"UNEQUIP"):(VSX.lang==="vi"?"TRANG BỊ":"EQUIP");e.disabled=!sel&&inv<=0;e.onclick=()=>{const a=VSX.save.loadout.boosts,i=a.indexOf(id);if(i>=0)a.splice(i,1);else if(a.length<3&&inv>0)a.push(id);vsxSave();renderArmory()};row.appendChild(e);bg.appendChild(card)}
 const cg=document.getElementById("vsxContractGrid");for(const [id,d] of Object.entries(CONTRACT_DEFINITIONS)){const lic=!!VSX.save.meta.contractLicenses[id],sel=VSX.save.loadout.contract===id;let extra=`<small>${d.role[VSX.lang]}</small>`;if(!lic)extra+=`<p class="vsxPrice">${d.unlock} ${t("spendKills")} · ${t("unlock")}</p>`;else extra+=`<p class="vsxPrice">${d.hire} ${t("spendScore")} · ${t("hire")}</p>`;const card=shopCard(d.name[VSX.lang],VSX.lang==="vi"?`Đồng minh hợp đồng xuất trận từ Đợt 1 đến hết Đợt ${CONTRACT_LAST_WAVE}, rồi rời trận khi Đợt ${CONTRACT_LEAVE_WAVE} bắt đầu.`:`Contract ally deploys from Wave 1 through Wave ${CONTRACT_LAST_WAVE}, then leaves when Wave ${CONTRACT_LEAVE_WAVE} begins.`,extra,!lic?t("unlock"):sel?t("hired"):t("hire"),sel||(!lic?!walletCan("kills",d.unlock):!walletCan("score",d.hire)),()=>{if(!lic){if(walletSpend("kills",d.unlock)){VSX.save.meta.contractLicenses[id]=true;vsxSave();renderArmory()}}else{const old=VSX.save.loadout.contract,refund=old&&CONTRACT_DEFINITIONS[old]?CONTRACT_DEFINITIONS[old].hire:0;if((VSX.save.wallet.score||0)+refund>=d.hire){VSX.save.wallet.score=(VSX.save.wallet.score||0)+refund-d.hire;VSX.save.loadout.contract=id;vsxSave();renderArmory()}}});cg.appendChild(card)}}

let ARSENAL_TYPE="weapon",ARSENAL_QUERY="";
function renderArsenal(c){const active=activePoolCount(ARSENAL_TYPE),min=minPoolRequired(ARSENAL_TYPE);c.innerHTML=`<div class="vsxSectionTitle">${t("dropPool")}</div><div class="vsxFilterTools"><button id="vsxPoolWeapons">${t("weapons")}</button><button id="vsxPoolPassives">${t("passives")}</button><input id="vsxPoolSearch" placeholder="${VSX.lang==="vi"?"Tìm vật phẩm...":"Search items..."}" value="${VSX.esc(ARSENAL_QUERY)}"><span>${t("activePool")}: <b>${active}</b> · MIN ${min}</span></div><p style="font-size:11px;color:#8da4bb">${t("filterLimit")}</p><div class="vsxFilterList" id="vsxFilterList"></div>`;document.getElementById("vsxPoolWeapons").onclick=()=>{ARSENAL_TYPE="weapon";renderArmory()};document.getElementById("vsxPoolPassives").onclick=()=>{ARSENAL_TYPE="passive";renderArmory()};document.getElementById("vsxPoolSearch").oninput=e=>{ARSENAL_QUERY=e.target.value;renderFilterList()};renderFilterList()}
function renderFilterList(){const box=document.getElementById("vsxFilterList");if(!box)return;box.innerHTML="";const ids=ARSENAL_TYPE==="weapon"?normalWeaponPool():normalPassivePool(),q=ARSENAL_QUERY.trim().toLowerCase(),fav=VSX.save.loadout[ARSENAL_TYPE==="weapon"?"favoriteWeapons":"favoritePassives"]||[];for(const id of ids){const name=ARSENAL_TYPE==="weapon"?weaponName(id):passiveName(id);if(q&&!name.toLowerCase().includes(q))continue;const row=document.createElement("label");row.className="vsxFilterRow";const checked=!isPoolDisabled(ARSENAL_TYPE,id);row.innerHTML=`<input type="checkbox" ${checked?"checked":""}><span><b>${VSX.esc(name)}</b><br><small>${checked?"":t("poolWarning")}</small></span><span class="star ${fav.includes(id)?"on":""}">*</span>`;const cb=row.querySelector("input");cb.onchange=()=>{if(!poolToggle(ARSENAL_TYPE,id,cb.checked))cb.checked=true;renderFilterList()};row.querySelector(".star").onclick=e=>{e.preventDefault();toggleFavorite(ARSENAL_TYPE,id);renderFilterList()};box.appendChild(row)}}

function renderLoadout(c){const b=VSX.save.loadout.boosts.map(id=>BOOST_DEFINITIONS[id]?.name[VSX.lang]).filter(Boolean),con=VSX.save.loadout.contract?CONTRACT_DEFINITIONS[VSX.save.loadout.contract]?.name[VSX.lang]:null,fw=VSX.save.loadout.favoriteWeapons.map(weaponName),fp=VSX.save.loadout.favoritePassives.map(passiveName),u=VSX.save.meta.upgrades;c.innerHTML=`<div class="vsxSectionTitle">${t("nextRun")}</div><div class="vsxLoadoutSummary"><div class="vsxSummaryBox"><b>${t("boostPack")}</b><br>${b.length?b.map(VSX.esc).join(" · "):t("noBoosts")}</div><div class="vsxSummaryBox"><b>${t("allyContracts")}</b><br>${con?VSX.esc(con):t("noContract")}</div><div class="vsxSummaryBox"><b>${t("dropPool")}</b><br>${t("weapons")} ${activePoolCount("weapon")}/${normalWeaponPool().length}<br>${t("passives")} ${activePoolCount("passive")}/${normalPassivePool().length}</div><div class="vsxSummaryBox"><b>${t("rerollLab")}</b><br>${t("rerollCapacity")}: ${3+(VSX.save.meta.rerollCapacity||0)}<br>${t("rerollQuality")}: ${VSX.save.meta.rerollQuality||0}/5</div><div class="vsxSummaryBox"><b>${t("favorite")}</b><br>W: ${fw.join(" · ")||"—"}<br>P: ${fp.join(" · ")||"—"}</div><div class="vsxSummaryBox"><b>${t("legacyTree")}</b><br>${Object.entries(META_UPGRADES).map(([id,d])=>`${d.name[VSX.lang]} ${u[id]||0}/${d.max}`).join("<br>")}</div></div>`}
function renderCustomization(c){c.innerHTML=`<div class="vsxSectionTitle">${t("skins")}</div><div class="vsxShopGrid" id="vsxSkinGrid"></div>`;const g=document.getElementById("vsxSkinGrid");for(const [id,d] of Object.entries(SKIN_DEFINITIONS)){const own=!!VSX.save.meta.skins[id],sel=VSX.save.loadout.skin===id;const extra=`<p><span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:${d.color};box-shadow:0 0 12px ${d.color}"></span></p><p class="vsxPrice">${own?t("owned"):d.cost+" "+(d.currency==="score"?t("spendScore"):t("spendKills"))}</p>`;g.appendChild(shopCard(d.name[VSX.lang],VSX.lang==="vi"?"Ngoại trang thuần mỹ thuật, không cộng chỉ số.":"Purely cosmetic; no stat bonus.",extra,sel?t("equipped"):own?t("equipped"):t("buy"),sel||(!own&&!walletCan(d.currency,d.cost)),()=>{if(!own){if(!walletSpend(d.currency,d.cost))return;VSX.save.meta.skins[id]=true}VSX.save.loadout.skin=id;vsxSave();renderArmory()}))}}

function renderRunPrepSummary(){let el=document.getElementById("vsxRunPrepSummary");const panel=document.querySelector("#vsxSetupScreen .panel");if(!panel)return;if(!el){el=document.createElement("div");el.id="vsxRunPrepSummary";document.getElementById("vsxDifficulty")?.insertAdjacentElement("afterend",el)}const b=VSX.save.loadout.boosts.map(id=>BOOST_DEFINITIONS[id]?.name[VSX.lang]).filter(Boolean),c=VSX.save.loadout.contract?CONTRACT_DEFINITIONS[VSX.save.loadout.contract]?.name[VSX.lang]:null;el.innerHTML=`<b>${t("runPrep")}</b> · ${t("boostPack")}: ${b.length?b.map(VSX.esc).join(" / "):t("noBoosts")} · ${t("allyContracts")}: ${c?VSX.esc(c):t("noContract")} · ${t("rerollCapacity")}: ${3+(VSX.save.meta.rerollCapacity||0)} · ${t("dropPool")}: W ${activePoolCount("weapon")}/${normalWeaponPool().length} · P ${activePoolCount("passive")}/${normalPassivePool().length}`}

// ---------- Settings ----------
function showSettings(tab="gameplay"){SETTINGS_TAB=tab;titleScreen.classList.remove("active");document.getElementById("vsxSettingsScreen").classList.add("active");renderSettings()}
function renderSettings(){const sc=document.getElementById("vsxSettingsScreen");document.getElementById("vsxSettingsTitle").textContent=t("settings");document.getElementById("vsxSettingsBack").textContent=t("back");const tabs=document.getElementById("vsxSettingsTabs"),arr=[["gameplay",t("gameplay")],["visual",t("visual")],["hud",t("hudSettings")],["audio",t("audio")],["keybinds",t("keybinds")],["access",t("accessibility")]];tabs.innerHTML="";for(const [id,l] of arr){const b=document.createElement("button");b.textContent=l;b.className=id===SETTINGS_TAB?"selected":"";b.onclick=()=>{SETTINGS_TAB=id;renderSettings()};tabs.appendChild(b)}const c=document.getElementById("vsxSettingsContent");c.innerHTML="";if(SETTINGS_TAB==="gameplay"){settingCheck(c,"autoContinue",t("autoContinue"),VSX.lang==="vi"?"Nâng cấp thường tiếp tục ngay; SPACE dùng cho các màn hình Tiếp tục.":"Normal upgrades continue immediately; SPACE is used on Continue screens.");settingCheck(c,"autoPause",t("autoPause"),"");settingCheck(c,"waveAnnouncements",t("waveAnnouncements"),"");settingCheck(c,"eventBriefings",t("eventBriefings"),t("eventBriefingsDesc"))}else if(SETTINGS_TAB==="visual"){settingSelect(c,"screenShake",t("screenShake"),[[1,"100%"],[.5,"50%"],[.25,"25%"],[0,t("off")]]);settingSelect(c,"damageNumbers",t("damageNumbers"),[["full",t("full")],["reduced",t("reduced")],["crit",t("critOnly")],["off",t("off")]]);settingSelect(c,"particleDensity",t("particleDensity"),[["high",t("high")],["balanced",t("balanced")],["low",t("low")]])}else if(SETTINGS_TAB==="hud"){settingSelect(c,"hudScale",t("hudScale"),[[.8,"80%"],[.9,"90%"],[1,"100%"],[1.1,"110%"],[1.25,"125%"]]);settingCheck(c,"compactHud",t("compactHud"),"")}else if(SETTINGS_TAB==="keybinds"){window.VSX_KEYBINDS?.render?.(c)}else if(SETTINGS_TAB==="audio"){const r=document.createElement("div");r.className="vsxSettingRow";r.innerHTML=`<label>${VSX.lang==="vi"?"Bật / tắt âm thanh":"Sound toggle"}<small>M</small></label><button>${game.audio.muted?(VSX.lang==="vi"?"BẬT ÂM":"SOUND ON"):(VSX.lang==="vi"?"TẮT ÂM":"MUTE")}</button>`;r.querySelector("button").onclick=()=>{game.audio.toggle();renderSettings()};c.appendChild(r)}else{settingCheck(c,"reducedFlashing",t("reducedFlashing"),"");settingCheck(c,"highContrast",t("highContrast"),"")}const r=document.createElement("div");r.className="row";r.style.marginTop="16px";const b=document.createElement("button");b.textContent=t("resetSettings");b.onclick=()=>{VSX.save.settings=defaultMetaSettings();vsxSave();applyMetaSettings();renderSettings()};r.appendChild(b);c.appendChild(r)}
function settingCheck(parent,key,label,desc){const r=document.createElement("div");r.className="vsxSettingRow";r.innerHTML=`<label>${VSX.esc(label)}${desc?`<small>${VSX.esc(desc)}</small>`:""}</label><input type="checkbox" ${VSX.save.settings[key]?"checked":""}>`;r.querySelector("input").onchange=e=>{VSX.save.settings[key]=e.target.checked;vsxSave();applyMetaSettings()};parent.appendChild(r)}
function settingSelect(parent,key,label,opts){const r=document.createElement("div");r.className="vsxSettingRow";const lab=document.createElement("label");lab.textContent=label;const s=document.createElement("select");for(const [v,l] of opts){const o=document.createElement("option");o.value=String(v);o.textContent=l;if(String(VSX.save.settings[key])===String(v))o.selected=true;s.appendChild(o)}s.onchange=()=>{let v=s.value;if(key==="screenShake"||key==="hudScale")v=Number(v);VSX.save.settings[key]=v;vsxSave();applyMetaSettings()};r.append(lab,s);parent.appendChild(r)}
function applyMetaSettings(){const s=VSX.save.settings||defaultMetaSettings();document.documentElement.style.setProperty("--vsxHudZoom",String(s.hudScale||1));for(const id of ["statsHud","inventoryHud","vsxActionHud","vsxAllyHud"]){const e=document.getElementById(id);if(e)e.style.zoom=String(s.hudScale||1)}document.body.classList.toggle("vsxCompactHud",!!s.compactHud)}
applyMetaSettings();

// ---------- Pool-aware choice generation + reroll quality ----------
const META_GENERATE_BASE=Game.prototype.generateChoices;
Game.prototype.generateChoices=function(){
 const quality=this._armoryRerolling?(VSX.save.meta.rerollQuality||0):0;let best=[],bestScore=-1;
 const tries=1+quality;
 for(let t0=0;t0<tries;t0++){
  const gathered=[];for(let pass=0;pass<18&&gathered.length<3;pass++){const arr=META_GENERATE_BASE.call(this);for(const c of arr){let ok=true;if(c.type==="newWeapon")ok=isWeaponUnlocked(c.id)&&!isPoolDisabled("weapon",c.id);else if(c.type==="passive"&&this.player.passiveLevel(c.id)===0)ok=isPassiveUnlocked(c.id)&&!isPoolDisabled("passive",c.id);if(ok&&!gathered.some(x=>x.type===c.type&&x.id===c.id))gathered.push(c);if(gathered.length>=3)break}}
  const favW=VSX.save.loadout.favoriteWeapons||[],favP=VSX.save.loadout.favoritePassives||[];let score=0;for(const c of gathered){score+=({common:0,uncommon:1,rare:2,epic:3,legendary:4}[c.rarity]||0);if(c.type==="newWeapon"&&favW.includes(c.id))score+=1.2;if(c.type==="passive"&&favP.includes(c.id))score+=1.2}if(score>bestScore){bestScore=score;best=gathered}}
 return best.slice(0,3)
};
const META_REROLL_BASE=Game.prototype.rerollLevelUp;
Game.prototype.rerollLevelUp=function(){this._armoryRerolling=true;try{return META_REROLL_BASE.call(this)}finally{this._armoryRerolling=false}};

// Reroll Investor uses percentage remaining, not raw upgraded capacity.
const META_RECALC_BASE=Player.prototype.recalc;
Player.prototype.recalc=function(){META_RECALC_BASE.call(this);const up=VSX.save.meta?.upgrades||{};this.maxHp=Math.round(this.maxHp*(1+.02*(up.vitality||0)));if(this.hp>this.maxHp)this.hp=this.maxHp;this.damageMultiplier*=1+.015*(up.power||0);this.moveSpeed*=1+.01*(up.mobility||0);this.healingMultiplier*=1+.02*(up.recovery||0);this.pickupRadius+=4*(up.magnet||0);this.xpGain*=1+.01*(up.xp||0);this.armor+=up.armor||0;
 const inv=this.passiveLevel("reroll_investor");if(inv>0&&game?.rerollsMax){const raw=(game.rerollsRemaining||0)*.375*inv,normalized=((game.rerollsRemaining||0)/Math.max(1,game.rerollsMax))*3*.375*inv;this.luck+=normalized-raw}
 if(game?.boostActive){const bs=new Set(game.tacticalBoostIds||[]);if(bs.has("firepower"))this.damageMultiplier*=1.15;if(bs.has("rapid"))this.attackSpeed*=1.12;if(bs.has("armor"))this.armor+=2;if(bs.has("sprint"))this.moveSpeed*=1.12;if(bs.has("recovery"))this.healingMultiplier*=1.20;if(bs.has("magnet"))this.pickupRadius+=80;if(bs.has("lucky"))this.luck+=1.5}
};
const META_DASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){const before=this.dashCooldown;const r=META_DASH_BASE.call(this);if(before<=0&&this.dashCooldown>0){const l=this.player?.passiveLevel("phase_battery")||0;if(l)this.dashCooldown*=1-.04*l}return r};
const META_ULT_CHARGE_BASE=Game.prototype.addUltimateCharge;
Game.prototype.addUltimateCharge=function(v){const l=this.player?.passiveLevel("tactical_insight")||0;return META_ULT_CHARGE_BASE.call(this,v*(1+.04*l))};

// ---------- Chronomancer / Beastmaster ultimates ----------
const META_ULTIMATE_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){const id=CHARACTER_DEFINITIONS[this.characterId]?.ultimate;if(!["chrono_lock","pack_hunt"].includes(id))return META_ULTIMATE_BASE.call(this);if(this.state!=="PLAYING"||this.ultimateCharge<100||this.ultimateActive)return;this.ultimateCharge=0;this._ultReadyAnnounced=false;this.ultimateActive=true;this.stats.ultimates++;VSX.announce(t("ultimate"),CHARACTER_DEFINITIONS[this.characterId].name[VSX.lang],"#b879ff");if(id==="chrono_lock"){this.timeDilation=Math.max(this.timeDilation,6);for(const e of this.enemies)if(!e.dead){if(e.isBoss)e.applyStatus("slow",5,.35,null);else e.applyStatus("slow",5,.72,null)}this.effects.push(new WaveEffect(this.player.x,this.player.y,360,1.1,40*this.player.damageMultiplier,35,null,"#9cdfff"));this.ultimateActive=false}else{this.allyBuffTimer=9;this.allyBuffStrength=.95;this.ultimateBuff={id:"pack_hunt",time:9};this.ultimateBuffTimer=9;this.ultimateActive=false}};
const META_ALLY_DMG_BASE=Game.prototype.allyDamageMultiplier;
Game.prototype.allyDamageMultiplier=function(){let m=META_ALLY_DMG_BASE.call(this);if(this.ultimateBuff?.id==="pack_hunt")m*=1.30;return Math.min(2.5,m)};

// ---------- Contract allies ----------
class VSX_ContractAlly{
 constructor(id){
  this.id=id;this.def=CONTRACT_DEFINITIONS[id];
  const p=game.player,ids=Object.keys(CONTRACT_DEFINITIONS),idx=Math.max(0,ids.indexOf(id));
  this.formationAngle=-Math.PI*.72+idx*Math.PI*2/Math.max(1,ids.length);
  this.formationRadius=id==="bulwark"?86:id==="ember"?104:116;
  this.x=p.x+Math.cos(this.formationAngle)*this.formationRadius;this.y=p.y+Math.sin(this.formationAngle)*this.formationRadius;
  this.maxHp=Math.round(p.maxHp*this.def.hp);this.hp=this.maxHp;this.radius=id==="bulwark"?18:13;this.dead=false;this.cool=.3;this.pulse=2;this.invuln=0;this.leave=false;this.contractLastWave=CONTRACT_LAST_WAVE;this.vx=0;this.vy=0;this.wanderPhase=Math.random()*Math.PI*2;
 }
 moveToward(tx,ty,speed,dt){const dx=tx-this.x,dy=ty-this.y,d=Math.hypot(dx,dy)||1,slow=clamp(d/90,.28,1),tvx=dx/d*speed*slow,tvy=dy/d*speed*slow,k=1-Math.pow(.012,dt);this.vx=lerp(this.vx||0,tvx,k);this.vy=lerp(this.vy||0,tvy,k);this.x+=this.vx*dt;this.y+=this.vy*dt;return d}
 keepPlayerSpacing(p){const dx=this.x-p.x,dy=this.y-p.y,d=Math.hypot(dx,dy),min=(p.radius||16)+this.radius+24;if(d>=min)return;const a=d>.001?Math.atan2(dy,dx):this.formationAngle;this.x=p.x+Math.cos(a)*min;this.y=p.y+Math.sin(a)*min}
 update(dt){
  if(this.dead||this.leave)return;this.invuln=Math.max(0,this.invuln-dt);this.cool-=dt;this.pulse-=dt;
  const p=game.player,target=game.findNearest(this.x,this.y,800);this.wanderPhase=(this.wanderPhase||0)+dt*(this.id==="bulwark"?.32:.48);const orbit=this.formationAngle+(game.time||0)*(this.id==="raven"?.24:.16)+Math.sin(this.wanderPhase+this.formationAngle)*.18,rad=this.formationRadius+Math.sin(this.wanderPhase*.73+this.formationAngle)*14;
  const ax=p.x+Math.cos(orbit)*rad,ay=p.y+Math.sin(orbit)*rad,pd=Math.hypot(this.x-p.x,this.y-p.y);
  if(pd>760){this.x=ax;this.y=ay;this.vx=this.vy=0}
  if(this.id==="ember"||this.id==="bulwark"){
   const engage=target&&Math.hypot(target.x-p.x,target.y-p.y)<500&&pd<520;
   if(engage){const td=Math.hypot(target.x-this.x,target.y-this.y)||1;this.moveToward(target.x,target.y,this.id==="ember"?330:220,dt);if(td<target.size+this.radius+12&&this.cool<=0){this.cool=(this.id==="ember"?.38:.62)/game.allyAttackSpeedMultiplier();game.damageEnemy(target,(this.id==="ember"?25:18)*game.player.damageMultiplier*game.allyDamageMultiplier(),{source:{id:"contract_"+this.id,def:{tags:["ally"]}},canCrit:false,knockback:this.id==="bulwark"?100:38,fromX:this.x,fromY:this.y});if(this.id==="ember")target.applyStatus("burn",2.2,4,null)}}
   else this.moveToward(ax,ay,285,dt);
  }else{
   // Ranged/support contracts flow around the survivor instead of locking to a rigid slot.
   const strafe=target?Math.sin((game.time||0)*.9+this.wanderPhase)*22:0,tn=target?normalize(-(target.y-this.y),target.x-this.x):{x:0,y:0};this.moveToward(ax+tn.x*strafe,ay+tn.y*strafe,270,dt);
   if(target&&this.cool<=0){this.cool=(this.id==="raven"?.75:1.05)/game.allyAttackSpeedMultiplier();if(this.id==="oracle"){target.applyStatus("vulnerable",2.2,.16,null);game.damageEnemy(target,10*game.player.damageMultiplier*game.allyDamageMultiplier(),{source:{id:"contract_oracle",def:{tags:["ally"]}},canCrit:false})}else if(this.id==="raven"){const near=game.nearestList(target.x,target.y,260,3);for(const e of near)game.damageEnemy(e,15*game.player.damageMultiplier*game.allyDamageMultiplier(),{source:{id:"contract_raven",def:{tags:["ally","electric"]}},canCrit:false,damageType:"electric"})}else if(this.id==="engineer")game.damageEnemy(target,20*game.player.damageMultiplier*game.allyDamageMultiplier(),{source:{id:"contract_engineer",def:{tags:["ally","projectile"]}},canCrit:false})}
  }
  if(this.id==="medic"&&this.pulse<=0){this.pulse=3.4;p.heal(p.maxHp*.025,false);game.healAllies(p.maxHp*.012);game.effects.push(new WaveEffect(this.x,this.y,65,.35,0,0,null,"#75efb4"))}
  if(this.id==="bulwark")for(const q of game.enemyProjectiles){if(!q.dead&&Math.hypot(q.x-this.x,q.y-this.y)<this.radius+q.radius+5){q.dead=true;game.stats.projectilesBlocked++;game.stats.damagePrevented+=q.damage||6}}
  this.keepPlayerSpacing(p);
 }
 takeDamage(v){if(this.dead||this.invuln>0)return;this.hp-=Math.max(1,v*.8);this.invuln=.35;if(this.hp<=0){this.hp=0;this.dead=true;game.texts.push(new FloatingText(this.x,this.y-28,VSX.lang==="vi"?"ĐỒNG MINH GỤC":"CONTRACT ALLY DOWN","#ff8797",13))}}
 heal(v){if(!this.dead)this.hp=Math.min(this.maxHp,this.hp+v)}
 render(g){if(this.dead||this.leave)return;g.save();g.translate(this.x,this.y);g.shadowBlur=13;g.shadowColor=this.def.color;g.fillStyle=this.def.color;if(this.id==="raven"){g.beginPath();g.moveTo(-14,4);g.lineTo(0,-11);g.lineTo(14,4);g.lineTo(0,10);g.closePath();g.fill()}else{g.beginPath();g.arc(0,0,this.radius,0,Math.PI*2);g.fill()}g.fillStyle="#07111e";g.font="900 8px Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(this.id.slice(0,2).toUpperCase(),0,1);g.restore();const w=32;g.fillStyle="#101a28";g.fillRect(this.x-w/2,this.y-this.radius-9,w,3);g.fillStyle=this.def.color;g.fillRect(this.x-w/2,this.y-this.radius-9,w*clamp(this.hp/this.maxHp,0,1),3)}
}
const META_COUNT_ALLIES_BASE=Game.prototype.countActiveAllies;
Game.prototype.countActiveAllies=function(){return META_COUNT_ALLIES_BASE.call(this)+(this.contractAlly&&!this.contractAlly.dead&&!this.contractAlly.leave?1:0)};
const META_NEAR_ALLIES_BASE=Game.prototype.countNearbyAllies;
Game.prototype.countNearbyAllies=function(range){let n=META_NEAR_ALLIES_BASE.call(this,range);if(this.contractAlly&&!this.contractAlly.dead&&!this.contractAlly.leave&&Math.hypot(this.contractAlly.x-this.player.x,this.contractAlly.y-this.player.y)<=range)n++;return n};
const META_HEAL_ALLIES_BASE=Game.prototype.healAllies;
Game.prototype.healAllies=function(v){META_HEAL_ALLIES_BASE.call(this,v);this.contractAlly?.heal?.(v)};

// ---------- Run start / tactical boosts / waves ----------
const META_BEGIN_BASE=VSX.beginRun;
VSX.beginRun=function(){
 const selectedBoosts=(VSX.save.loadout.boosts||[]).filter(id=>(VSX.save.meta.boostInventory[id]||0)>0).slice(0,3),contractId=VSX.save.loadout.contract;
 META_BEGIN_BASE();
 this;game.rerollsMax=Math.min(8,3+(VSX.save.meta.rerollCapacity||0));game.rerollsRemaining=game.rerollsMax;game.wave=1;game._lastMetaWave=1;game.tacticalBoostIds=selectedBoosts;game.boostActive=false;game.boostUsed=false;game.boostEndWave=0;game._tempRerollActive=false;for(const id of selectedBoosts)VSX.save.meta.boostInventory[id]=Math.max(0,(VSX.save.meta.boostInventory[id]||0)-1);VSX.save.loadout.boosts=VSX.save.loadout.boosts.filter(id=>(VSX.save.meta.boostInventory[id]||0)>0);
 game.contractAlly=null;if(contractId&&CONTRACT_DEFINITIONS[contractId]){game.contractAlly=new VSX_ContractAlly(contractId);VSX.save.loadout.contract=null}
 game._currencyAwarded=false;vsxSave();game.player.recalc();game.updateHUD(true)
};
Game.prototype.activateTacticalBoost=function(){if(this.state!=="PLAYING"||this.boostUsed||!this.tacticalBoostIds?.length)return false;this.boostUsed=true;this.boostActive=true;this.boostEndWave=this.wave+5;if(this.tacticalBoostIds.includes("reroll")&&!this._tempRerollActive){this._tempRerollActive=true;this.rerollsMax++;this.rerollsRemaining++;}this.player.recalc();VSX.announce(t("boost"),`${t("boostActive")} · 5 ${t("wavesLeft")}`,"#c98cff");return true};
function expireBoost(g){if(!g.boostActive)return;g.boostActive=false;if(g._tempRerollActive){g._tempRerollActive=false;g.rerollsMax=Math.max(1,g.rerollsMax-1);g.rerollsRemaining=Math.min(g.rerollsRemaining,g.rerollsMax)}g.player.recalc();VSX.announce(t("boost"),VSX.lang==="vi"?"TĂNG CƯỜNG ĐÃ HẾT":"BOOST EXPIRED","#8a9bb2")}

// Gentler continuous spawn curve. Wave 1–5 get the most breathing room.
SpawnManager.prototype.update=function(dt){this.timer-=dt;this.specialTimer-=dt;const mode=DIFFICULTY_DEFINITIONS[game.difficultyMode||"normal"],w=game.wave||1,phase=w<=1?.74:w===2?.81:w===3?.86:w===4?.90:w===5?.93:.94;const near=game.grid?.queryCircle(game.player.x,game.player.y,620)?.filter(e=>!e.dead).length||0,density=near>145?.52:near>105?.68:near>75?.82:1,pressure=(mode.spawn||.9)*phase*density;if(this.timer<=0&&game.enemies.length<GAME_CONFIG.maxEnemies){const intensity=1+game.time/112,batchBase=Math.min(6,1+Math.floor(game.time/105)),batch=Math.max(1,Math.round(batchBase*Math.min(1,pressure)));for(let i=0;i<batch;i++)this.spawnOne();const old=Math.max(GAME_CONFIG.minSpawnInterval,GAME_CONFIG.spawnBaseInterval/Math.sqrt(intensity));this.timer=old/Math.max(.45,pressure)}if(this.specialTimer<=0){this.specialTimer=GAME_CONFIG.specialSpawnCheckInterval;this.trySpecialSpawns()}const mark=Math.floor(game.time/GAME_CONFIG.bossInterval);if(mark>this.lastBossMark&&game.time>=GAME_CONFIG.bossInterval){this.lastBossMark=mark;if(!game.boss)this.spawnBoss()}};

const META_GAME_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){META_GAME_UPDATE_BASE.call(this,dt);if(this.state!=="PLAYING"||!this.player)return;const nw=1+Math.floor(this.time/60);this.wave=nw;if(this._lastMetaWave!==nw){this._lastMetaWave=nw;if(VSX.save.settings.waveAnnouncements)VSX.announce(t("wave"),`${t("wave")} ${this.wave}`,"#73dcff");if(this.boostActive&&this.wave>=this.boostEndWave)expireBoost(this)}if(this.contractAlly&&!this.contractAlly.leave&&this.wave>=CONTRACT_LEAVE_WAVE){this.contractAlly.leave=true;VSX.announce(t("allyContracts"),t("contractComplete"),"#ffd06b")}if(this.contractAlly&&!this.contractAlly.dead&&!this.contractAlly.leave)this.contractAlly.update(dt)};
const META_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){META_RENDER_BASE.call(this);if(!this.player||this.state==="TITLE"||!this.contractAlly||this.contractAlly.dead||this.contractAlly.leave)return;ctx.save();ctx.translate(-this.camera.x,-this.camera.y);this.contractAlly.render(ctx);ctx.restore()};

// Contract ally can take some nearby contact pressure.
const META_ENEMY_UPDATE_BASE=Enemy.prototype.update;
Enemy.prototype.update=function(dt){META_ENEMY_UPDATE_BASE.call(this,dt);const a=game?.contractAlly;if(!this.dead&&a&&!a.dead&&!a.leave&&Math.hypot(this.x-a.x,this.y-a.y)<this.size+a.radius&&Math.hypot(this.x-game.player.x,this.y-game.player.y)>this.size+game.player.radius+5){a.takeDamage(this.damage*.34)}};

// ---------- Currency payout ----------
const META_SAVE_RECORDS_BASE=Game.prototype.saveRecords;
Game.prototype.saveRecords=function(){META_SAVE_RECORDS_BASE.call(this);if(this._currencyAwarded)return;this._currencyAwarded=true;const d=DIFFICULTY_DEFINITIONS[this.difficultyMode||"normal"],m=d.currency??1,w=VSX.save.wallet,scoreEarn=Math.floor((this.score||0)*m),killEarn=Math.floor((this.kills||0)*m);w.score+=scoreEarn;w.kills+=killEarn;w.lifetimeScore+=Math.floor(this.score||0);w.lifetimeKills+=Math.floor(this.kills||0);this._lastCurrency={score:scoreEarn,kills:killEarn};vsxSave()};

// ---------- Hotkeys, continue, blur QoL ----------
const META_HANDLE_BASE=Game.prototype.handleKey;
Game.prototype.handleKey=function(code){if(code==="KeyB"&&this.state==="PLAYING"){this.activateTacticalBoost();return}if(code==="Space"){if(this.state==="CHEST_REWARD"){this.closeChest();return}if(this.state==="UPGRADE_CONFIRM"){closeUpgradeConfirm();return}const active=document.querySelector("#vsxResetModal.active");if(active)return}return META_HANDLE_BASE.call(this,code)};
addEventListener("blur",()=>{if(VSX.save?.settings?.autoPause&&game.state==="PLAYING")game.togglePause()});

// Optional explicit Continue after normal upgrades. Default is auto-continue for no added friction.
(function(){if(!document.getElementById("vsxUpgradeConfirm")){const m=document.createElement("div");m.id="vsxUpgradeConfirm";m.className="modal";m.innerHTML=`<div class="panel" style="max-width:480px;text-align:center"><h2 id="vsxUpgradeConfirmTitle"></h2><p id="vsxUpgradeConfirmText"></p><button id="vsxUpgradeContinue"></button></div>`;document.body.appendChild(m);document.getElementById("vsxUpgradeContinue").onclick=closeUpgradeConfirm}})();
function closeUpgradeConfirm(){document.getElementById("vsxUpgradeConfirm")?.classList.remove("active");if(game.state==="UPGRADE_CONFIRM"){game.state="PLAYING";game.input.clear();if(game.pendingLevels>0)setTimeout(()=>{if(game.state==="PLAYING")game.openLevelUp()},0)}}
const META_CHOOSE_UPGRADE_BASE=Game.prototype.chooseUpgrade;
Game.prototype.chooseUpgrade=function(i){const c=this.currentChoices?.[i],needs=c&&["weaponLevel","passive"].includes(c.type)&&!VSX.save.settings.autoContinue,hadPending=this.pendingLevels;META_CHOOSE_UPGRADE_BASE.call(this,i);if(needs&&hadPending===1&&this.state==="PLAYING"){this.state="UPGRADE_CONFIRM";const m=document.getElementById("vsxUpgradeConfirm");document.getElementById("vsxUpgradeConfirmTitle").textContent=VSX.lang==="vi"?"NÂNG CẤP HOÀN TẤT":"UPGRADE COMPLETE";document.getElementById("vsxUpgradeConfirmText").textContent=c.name;document.getElementById("vsxUpgradeContinue").textContent=t("continueHotkey");m.classList.add("active")}};

// ---------- Settings effects ----------
const META_SHAKE_BASE=Game.prototype.shake;
Game.prototype.shake=function(a,t0){const s=VSX.save?.settings||{};const motion=s.reduceMotion?0:1,scaled=a*(s.screenShake??1)*(window.VSX_SETTINGS_V5?.shakeScale?.(a)??1)*motion;window.VSX_SETTINGS_V5?.maybeHitStop?.(a);return META_SHAKE_BASE.call(this,scaled,t0)};
const META_SPARK_BASE=Game.prototype.spark;
Game.prototype.spark=function(x,y,color,n){const s=VSX.save?.settings||{},p=s.particleDensity,q=s.effectsQuality||"high",pm=p==="high"?1:p==="low"?.38:.68,qm=q==="high"?1:q==="medium"?.72:.48,dm=s.dynamicFxReduction&&Number(this.fps||60)<48?.58:1,base=Math.max(1,Math.round(n*pm*qm*dm)),count=window.VSX_SETTINGS_V5?.sparkCount?.(base)??base;return META_SPARK_BASE.call(this,x,y,color,count)};
const META_FLOAT_RENDER_BASE=FloatingText.prototype.render;
FloatingText.prototype.render=function(g){const mode=VSX.save.settings.damageNumbers||"full",numeric=/^[+-]?\d/.test(String(this.text));if(mode==="off"&&numeric)return;if(mode==="crit"&&numeric&&!String(this.text).includes("!"))return;if(mode==="reduced"&&numeric&&((Math.abs(Math.floor(this.x+this.y))%2)===0))return;return META_FLOAT_RENDER_BASE.call(this,g)};
const META_PLAYER_RENDER_BASE=Player.prototype.render;
Player.prototype.render=function(g){META_PLAYER_RENDER_BASE.call(this,g);const skin=SKIN_DEFINITIONS[VSX.save.loadout.skin||"default"]||SKIN_DEFINITIONS.default;g.save();g.strokeStyle=skin.color;g.lineWidth=2.5;g.globalAlpha=.8;g.shadowBlur=12;g.shadowColor=skin.color;g.beginPath();g.arc(this.x,this.y,this.radius+3,0,Math.PI*2);g.stroke();g.restore()};

// ---------- Final HUD ----------
const META_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force=false){const r=META_HUD_BASE.call(this,force);if(!this.player)return r;const wh=document.getElementById("vsxWaveHud");if(wh)wh.textContent=`${t("wave")} ${this.wave||1}`;const label=document.getElementById("vsxBoostLabel"),txt=document.getElementById("vsxBoostText"),btn=document.getElementById("vsxBoostButton");if(label)label.textContent=t("boost");if(txt)txt.textContent=this.boostActive?`${Math.max(0,this.boostEndWave-this.wave)} ${t("wavesLeft")}`:this.boostUsed?(VSX.lang==="vi"?"ĐÃ DÙNG":"USED"):this.tacticalBoostIds?.length?t("boostReady"):(VSX.lang==="vi"?"KHÔNG TRANG BỊ":"NOT EQUIPPED");if(btn){btn.textContent=this.boostActive?`${t("boostActive")} · ${Math.max(0,this.boostEndWave-this.wave)} ${t("wavesLeft")}`:t("boostReady");btn.disabled=!!this.boostUsed||!this.tacticalBoostIds?.length}return r};

// ---------- Character selection + run prep summary ----------
const META_RENDER_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){META_RENDER_SETUP_BASE();const grid=document.getElementById("vsxCharacterGrid");if(grid){grid.innerHTML="";for(const [id,d] of Object.entries(CHARACTER_DEFINITIONS)){if(!isCharacterUnlocked(id))continue;const el=document.createElement("div");el.className="vsxPick"+(VSX.selectedCharacter===id?" selected":"");el.innerHTML=`<h3>${VSX.esc(d.name[VSX.lang])}</h3><p>${VSX.esc(d.desc[VSX.lang])}</p><p style="margin-top:7px;color:#8fd0ff"><b>${VSX.lang==="vi"?"Vũ khí":"Weapon"}:</b> ${VSX.esc(weaponName(d.weapon))}</p>`;el.onclick=()=>{VSX.selectedCharacter=id;VSX.renderSetup()};grid.appendChild(el)}if(!isCharacterUnlocked(VSX.selectedCharacter))VSX.selectedCharacter="striker"}renderRunPrepSummary()};

// Include hired Contract Ally in the Ally Network HUD.
const META_ALLY_HUD_BASE=renderStoryAllyHud;
renderStoryAllyHud=function(g){META_ALLY_HUD_BASE(g);const el=document.getElementById("vsxAllyHud"),a=g.contractAlly;if(!el||!a||a.leave)return;const head=el.querySelector(".vsxAllyHead span");if(head)head.textContent=`${t("squadCount")} ${g.countActiveAllies()}`;const card=document.createElement("div");card.className="vsxAllyCard";card.innerHTML=`<span class="vsxAllyIcon" style="background:${a.def.color};color:#07111d">${VSX.esc(a.id.slice(0,2).toUpperCase())}</span><div><div class="vsxAllyName">${VSX.esc(a.def.name[VSX.lang])}</div><div class="vsxAllyBar"><i style="width:${a.dead?0:100*clamp(a.hp/a.maxHp,0,1)}%"></i></div></div><span class="vsxAllyState">${a.dead?t("down"):(VSX.lang==="vi"?`ĐẾN ĐỢT ${CONTRACT_LAST_WAVE}`:`UNTIL W${CONTRACT_LAST_WAVE}`)}</span>`;const obj=el.querySelector(".vsxRecruitObjective");if(obj)el.insertBefore(card,obj);else el.appendChild(card)};

// ---------- Language refresh ----------
const META_LANG_BASE=vsxApplyLanguage;
vsxApplyLanguage=function(){const r=META_LANG_BASE();const a=document.getElementById("vsxArmoryBtn"),s=document.getElementById("vsxSettingsBtn");if(a)a.textContent=t("armory");if(s)s.textContent=t("settings");if(document.getElementById("vsxArmoryScreen")?.classList.contains("active"))renderArmory();if(document.getElementById("vsxSettingsScreen")?.classList.contains("active"))renderSettings();if(document.getElementById("vsxUpgradeConfirm")?.classList.contains("active"))document.getElementById("vsxUpgradeContinue").textContent=t("continueHotkey");renderRunPrepSummary();return r};

// ---------- Reset Progress must clear the new meta economy too while keeping settings/language ----------
const META_PROGRESS_RESET_BASE=performProgressReset;
performProgressReset=function(){
 const lang=VSX.lang,settings={...defaultMetaSettings(),...(VSX.save.settings||{})};
 // Full account-progression wipe. Keep only language + Settings/QoL preferences.
 VSX.save={
  version:VSX_VERSION,language:lang,
  records:{easy:vsxDefaultRecord(),normal:vsxDefaultRecord(),hard:vsxDefaultRecord(),nightmare:vsxDefaultRecord()},
  achievements:{},codex:freshCodex(),trialRecords:{},settings,
  wallet:{score:0,kills:0,lifetimeScore:0,lifetimeKills:0},
  meta:{upgrades:{},rerollCapacity:0,rerollQuality:0,unlockedWeapons:{},unlockedPassives:{},unlockedCharacters:{},contractLicenses:{},boostInventory:{},skins:{default:true}},
  loadout:{boosts:[],contract:null,weaponDisabled:{},passiveDisabled:{},favoriteWeapons:[],favoritePassives:[],skin:"default"}
 };
 // Prevent old records from migrating back after a wipe, then rebuild only default/free Armory state.
 try{localStorage.removeItem("voidSurvivorRecords");localStorage.removeItem(VSX_SAVE_KEY)}catch(e){}
 ensureArmorySave();
 vsxSave();
 // Reset non-persistent Shop UI state as well.
 ARMORY_TAB="progression";SETTINGS_TAB="gameplay";ARSENAL_TYPE="weapon";ARSENAL_QUERY="";
 VSX.selectedCharacter="striker";VSX.selectedDifficulty="normal";
 game.records=VSX.save.records.normal;game.renderRecords();VSX.renderSetup();renderRunPrepSummary();
 if(document.getElementById("vsxCollectionScreen")?.classList.contains("active"))VSX.showCollection();
 if(document.getElementById("vsxArmoryScreen")?.classList.contains("active"))renderArmory();
 VSX.announce(t("resetProgress"),VSX.lang==="vi"?"ĐÃ XÓA TIẾN ĐỘ + TOÀN BỘ DỮ LIỆU SHOP":"PROGRESS + ALL SHOP DATA CLEARED","#ff6d7f")
};

// Final record selector now supports Easy.
const META_RENDER_RECORDS_BASE=Game.prototype.renderRecords;
Game.prototype.renderRecords=function(){this.records=VSX.save.records?.[this.difficultyMode||VSX.selectedDifficulty||"normal"]||vsxDefaultRecord();return META_RENDER_RECORDS_BASE.call(this)};

// Show earned currencies on Game Over after saveRecords payout.
const META_END_BASE=Game.prototype.endGame;
Game.prototype.endGame=function(){const r=META_END_BASE.call(this);if(this._lastCurrency){const e=document.getElementById("gameOverStats");if(e)e.innerHTML+=`<br><br><b>${t("currencyEarned")}</b><br>${t("spendScore")}: +${this._lastCurrency.score} · ${t("spendKills")}: +${this._lastCurrency.kills}`};return r};


// Final enemy creation path: difficulty can reduce Elite frequency as well as increase it.
SpawnManager.prototype.spawnOne=function(forceElite=false){
 const unlocked=Object.entries(ENEMY_DEFINITIONS).filter(([,d])=>!d.special&&game.time>=d.minimumTime&&d.spawnWeight>0);if(!unlocked.length)return;let total=0;for(const [,d] of unlocked)total+=d.spawnWeight;let rr=Math.random()*total,type=unlocked[0][0];for(const [id,d] of unlocked){rr-=d.spawnWeight;if(rr<=0){type=id;break}}const a=Math.random()*Math.PI*2,rad=Math.hypot(innerWidth,innerHeight)*.58+rand(180,80),x=game.player.x+Math.cos(a)*rad,y=game.player.y+Math.sin(a)*rad,mode=DIFFICULTY_DEFINITIONS[game.difficultyMode||"normal"],fortune=game.player.passiveLevel("fortune_bold");let chance=(GAME_CONFIG.eliteBaseChance+game.time/14000+game.player.luck*.002)*(1+.45*fortune)*(mode.elite??1);if(game.worldEvent?.id==="elite_invasion")chance=Math.max(chance,.32);let elite=null;if(forceElite||Math.random()<chance)elite=pick(["Swift","Giant","Regenerating","Explosive","Shielded","Frenzied"]);const e=vsxApplyDifficulty(new Enemy(type,x,y,game.difficulty,elite));if(game.worldEvent?.id==="golden_rush"&&Math.random()<.32){e.golden=true;e.xp=Math.round(e.xp*2.2)}game.enemies.push(e)
};

// Keep difficulty order intuitive: Easy -> Normal -> Hard -> Nightmare.
const META_RENDER_SETUP_ORDER_BASE=VSX.renderSetup;
VSX.renderSetup=function(){META_RENDER_SETUP_ORDER_BASE();const dg=document.getElementById("vsxDifficulty");if(dg){dg.innerHTML="";for(const id of ["easy","normal","hard","nightmare"]){const d=DIFFICULTY_DEFINITIONS[id];if(!d)continue;const b=document.createElement("button");b.className=VSX.selectedDifficulty===id?"selected":"";b.textContent=d.name[VSX.lang];b.onclick=()=>{VSX.selectedDifficulty=id;VSX.renderSetup()};dg.appendChild(b)}}renderRunPrepSummary()};

applyMetaSettings();VSX.renderSetup();game.renderRecords();
