(function(){
"use strict";
const L=(en,vi)=>VSX.lang==="vi"?vi:en;
function closeAdminSafe(){if(window.VSX_ADMIN?.closePanel){window.VSX_ADMIN.closePanel();return true}if(window.VSX_ADMIN)window.VSX_ADMIN.open=false;document.getElementById("vsxAdminScreen")?.classList.remove("active");if(game?.state==="ADMIN")game.state=game.player?"PLAYING":"TITLE";game?.input?.clear?.();return true}
const MINI_DEFS=window.VSX_MINIGAME_DEFINITIONS ||= {
 void_pinball:{name:{en:"VOID PINBALL",vi:"PINBALL HƯ KHÔNG"},desc:{en:"Keep the core on the funnel table and chain bumper hits.",vi:"Giữ lõi trên bàn phễu và nối chuỗi va bumper."},duration:20,reward:{en:"XP · Chest · Weapon level · Mutation by score",vi:"XP · Rương · Cấp vũ khí · Đột biến theo điểm"}},
 weapon_forge:{name:{en:"WEAPON FORGE",vi:"LÒ RÈN VŨ KHÍ"},desc:{en:"Strike three timing windows; precision determines the upgrade.",vi:"Canh ba nhịp rèn; độ chính xác quyết định phần nâng cấp."},duration:16,reward:{en:"Weapon level or Mutation",vi:"Cấp vũ khí hoặc Đột biến"}},
 slot_machine_doom:{name:{en:"SLOT MACHINE OF DOOM",vi:"MÁY QUAY TẬN THẾ"},desc:{en:"Stop three reels and lock in a chaotic payout.",vi:"Dừng ba guồng quay và chốt một phần thưởng hỗn loạn."},duration:12,reward:{en:"Chest · Weapon · Passive · Boost",vi:"Rương · Vũ khí · Nội tại · Tăng cường"}},
 rift_runner:{name:{en:"RIFT RUNNER",vi:"KẺ CHẠY KHE NỨT"},desc:{en:"Race through a collapsing Void tunnel, dodge gates and collect five Rift Shards.",vi:"Chạy xuyên đường hầm Hư Không sụp đổ, né cổng và gom 5 Mảnh Khe Nứt."},duration:26,reward:{en:"XP + chest for 5 shards; flawless run adds a weapon level",vi:"XP + rương khi đủ 5 mảnh; hoàn hảo thêm 1 cấp vũ khí"}},
 gravity_vault:{name:{en:"GRAVITY VAULT",vi:"KHO TRỌNG LỰC"},desc:{en:"Tilt the vault with WASD and roll the core through three checkpoints without falling into Void holes.",vi:"Nghiêng kho bằng WASD, lăn lõi qua 3 checkpoint mà không rơi vào lỗ Hư Không."},duration:30,reward:{en:"XP · Passive level · flawless chest",vi:"XP · Cấp Nội tại · rương nếu hoàn hảo"}},
 chrono_lock:{name:{en:"CHRONO LOCK",vi:"KHÓA THỜI GIAN"},desc:{en:"Freeze five rotating rings exactly inside their target windows as the cadence accelerates.",vi:"Khóa 5 vòng quay đúng vùng mục tiêu khi nhịp ngày càng nhanh."},duration:22,reward:{en:"XP · perfect 5/5 grants Mutation/weapon upgrade",vi:"XP · hoàn hảo 5/5 nhận Đột biến/nâng vũ khí"}},
 drone_heist:{name:{en:"DRONE HEIST",vi:"PHI VỤ DRONE"},desc:{en:"Steal three data cores, evade scanning beams and reach extraction.",vi:"Trộm 3 lõi dữ liệu, né tia quét và tới điểm thoát."},duration:32,reward:{en:"XP · chest; zero alarms adds Golden Boost",vi:"XP · rương; không báo động nhận thêm Golden Boost"}},
 void_auction:{name:{en:"VOID AUCTION",vi:"ĐẤU GIÁ HƯ KHÔNG"},desc:{en:"Open ONE sealed lot each round with 1/2/3. A SAFE lot raises your Bank; a CORRUPTION lot loses the whole Bank. After any SAFE lot, press E to cash out immediately or risk the next round.",vi:"Mỗi vòng mở MỘT lô bằng 1/2/3. LÔ AN TOÀN tăng Ngân Quỹ; LÔ THA HÓA làm mất toàn bộ Ngân Quỹ. Sau bất kỳ lô an toàn nào, nhấn E để chốt ngay hoặc liều sang vòng tiếp theo."},duration:28,reward:{en:"Cash-out multiplier x1–x5; Corruption loses the current Bank",vi:"Hệ số chốt thưởng x1–x5; Tha Hóa làm mất Ngân Quỹ hiện tại"}}
,
 shadow_replay:{name:{en:"SHADOW REPLAY",vi:"BÓNG MA LẶP LẠI"},desc:{en:"Every four seconds, a shadow replays your exact movement path. Survive the routes you create yourself.",vi:"Cứ mỗi bốn giây, một bóng ma phát lại chính xác đường di chuyển của bạn. Hãy sống sót giữa những tuyến do chính mình tạo ra."},duration:24,reward:{en:"XP · Perfect clear adds a chest/weapon upgrade",vi:"XP · Hoàn hảo nhận thêm rương/nâng vũ khí"}},
 void_pinball_gate:{name:{en:"VOID PINBALL // GATE CIRCUIT",vi:"PINBALL HƯ KHÔNG // MẠCH CỔNG"},desc:{en:"You are the moving bumper. Knock the ball through Void Gates and destroy all ten Core Targets.",vi:"Bạn chính là bumper di động. Hất bóng xuyên Cổng Hư Không và phá đủ mười Core Target."},duration:26,reward:{en:"XP by targets · full clear chest · Perfect adds weapon level",vi:"XP theo mục tiêu · phá đủ nhận rương · Hoàn hảo thêm cấp vũ khí"}},
 core_heist:{name:{en:"CORE HEIST // LOCKDOWN",vi:"ĐỘT KÍCH LÕI // PHONG TỎA"},desc:{en:"Steal one, two or three anomaly cores, then decide when to extract. More cores mean stronger hazards and larger payout.",vi:"Trộm một, hai hoặc ba lõi dị thường rồi tự quyết định lúc rút lui. Càng tham nhiều lõi, hazard càng mạnh và thưởng càng lớn."},duration:30,reward:{en:"Risk payout x1 / x2 / x4 · Perfect 3-core clear upgrades gear",vi:"Thưởng rủi ro x1 / x2 / x4 · Hoàn hảo 3 lõi nâng trang bị"}},
 phase_chaser:{name:{en:"PHASE CHASER",vi:"TRUY ĐUỔI PHA"},desc:{en:"Chase a collapsing checkpoint signal through a portal route before your link strength reaches zero.",vi:"Đuổi theo chuỗi checkpoint đang tan rã qua tuyến cổng trước khi tín hiệu kết nối tụt về 0."},duration:28,reward:{en:"XP · flawless route grants chest + weapon level",vi:"XP · tuyến hoàn hảo nhận rương + cấp vũ khí"}}

};
const NEW_MINI_IDS=["rift_runner","gravity_vault","chrono_lock","drone_heist","void_auction","shadow_replay","void_pinball_gate","core_heist","phase_chaser"];
const ALL_MINI_IDS=Object.keys(MINI_DEFS);
const WORLD_NEW={
 moving_eye:{name:{en:"THE MOVING EYE",vi:"CON MẮT DI ĐỘNG"},desc:{en:"Stay inside the roaming safe eye while the Void storm punishes the darkness outside.",vi:"Bám theo vùng an toàn đang di chuyển; bão Hư Không trừng phạt khu vực bên ngoài."},duration:34,color:"#79e5ff",icon:"E",reward:{en:"XP + chest for disciplined positioning",vi:"XP + rương nếu giữ vị trí tốt"}},
 collapsing_grid:{name:{en:"COLLAPSING GRID",vi:"LƯỚI SỤP ĐỔ"},desc:{en:"Arena tiles warn, collapse, recover and reshuffle around the fight.",vi:"Các ô chiến trường cảnh báo, sụp, hồi phục rồi xáo lại quanh giao tranh."},duration:32,color:"#ff7d91",icon:"G",reward:{en:"XP; flawless clear grants Golden Boost",vi:"XP; không trúng ô sụp nhận Golden Boost"}},
 crown_hunt:{name:{en:"CROWN HUNT",vi:"SĂN VƯƠNG MIỆN"},desc:{en:"A Crown marks a dangerous enemy on the Tactical Minimap. The marked target actively closes on you; break five crowns before time expires.",vi:"Vương Miện đánh dấu một địch nguy hiểm trên Tactical Minimap. Mục tiêu bị đánh dấu sẽ chủ động tiến về phía bạn; phá đủ 5 vương miện trước khi hết giờ."},duration:36,color:"#ffd75e",icon:"K",reward:{en:"Elite chest + bonus XP at five crowns",vi:"Rương Elite + XP khi đủ 5 vương miện"}},
 time_fracture:{name:{en:"TIME FRACTURE",vi:"NỨT GÃY THỜI GIAN"},desc:{en:"Moving Slow and Fast zones distort enemies and projectiles. Position the fight around the clock.",vi:"Vùng Chậm và Nhanh di chuyển làm méo nhịp địch và projectile. Hãy điều khiển giao tranh theo thời gian."},duration:35,color:"#ad88ff",icon:"T",reward:{en:"XP + weapon level for mastering both zones",vi:"XP + cấp vũ khí khi làm chủ cả hai vùng"}},
 blackout_protocol:{name:{en:"BLACKOUT PROTOCOL",vi:"GIAO THỨC MẤT ĐÈN"},desc:{en:"Near-total darkness surrounds the survivor; periodic scan pulses briefly reveal the battlefield.",vi:"Bóng tối gần như phủ kín quanh người chơi; xung quét định kỳ hé lộ chiến trường."},duration:30,color:"#8192c9",icon:"B",reward:{en:"XP + chest for surviving the blackout",vi:"XP + rương khi sống sót qua mất điện"}}
,
 rift_network:{name:{en:"RIFT NETWORK",vi:"MẠNG KHE NỨT"},desc:{en:"Four Void Gates remap the battlefield. Players, normal enemies and projectiles preserve momentum through the network.",vi:"Bốn Cổng Hư Không tái cấu trúc chiến trường. Người chơi, quái thường và projectile giữ động lượng khi xuyên qua mạng cổng."},duration:30,color:"#73dcff",icon:"R",reward:{en:"XP · chest for mastering repeated player teleports",vi:"XP · rương nếu tận dụng cổng nhiều lần hiệu quả"}},
 echo_war:{name:{en:"ECHO WAR",vi:"CHIẾN TUYẾN VỌNG ÂM"},desc:{en:"Player and hostile projectiles return as delayed weaker echoes. Read the second wave instead of treating shots as finished.",vi:"Projectile của người chơi và kẻ địch quay lại dưới dạng vọng ảnh yếu hơn sau một nhịp trễ. Mỗi làn đạn đều có đợt thứ hai."},duration:26,color:"#9bd9ff",icon:"E",reward:{en:"XP · chest for surviving a dense echo field",vi:"XP · rương khi sống sót qua chiến trường vọng âm"}},
 gold_rush:{name:{en:"GOLD RUSH",vi:"CƠN SỐT VÀNG"},desc:{en:"Hunt Golden Drones to raise Bounty and Threat, then step into Cash Out before greed turns the field against you.",vi:"Săn Golden Drone để tăng Bounty lẫn Threat, rồi bước vào vùng Cash Out trước khi lòng tham khiến chiến trường vượt kiểm soát."},duration:30,color:"#ffd45f",icon:"$",reward:{en:"Escalating XP/loot up to Bounty x5",vi:"XP/loot tăng dần tới Bounty x5"}},
 black_hole_tide:{name:{en:"BLACK HOLE TIDE",vi:"THỦY TRIỀU HỐ ĐEN"},desc:{en:"A roaming gravity core bends enemies, projectiles and loot. Use the pull for clustering but stay clear of the center.",vi:"Một lõi trọng lực di động bẻ quỹ đạo quái, projectile và loot. Tận dụng lực hút để gom cụm nhưng tránh xa tâm."},duration:30,color:"#9b7cff",icon:"O",reward:{en:"XP · magnet/loot bonus for surviving without core contact",vi:"XP · thưởng hút/loot nếu sống sót mà không chạm vùng lõi"}}

};
Object.assign(WORLD_EVENT_DEFINITIONS,WORLD_NEW);
const NEW_WORLD_IDS=Object.keys(WORLD_NEW);

VSX.save.codex ||= {};VSX.save.codex.minigames ||= {};VSX.save.codex.world_events ||= {};VSX.save.meta ||= {};VSX.save.meta.eventStats ||= {minigamesCompleted:0,worldEventsCompleted:0};VSX.save.meta.eventStats.perfectMinigames ||= {};VSX.save.meta.eventStats.worldEventBest ||= {};vsxSave();

/* Local reward helpers: intentionally self-contained so the separated systems do not depend on closure-private helpers from older event packs. */
function eventChest(x=game.player.x+36,y=game.player.y){game.chests.push(new Chest(x,y))}
function addPassiveLevel(id){const p=game.player,d=PASSIVE_DEFINITIONS[id];if(!p||!d)return false;const lv=p.passiveLevel(id);if(lv>=d.maxLevel)return false;if(lv===0&&p.passives.size>=p.passiveSlots)return false;p.passives.set(id,lv+1);p.recalc();vsxDiscover("passives",id);return true}
function rewardWeaponLevel(){const p=game.player;if(!p)return false;const pool=p.weapons.filter(w=>!w.def.rewardOnly&&w.level<5);if(pool.length){pick(pool).level++;return true}const ids=Object.keys(WEAPON_DEFINITIONS).filter(id=>!WEAPON_DEFINITIONS[id].rewardOnly&&!p.weapons.some(w=>w.id===id));if(ids.length&&p.weapons.length<p.weaponSlots){p.addWeapon(pick(ids));return true}p.gainXP(45);return false}
function rewardMutation(){const p=game.player;if(!p)return false;const pool=p.weapons.filter(w=>w.level>=5&&!w.mutationId&&!w.def.rewardOnly&&!w.def.legendaryRelic&&(WEAPON_MUTATIONS[w.id]||[]).length);if(!pool.length)return rewardWeaponLevel();const w=pick(pool),m=pick(WEAPON_MUTATIONS[w.id]);w.mutationId=m.id;vsxDiscover("mutations",m.id);return true}

Object.assign(ACHIEVEMENT_DEFINITIONS,{
 riftwalker:{name:{en:"RIFTWALKER",vi:"LỮ KHÁCH KHE NỨT"},desc:{en:"Clear Rift Runner with all three integrity points intact.",vi:"Hoàn thành Rift Runner mà còn đủ cả 3 điểm toàn vẹn."}},
 gravity_favorite:{name:{en:"GRAVITY'S FAVORITE",vi:"CON CƯNG TRỌNG LỰC"},desc:{en:"Clear Gravity Vault without falling into a Void hole.",vi:"Hoàn thành Gravity Vault mà không rơi vào lỗ Hư Không."}},
 clockwork_perfect:{name:{en:"CLOCKWORK PERFECT",vi:"NHỊP MÁY HOÀN HẢO"},desc:{en:"Lock all five Chrono rings without a miss.",vi:"Khóa đủ 5 vòng Chrono mà không trượt lần nào."}},
 ghost_in_machine:{name:{en:"GHOST IN THE MACHINE",vi:"BÓNG MA TRONG MÁY"},desc:{en:"Finish Drone Heist with three cores and zero alarms.",vi:"Hoàn thành Drone Heist với 3 lõi và 0 lần báo động."}},
 house_edge:{name:{en:"THE HOUSE HAS NO EDGE",vi:"NHÀ CÁI KHÔNG CÓ CỬA"},desc:{en:"Cash out Void Auction at payout x5.",vi:"Chốt Void Auction ở mức thưởng x5."}},
 variety_hour:{name:{en:"VARIETY HOUR",vi:"GIỜ ĐỔI GIÓ"},desc:{en:"Complete five different Minigames in one run.",vi:"Hoàn thành 5 Minigame khác nhau trong một trận."}},
 eye_storm:{name:{en:"EYE OF THE STORM",vi:"MẮT BÃO"},desc:{en:"Clear The Moving Eye while spending under two seconds outside safety.",vi:"Hoàn thành The Moving Eye với dưới 2 giây ở ngoài vùng an toàn."}},
 floor_is_void:{name:{en:"THE FLOOR IS VOID",vi:"SÀN LÀ HƯ KHÔNG"},desc:{en:"Clear Collapsing Grid without taking grid damage.",vi:"Hoàn thành Collapsing Grid mà không nhận sát thương từ ô sụp."}},
 crown_breaker:{name:{en:"CROWN BREAKER",vi:"KẺ PHÁ VƯƠNG MIỆN"},desc:{en:"Break all five Crown Hunt targets in one event.",vi:"Phá đủ 5 mục tiêu Vương Miện trong một sự kiện."}},
 time_lord:{name:{en:"TIME LORD",vi:"CHÚA TỂ THỜI GIAN"},desc:{en:"Finish Time Fracture after fighting inside both Slow and Fast zones for at least five seconds each.",vi:"Hoàn thành Time Fracture sau khi giao tranh ít nhất 5 giây trong cả vùng Chậm lẫn Nhanh."}},
 crisis_manager:{name:{en:"CRISIS MANAGER",vi:"QUẢN LÝ KHỦNG HOẢNG"},desc:{en:"Complete any World Event while a major Boss is active.",vi:"Hoàn thành một World Event trong lúc Boss lớn đang hoạt động."}}
});

/* ---------- Collection data ---------- */
const CODEX_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){
 if(cat==="minigames")return ALL_MINI_IDS.map(id=>{const d=MINI_DEFS[id];return[id,d.name[VSX.lang],`${d.desc[VSX.lang]} • ${L("Duration","Thời lượng")}: ${d.duration}s • ${L("Reward","Phần thưởng")}: ${d.reward[VSX.lang]}`]});
 if(cat==="world_events")return Object.entries(WORLD_EVENT_DEFINITIONS).filter(([,d])=>d?.type!=="minigame").map(([id,d])=>[id,d.name?.[VSX.lang]||id,`${d.desc?.[VSX.lang]||L("Battlefield anomaly.","Dị thường chiến trường.")} • ${L("How to play","Cách chơi")}: ${d.how?.[VSX.lang]||d.desc?.[VSX.lang]||"—"} • ${L("Duration","Thời lượng")}: ${d.duration||0}s${d.reward?` • ${L("Reward","Phần thưởng")}: ${d.reward[VSX.lang]}`:""}`]);
 return CODEX_BASE.call(this,cat)
};
function anomalyWorldBestLabel(id,best){
 if(best==null)return "";
 if(id==="rift_network")return `${L("BEST JUMPS","XUYÊN CỔNG TỐT NHẤT")} ${best}`;
 if(id==="echo_war")return `${L("BEST ECHOES","VỌNG ẢNH TỐT NHẤT")} ${best}`;
 if(id==="gold_rush")return `${L("BEST BOUNTY","BOUNTY CAO NHẤT")} ×${Number(best).toFixed(1)}`;
 if(id==="black_hole_tide")return `${L("CLEAN SCORE","ĐIỂM SẠCH")} ${best}/10`;
 return `${L("BEST","KỶ LỤC")} ${best}`
}
const CODEX_RENDER_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){const r=CODEX_RENDER_BASE.call(this,cat);if(cat==="minigames"||cat==="world_events"){const list=document.getElementById("vsxCodexList"),rows=VSX.codexEntries(cat),cards=[...list.querySelectorAll(":scope > .vsxCodexItem")];cards.forEach((card,i)=>{const row=rows[i],id=row?.[0],d=cat==="minigames"?MINI_DEFS[id]:WORLD_EVENT_DEFINITIONS[id];if(!row||!d)return;card.dataset.codexId=id;const meta=document.createElement("div");meta.className="vsxCodexSystemMeta";const perfect=cat==="minigames"&&!!VSX.save.meta?.eventStats?.perfectMinigames?.[id];const best=cat==="world_events"?VSX.save.meta?.eventStats?.worldEventBest?.[id]:null;meta.innerHTML=`<span>${cat==="minigames"?"MINIGAME":"WORLD EVENT"}</span><span class="duration">${L("DURATION","THỜI LƯỢNG")} ${d.duration||0}s</span>${cat==="minigames"?`<span class="${perfect?"perfect":"pending"}">${perfect?L("PERFECT ✓","HOÀN HẢO ✓"):L("PERFECT —","HOÀN HẢO —")}</span>`:""}${cat==="world_events"&&best!=null?`<span>${VSX.esc(anomalyWorldBestLabel(id,best))}</span>`:""}`;card.appendChild(meta)})}queueMicrotask(buildSplitCollectionNav);return r};
function discovered(cat,rows){return Object.keys(VSX.save.codex?.[cat]||{}).filter(id=>rows.some(r=>r[0]===id)).length}
function buildSplitCollectionNav(){
 const tabs=document.getElementById("vsxCodexTabs");if(!tabs)return;const current=window.VSX_COLLECTION_UI?.cat||"weapons";
 const groups=[
  {id:"arsenal",en:"ARSENAL & BUILD",vi:"KHO ĐỒ & BUILD",cats:["weapons","passives","evolutions","mutations","synergies","legendary_relics"]},
  {id:"world",en:"WORLD & CHALLENGES",vi:"THẾ GIỚI & THỬ THÁCH",cats:["enemies","bosses","allies","world_objects","world_events","minigames","trials"]},
  {id:"profile",en:"SURVIVORS & PROGRESS",vi:"NHÂN VẬT & TIẾN ĐỘ",cats:["characters","skins","packages","achievements"]}
 ];
 const labels={world_events:{en:"WORLD EVENTS",vi:"SỰ KIỆN THẾ GIỚI"},minigames:{en:"MINIGAMES",vi:"MINIGAME"},weapons:{en:"WEAPONS",vi:"VŨ KHÍ"},passives:{en:"PASSIVES",vi:"NỘI TẠI"},evolutions:{en:"EVOLUTIONS",vi:"TIẾN HÓA"},mutations:{en:"MUTATIONS",vi:"ĐỘT BIẾN"},synergies:{en:"SYNERGIES",vi:"CỘNG HƯỞNG"},legendary_relics:{en:"RELICS",vi:"DI VẬT"},enemies:{en:"ENEMIES",vi:"KẺ ĐỊCH"},bosses:{en:"BOSSES",vi:"BOSS"},allies:{en:"ALLIES",vi:"ĐỒNG MINH"},world_objects:{en:"WORLD OBJECTS",vi:"VẬT THỂ THẾ GIỚI"},trials:{en:"TRIALS",vi:"THỬ THÁCH"},characters:{en:"CHARACTERS",vi:"NHÂN VẬT"},skins:{en:"SKIN",vi:"TRANG PHỤC"},packages:{en:"PACKAGES",vi:"GÓI NHÂN VẬT"},achievements:{en:"ACHIEVEMENTS",vi:"THÀNH TỰU"}};
 tabs.classList.add("vsxCollectionNavCluster");tabs.innerHTML="";
 for(const group of groups){const wrap=document.createElement("section");wrap.className="vsxCollectionNavGroup";const title=document.createElement("div");title.className="vsxCollectionNavGroupTitle";title.textContent=group[VSX.lang]||group.en;const bs=document.createElement("div");bs.className="vsxCollectionNavGroupButtons";for(const cat of group.cats){const rows=VSX.codexEntries(cat)||[];if(!rows.length)continue;const b=document.createElement("button");b.dataset.codexCat=cat;let got;if(cat==="characters")got=rows.filter(r=>isCharacterUnlocked(r[0])).length;else if(cat==="skins")got=rows.filter(r=>!!VSX.save.meta?.skins?.[r[0]]).length;else if(cat==="packages")got=rows.filter(r=>!!VSX.save.meta?.packages?.[r[0]]).length;else got=discovered(cat,rows);b.textContent=`${labels[cat]?.[VSX.lang]||cat.toUpperCase()} ${got}/${rows.length}`;b.classList.toggle("selected",cat===current);b.onclick=()=>{if(window.VSX_COLLECTION_UI){VSX_COLLECTION_UI.cat=cat;VSX_COLLECTION_UI.query="";VSX_COLLECTION_UI.rarity="all"}const q=document.getElementById("vsxCollectionSearch");if(q)q.value="";VSX.renderCodex(cat)};bs.appendChild(b)}wrap.append(title,bs);tabs.appendChild(wrap)}
}
const SHOW_BASE=VSX.showCollection;VSX.showCollection=function(){const r=SHOW_BASE.apply(this,arguments);queueMicrotask(buildSplitCollectionNav);return r};

/* ---------- Run achievement state ---------- */
function ensureRunStats(g){return g.vsxChallengeStats ||= {miniSet:new Set(),worldSet:new Set(),worldBossStart:false}}
const INIT_BASE=Game.prototype.vsxInitRun;Game.prototype.vsxInitRun=function(){const r=INIT_BASE.apply(this,arguments);this.vsxChallengeStats={miniSet:new Set(),worldSet:new Set(),worldBossStart:false};this.vsxMiniCooldown=75;this.vsxNewWorldRuntime=null;return r};
function award(id){vsxAchievement(id)}
function markMiniComplete(id,data={}){
 const s=ensureRunStats(game);s.miniSet.add(id);VSX.save.meta.eventStats.minigamesCompleted++;vsxDiscover("minigames",id);
 const anomalyIds=new Set(["shadow_replay","void_pinball_gate","core_heist","phase_chaser"]);
 const perfect=(!anomalyIds.has(id)&&!!data.perfect)
  || id==="rift_runner"&&data.integrity>=3
  || id==="gravity_vault"&&(data.falls||0)===0
  || id==="chrono_lock"&&(data.locked||0)>=5&&(data.misses||0)===0
  || id==="drone_heist"&&(data.cores||0)>=3&&(data.alarms||0)===0
  || id==="void_auction"&&(data.cashTier||0)>=5
  || id==="shadow_replay"&&(data.hits||0)===0
  || id==="void_pinball_gate"&&(data.broken||0)>=10&&(data.lives||0)>=3
  || id==="core_heist"&&(data.cores||0)>=3&&(data.shield||0)>=3
  || id==="phase_chaser"&&(data.misses||0)===0&&(data.signal||0)>=100;
 if(perfect)VSX.save.meta.eventStats.perfectMinigames[id]=true;
 if(s.miniSet.size>=5)award("variety_hour");
 if(id==="rift_runner"&&data.integrity>=3)award("riftwalker");
 if(id==="gravity_vault"&&(data.falls||0)===0)award("gravity_favorite");
 if(id==="chrono_lock"&&(data.locked||0)>=5&&(data.misses||0)===0)award("clockwork_perfect");
 if(id==="drone_heist"&&(data.cores||0)>=3&&(data.alarms||0)===0)award("ghost_in_machine");
 if(id==="void_auction"&&(data.cashTier||0)>=5)award("house_edge");
 vsxSave()
}

/* ---------- Standalone Minigame engine: legacy-separated set + VOID ANOMALY PROTOCOL ---------- */
const SM={active:false,id:null,data:null,last:0,raf:0,keys:new Set(),session:0,timers:new Set(),lastError:null,frameErrors:0,lastObservedTime:null,lastEnd:null,startedAt:0};
function clearMiniTimers(){for(const h of SM.timers)clearTimeout(h);SM.timers.clear()}
function miniDelay(fn,ms){const session=SM.session,id=SM.id;const h=setTimeout(()=>{SM.timers.delete(h);if(SM.active&&SM.session===session&&SM.id===id)fn()},ms);SM.timers.add(h);return h}
function normalizeMiniLaunchState(forced=false){if(VSX_ADMIN?.open)closeAdminSafe();if(forced&&game.state==="PAUSED"){document.getElementById("pauseScreen")?.classList.remove("active");game.state="PLAYING";game.input?.clear?.()}if(forced&&game.state==="ADMIN"&&game.player){game.state="PLAYING";game.input?.clear?.()}return game.state==="PLAYING"}
function miniEls(){const c=document.getElementById("vsxEventMiniCanvas");return{screen:document.getElementById("vsxEventMinigame"),canvas:c,ctx:c?.getContext("2d"),title:document.getElementById("vsxEventMiniTitle"),info:document.getElementById("vsxEventMiniInfo"),controls:document.getElementById("vsxEventMiniControls"),score:document.getElementById("vsxEventMiniScore"),badge:document.querySelector("#vsxEventMinigame .vsxMiniBadge")}}
function ensureMiniTimer(){const h=document.querySelector("#vsxEventMinigame .vsxMiniHeader");if(!h)return null;let t=document.getElementById("vsxStandaloneMiniTimer");if(!t){t=document.createElement("span");t.id="vsxStandaloneMiniTimer";h.appendChild(t)}return t}
function miniSafe(){return !!game.player&&game.state==="PLAYING"&&!game.worldEvent&&!game.vsxPendingEventBriefing&&!game.boss&&!game.miniBoss&&!VSX_TRIAL?.active&&!window.VSX_VOID_RELAY_SERIES?.active&&!document.getElementById("vsxEventBriefing")?.classList.contains("active")&&!document.getElementById("vsxEventMinigame")?.classList.contains("active")&&!document.querySelector(".modal.active,#vsxAdminScreen.active,#vsxCollectionScreen.active,#vsxSetupScreen.active")}
function repairModernMiniSurface(){if(!SM.active)return false;const e=miniEls();if(!e.screen||!e.canvas||!e.ctx||!SM.data)return false;let changed=false;if(game.state!=="VSX_MINIGAME"){game.state="VSX_MINIGAME";game.input?.clear?.();changed=true}if(e.screen.dataset.owner!=="modern"){e.screen.dataset.owner="modern";changed=true}if(e.screen.dataset.system!=="standalone"){e.screen.dataset.system="standalone";changed=true}if(e.screen.dataset.mini!==SM.id){e.screen.dataset.mini=SM.id||"";changed=true}if(!e.screen.classList.contains("active")){e.screen.classList.add("active");changed=true}if(changed)try{window.VSX_RUNTIME_SAFETY?.state?.log?.push?.({ts:Date.now(),level:"WARN",code:"MODERN_MINI_SURFACE_REPAIRED",character:game.characterId||"unknown",detail:SM.id||"unknown"})}catch{}return true}
function initMiniData(id){
 if(id==="rift_runner")return{time:26,integrity:3,shards:0,y:230,vy:0,speed:300,spawn:0,objects:[],distance:0};
 if(id==="gravity_vault")return{time:30,ball:{x:95,y:375,vx:0,vy:0,r:11},checkpoint:0,falls:0,checkpoints:[{x:225,y:330},{x:470,y:145},{x:730,y:330}],holes:[{x:320,y:250,r:34},{x:575,y:300,r:38}],walls:[{x:170,y:205,w:18,h:240},{x:380,y:0,w:18,h:250},{x:380,y:330,w:18,h:130},{x:620,y:185,w:18,h:275}]};
 if(id==="chrono_lock")return{time:22,ring:0,angle:0,target:Math.random()*Math.PI*2,locked:0,misses:0,speed:1.8};
 if(id==="drone_heist")return{time:32,x:90,y:390,cores:0,alarms:0,inv:0,exit:false,coreList:[{x:250,y:120,taken:false},{x:445,y:350,taken:false},{x:680,y:150,taken:false}],lasers:[{phase:0,y:215},{phase:2.2,y:305}]};
 if(id==="shadow_replay")return{time:24,x:430,y:242,r:12,speed:220,gates:apGateSet(),sample:0,segment:4,current:[],shadows:[],hits:0,perfect:true,inv:0};
 if(id==="void_pinball_gate")return{time:26,p:{x:420,y:390,r:17,mx:0,my:0},ball:{x:420,y:165,vx:205,vy:-165,r:9},gates:apGateSet().slice(0,2),targets:[{x:180,y:90,r:18},{x:330,y:95,r:18},{x:510,y:95,r:18},{x:660,y:90,r:18},{x:255,y:195,r:18},{x:420,y:185,r:20},{x:585,y:195,r:18},{x:210,y:285,r:18},{x:420,y:270,r:20},{x:630,y:285,r:18}],broken:0,lives:3,combo:0,perfect:true};
 if(id==="core_heist")return{time:30,x:80,y:400,r:12,gates:apGateSet().slice(0,2),cores:0,cashTier:0,perfect:true,shield:3,inv:0,threat:0,exit:{x:785,y:405},coresList:[{x:250,y:105,taken:false},{x:455,y:345,taken:false},{x:690,y:115,taken:false}],hazards:[{x:310,y:240,rx:70,ry:95,r:24,a:0,sp:1.05},{x:560,y:230,rx:82,ry:72,r:26,a:2.1,sp:-1.18},{x:430,y:180,rx:155,ry:55,r:20,a:4.0,sp:.82}]};
 if(id==="phase_chaser")return{time:28,x:75,y:405,r:12,gates:apGateSet(),signal:100,ttl:2.8,index:0,misses:0,perfect:true,checkpoints:[{x:160,y:385},{x:285,y:330},{x:125,y:120},{x:250,y:90},{x:430,y:120},{x:715,y:340},{x:620,y:300},{x:505,y:360},{x:700,y:105},{x:580,y:105},{x:360,y:150},{x:180,y:260}]};
 return{time:28,round:1,cashTier:0,selected:-1,result:"",trap:(Math.random()*3)|0,ended:false};
}
function startNewMini(id,forced=false){
 if(!NEW_MINI_IDS.includes(id)||!game.player||game.worldEvent)return false;
 if(!normalizeMiniLaunchState(forced))return false;
 if(!forced&&!miniSafe())return false;
 const e=miniEls(),def=MINI_DEFS[id];if(!e.canvas||!e.ctx||!e.screen||!def)return false;
 if(SM.active)endNewMini(false,{silent:true,reason:"superseded-start"});
 clearMiniTimers();SM.session++;SM.lastError=null;SM.frameErrors=0;SM.lastObservedTime=null;SM.lastEnd=null;SM.startedAt=performance.now();SM.active=true;SM.id=id;SM.data=initMiniData(id);SM.last=performance.now();SM.keys.clear();
 game.state="VSX_MINIGAME";game.input.clear();e.screen.dataset.system="standalone";e.screen.dataset.owner="modern";e.screen.dataset.mini=id;e.screen.classList.add("active");
 e.title.textContent=def.name[VSX.lang];e.info.textContent=def.desc[VSX.lang];if(e.badge)e.badge.textContent=L("MINIGAME • BONUS CHALLENGE","MINIGAME • THỬ THÁCH THƯỞNG");if(e.score)e.score.textContent="";
 if(id==="chrono_lock")e.controls.textContent=L("SPACE: LOCK RING","SPACE: KHÓA VÒNG");
 else if(id==="void_auction")e.controls.textContent=L("1 / 2 / 3: OPEN ONE LOT • SAFE = BANK UP • E: CASH OUT WHEN BANK > 0","1 / 2 / 3: MỞ MỘT LÔ • AN TOÀN = TĂNG QUỸ • E: CHỐT KHI QUỸ > 0");
 else if(id==="shadow_replay")e.controls.textContent=L("WASD / ARROWS: MOVE • YOUR PATH RETURNS EVERY 4s","WASD / MŨI TÊN: DI CHUYỂN • ĐƯỜNG ĐI LẶP LẠI MỖI 4s");
 else if(id==="void_pinball_gate")e.controls.textContent=L("WASD / ARROWS: MOVE THE BUMPER • USE VOID GATES","WASD / MŨI TÊN: ĐIỀU KHIỂN BUMPER • DÙNG CỔNG HƯ KHÔNG");
 else if(id==="core_heist")e.controls.textContent=L("WASD / ARROWS: STEAL CORES • ENTER EXIT TO CASH OUT","WASD / MŨI TÊN: TRỘM LÕI • VÀO EXIT ĐỂ RÚT LUI");
 else if(id==="phase_chaser")e.controls.textContent=L("WASD / ARROWS: CHASE THE NEXT SIGNAL • GATES PRESERVE ROUTE","WASD / MŨI TÊN: ĐUỔI TÍN HIỆU KẾ TIẾP • CỔNG GIỮ TUYẾN");
 else e.controls.textContent=L("WASD / ARROWS: CONTROL","WASD / PHÍM MŨI TÊN: ĐIỀU KHIỂN");
 vsxDiscover("minigames",id);const mt=ensureMiniTimer();if(mt)mt.textContent=`${Math.max(0,SM.data.time||def.duration||0).toFixed(1)}s`;
 cancelAnimationFrame(SM.raf);SM.raf=requestAnimationFrame(newMiniFrame);return true
}
function miniReward(id,d,success){
 if(!success)return;
 if(id==="rift_runner"){game.player.gainXP(30+d.shards*14);if(d.shards>=5)eventChest();if(d.integrity>=3&&d.shards>=5)rewardWeaponLevel()}
 else if(id==="gravity_vault"){game.player.gainXP(55);if(!addPassiveLevel(pick(Object.keys(PASSIVE_DEFINITIONS))))eventChest();if(d.falls===0)eventChest()}
 else if(id==="chrono_lock"){game.player.gainXP(18*d.locked);if(d.locked>=5){if(d.misses===0)rewardMutation();else rewardWeaponLevel()}}
 else if(id==="drone_heist"){game.player.gainXP(30+d.cores*20);if(d.cores>=3)eventChest();if(d.cores>=3&&d.alarms===0)game.pickups.push(new Pickup(game.player.x-28,game.player.y,"golden_boost"))}
 else if(id==="void_auction"){const tier=d.cashTier||0;game.player.gainXP(24*tier);if(tier>=3)eventChest();if(tier>=5)rewardMutation()}
 else if(id==="shadow_replay"){game.player.gainXP(70);if(d.perfect){eventChest();rewardWeaponLevel()}}
 else if(id==="void_pinball_gate"){game.player.gainXP(12*(d.broken||0)+20);if((d.broken||0)>=10)eventChest();if(d.perfect&&(d.broken||0)>=10)rewardWeaponLevel()}
 else if(id==="core_heist"){const tier=d.cashTier||0;game.player.gainXP(35*Math.max(1,tier));if(tier>=2)eventChest();if(tier>=4&&d.perfect)rewardWeaponLevel();else if(tier>=4)game.pickups.push(new Pickup(game.player.x-28,game.player.y,"golden_boost"))}
 else if(id==="phase_chaser"){game.player.gainXP(80);eventChest();if(d.perfect)rewardWeaponLevel()}
}
function endNewMini(success=true,opts={}){if(!SM.active)return false;const id=SM.id,d=SM.data,e=miniEls(),owns=e.screen?.dataset.owner==="modern";SM.lastEnd={id,success:!!success,reason:opts.reason||"normal",session:SM.session,at:performance.now(),elapsed:Math.max(0,performance.now()-(SM.startedAt||performance.now())),remaining:Number(d?.time)||0};SM.active=false;SM.session++;cancelAnimationFrame(SM.raf);SM.raf=0;clearMiniTimers();SM.keys.clear();if(owns)e.screen?.classList.remove("active");if(e.screen&&owns){e.screen.dataset.system="";e.screen.dataset.owner=""}if(game.state==="VSX_MINIGAME")game.state="PLAYING";game.input.clear();game.vsxMiniCooldown=rand(135,95);SM.id=null;SM.data=null;if(!opts.silent){try{miniReward(id,d,success);if(success)markMiniComplete(id,d)}catch(err){SM.lastError=String(err?.stack||err);console.error("[MINIGAME REWARD RECOVERY]",id,err)}}game.updateHUD?.(true);setTimeout(()=>{if(game.state==="PLAYING"){if(game.rewardQueue?.length)game.processMeta?.();else if(game.pendingLevels>0)game.openLevelUp?.()}},0);return true}
function bg(c,x){x.fillStyle="#06101d";x.fillRect(0,0,c.width,c.height);x.strokeStyle="rgba(92,195,244,.07)";for(let i=20;i<c.width;i+=40){x.beginPath();x.moveTo(i,0);x.lineTo(i,c.height);x.stroke()}for(let y=20;y<c.height;y+=40){x.beginPath();x.moveTo(0,y);x.lineTo(c.width,y);x.stroke()}}

function apGate(x,y,label,to,angle=0,color="#75dcff"){return{x,y,label,to,angle,color,r:22,pulse:Math.random()*6.28}}
function apGateSet(){return[
 apGate(125,120,"A",1,0,"#75dcff"),
 apGate(715,340,"B",0,Math.PI,"#b58cff"),
 apGate(700,105,"C",3,Math.PI/2,"#75dcff"),
 apGate(140,350,"D",2,-Math.PI/2,"#b58cff")
]}
function apDrawGate(x,g){g.save();g.translate(x.x,x.y);g.rotate((performance.now()/1000)*.45+x.pulse);g.globalAlpha=.92;g.shadowBlur=15;g.shadowColor=x.color;g.strokeStyle=x.color;g.lineWidth=3;g.beginPath();g.arc(0,0,x.r,0,Math.PI*2);g.stroke();g.globalAlpha=.45;g.lineWidth=1.5;g.beginPath();g.arc(0,0,x.r+6,.2,2.15);g.stroke();g.beginPath();g.arc(0,0,x.r+6,3.35,5.75);g.stroke();g.rotate(-(performance.now()/1000)*.85);g.fillStyle="#eaf8ff";g.font="900 9px Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(x.label,0,1);g.restore()}
function apDrawMiniGates(gates,g){for(const q of gates||[])apDrawGate(q,g)}
function apTeleportMini(ent,gates,dt,opt={}){if(!ent||!gates?.length)return false;ent._gateLock=Math.max(0,(ent._gateLock||0)-dt);if(ent._gateLock>0)return false;for(let i=0;i<gates.length;i++){const a=gates[i];if(Math.hypot(ent.x-a.x,ent.y-a.y)>(a.r+(ent.r||10)))continue;const b=gates[a.to];if(!b)continue;const rot=(b.angle||0)-(a.angle||0);const c=Math.cos(rot),s=Math.sin(rot);if(Number.isFinite(ent.vx)&&Number.isFinite(ent.vy)){const vx=ent.vx,vy=ent.vy;ent.vx=vx*c-vy*s;ent.vy=vx*s+vy*c}ent.x=b.x+Math.cos(b.angle||0)*(b.r+(ent.r||10)+7);ent.y=b.y+Math.sin(b.angle||0)*(b.r+(ent.r||10)+7);ent._gateLock=.34;ent._gateHops=(ent._gateHops||0)+1;if(typeof opt.onTeleport==="function")opt.onTeleport(a,b,ent);return true}return false}
function apMiniMove(d,dt,speed){let dx=0,dy=0;if(SM.keys.has("KeyW")||SM.keys.has("ArrowUp"))dy--;if(SM.keys.has("KeyS")||SM.keys.has("ArrowDown"))dy++;if(SM.keys.has("KeyA")||SM.keys.has("ArrowLeft"))dx--;if(SM.keys.has("KeyD")||SM.keys.has("ArrowRight"))dx++;if(dx||dy){const n=normalize(dx,dy);d.x=clamp(d.x+n.x*speed*dt,18,822);d.y=clamp(d.y+n.y*speed*dt,18,442);d._moveX=n.x;d._moveY=n.y}else{d._moveX=0;d._moveY=0}}
function apPerfectText(ok){return ok?L("PERFECT ✓","HOÀN HẢO ✓"):L("PERFECT ×","HOÀN HẢO ×")}
function apDrawFootball(g,x,y,r=9){g.save();g.translate(x,y);g.shadowBlur=10;g.shadowColor="#facc15";g.fillStyle="#f7f7f7";g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.fill();g.strokeStyle="#242424";g.lineWidth=1.2;g.beginPath();g.arc(0,0,r*.38,0,Math.PI*2);g.stroke();for(let k=0;k<5;k++){const a=k*Math.PI*2/5;g.beginPath();g.moveTo(Math.cos(a)*r*.38,Math.sin(a)*r*.38);g.lineTo(Math.cos(a)*r*.85,Math.sin(a)*r*.85);g.stroke()}g.restore()}
function updateShadowReplay(dt,c,x,d){
 apMiniMove(d,dt,d.speed);apTeleportMini(d,d.gates,dt);
 d.inv=Math.max(0,d.inv-dt);d.sample-=dt;d.segment-=dt;
 if(d.sample<=0){d.sample=.085;d.current.push({x:d.x,y:d.y});if(d.current.length>52)d.current.shift()}
 if(d.segment<=0){d.segment=4;if(d.current.length>6){d.shadows.push({points:d.current.slice(),age:0});if(d.shadows.length>5)d.shadows.shift()}d.current=[]}
 x.save();for(const sh of d.shadows){sh.age+=dt;const pts=sh.points||[];if(!pts.length)continue;const idx=Math.floor(((sh.age%4)/4)*pts.length)%pts.length,q=pts[idx];sh.x=q.x;sh.y=q.y;x.globalAlpha=.18;x.strokeStyle="#ff6f9e";x.lineWidth=2;x.beginPath();let moved=false;for(let i=0;i<pts.length;i++){if(i&&Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y)>120){moved=false;continue}if(!moved){x.moveTo(pts[i].x,pts[i].y);moved=true}else x.lineTo(pts[i].x,pts[i].y)}x.stroke();x.globalAlpha=.82;x.fillStyle="#ff77aa";x.shadowBlur=12;x.shadowColor="#ff4f94";x.beginPath();x.arc(sh.x,sh.y,11,0,Math.PI*2);x.fill();if(d.inv<=0&&Math.hypot(d.x-sh.x,d.y-sh.y)<23){d.hits++;d.perfect=false;d.inv=.75}}
 x.restore();apDrawMiniGates(d.gates,x);x.fillStyle=d.inv>0?"#ff9fbf":"#72eaff";x.shadowBlur=12;x.shadowColor="#72eaff";x.beginPath();x.arc(d.x,d.y,12,0,Math.PI*2);x.fill();x.shadowBlur=0;
 miniEls().score.textContent=`${L("SHADOWS","BÓNG")} ${d.shadows.length}/5 • ${L("HITS","TRÚNG")} ${d.hits} • ${apPerfectText(d.perfect)}`
}
function updateGatePinball(dt,c,x,d){
 const p=d.p,b=d.ball;const oldx=p.x,oldy=p.y;let dx=0,dy=0;if(SM.keys.has("KeyW")||SM.keys.has("ArrowUp"))dy--;if(SM.keys.has("KeyS")||SM.keys.has("ArrowDown"))dy++;if(SM.keys.has("KeyA")||SM.keys.has("ArrowLeft"))dx--;if(SM.keys.has("KeyD")||SM.keys.has("ArrowRight"))dx++;if(dx||dy){const n=normalize(dx,dy);p.x=clamp(p.x+n.x*230*dt,24,c.width-24);p.y=clamp(p.y+n.y*230*dt,24,c.height-24);p.mx=n.x;p.my=n.y}else{p.mx=p.my=0}
 apTeleportMini(p,d.gates,dt);
 b.x+=b.vx*dt;b.y+=b.vy*dt;apTeleportMini(b,d.gates,dt);
 if(b.x<b.r+8){b.x=b.r+8;b.vx=Math.abs(b.vx)}if(b.x>c.width-b.r-8){b.x=c.width-b.r-8;b.vx=-Math.abs(b.vx)}if(b.y<b.r+8){b.y=b.r+8;b.vy=Math.abs(b.vy)}
 if(b.y>c.height+18){d.lives--;d.perfect=false;b.x=c.width/2;b.y=170;b.vx=190*(Math.random()<.5?-1:1);b.vy=-175;b._gateLock=.5;if(d.lives<=0){endNewMini(false,{reason:"lives-depleted"});return}}
 const pd=Math.hypot(b.x-p.x,b.y-p.y)||1;if(pd<b.r+p.r){const nx=(b.x-p.x)/pd,ny=(b.y-p.y)/pd,sp=clamp(Math.hypot(b.vx,b.vy)*1.045+35,220,520);b.x=p.x+nx*(b.r+p.r+2);b.y=p.y+ny*(b.r+p.r+2);b.vx=nx*sp+(p.mx||0)*95;b.vy=ny*sp+(p.my||0)*95;d.combo++}
 for(const t of d.targets){if(t.dead)continue;const dd=Math.hypot(b.x-t.x,b.y-t.y);if(dd<b.r+t.r){t.dead=true;d.broken++;d.combo++;const nx=(b.x-t.x)/(dd||1),ny=(b.y-t.y)/(dd||1),dot=b.vx*nx+b.vy*ny;b.vx-=2*dot*nx;b.vy-=2*dot*ny;if(d.broken>=d.targets.length){endNewMini(true,{reason:"objective-complete"});return}}}
 for(const t of d.targets){if(t.dead)continue;x.fillStyle="rgba(250,204,21,.12)";x.strokeStyle="#ffd85e";x.lineWidth=3;x.beginPath();x.arc(t.x,t.y,t.r,0,Math.PI*2);x.fill();x.stroke()}
 apDrawMiniGates(d.gates,x);x.strokeStyle="#5ae2ff";x.lineWidth=4;x.beginPath();x.arc(p.x,p.y,p.r+4,0,Math.PI*2);x.stroke();x.fillStyle="#0d2939";x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fill();apDrawFootball(x,b.x,b.y,b.r);
 x.fillStyle="rgba(255,76,103,.18)";x.fillRect(c.width*.34,c.height-10,c.width*.32,10);
 miniEls().score.textContent=`${L("TARGETS","MỤC TIÊU")} ${d.broken}/${d.targets.length} • ${L("BALL","BÓNG")} ×${d.lives} • ${L("COMBO","CHUỖI")} ×${d.combo} • ${apPerfectText(d.perfect)}`
}
function updateCoreHeist(dt,c,x,d){
 const speed=225*(1-Math.min(.18,d.cores*.05));apMiniMove(d,dt,speed);apTeleportMini(d,d.gates,dt);d.inv=Math.max(0,d.inv-dt);
 for(const q of d.coresList)if(!q.taken&&Math.hypot(d.x-q.x,d.y-q.y)<24){q.taken=true;d.cores++;d.threat=Math.min(1,d.cores/3)}
 for(const h of d.hazards){h.a+=dt*h.sp*(1+d.threat*.75);const hx=h.x+Math.cos(h.a)*h.rx,hy=h.y+Math.sin(h.a*.93)*h.ry;h.cx=hx;h.cy=hy;if(d.inv<=0&&Math.hypot(d.x-hx,d.y-hy)<h.r+12){d.shield--;d.perfect=false;d.inv=.9;if(d.shield<=0){endNewMini(false,{reason:"shield-depleted"});return}}x.fillStyle="rgba(255,78,112,.12)";x.strokeStyle="#ff6681";x.lineWidth=3;x.beginPath();x.arc(hx,hy,h.r,0,Math.PI*2);x.fill();x.stroke()}
 const ex=d.exit;const open=d.cores>=1;x.strokeStyle=open?"#72f0b2":"#4c6477";x.lineWidth=4;x.strokeRect(ex.x-28,ex.y-28,56,56);x.fillStyle=open?"#72f0b2":"#60788a";x.font="900 9px Arial";x.textAlign="center";x.fillText(open?L("CASH OUT","RÚT LUI"):L("LOCKED","KHÓA"),ex.x,ex.y+3);
 for(const q of d.coresList)if(!q.taken){x.fillStyle="#ffd75f";x.shadowBlur=10;x.shadowColor="#ffd75f";x.fillRect(q.x-8,q.y-8,16,16);x.shadowBlur=0}
 apDrawMiniGates(d.gates,x);x.fillStyle=d.inv>0?"#ff91a6":"#74eaff";x.beginPath();x.arc(d.x,d.y,12,0,Math.PI*2);x.fill();
 if(open&&Math.hypot(d.x-ex.x,d.y-ex.y)<34){d.cashTier=d.cores===3?4:d.cores===2?2:1;endNewMini(true);return}
 const bounty=d.cores===3?4:d.cores===2?2:d.cores===1?1:0;miniEls().score.textContent=`${L("CORES","LÕI")} ${d.cores}/3 • ${L("BOUNTY","THƯỞNG")} ×${bounty} • ${L("SHIELD","KHIÊN")} ${d.shield}/3 • ${apPerfectText(d.perfect)}`
}
function updatePhaseChaser(dt,c,x,d){
 apMiniMove(d,dt,245);apTeleportMini(d,d.gates,dt);d.ttl-=dt;const q=d.checkpoints[d.index];
 if(q&&Math.hypot(d.x-q.x,d.y-q.y)<28){d.index++;d.ttl=2.8;if(d.index>=d.checkpoints.length){endNewMini(true);return}}
 if(d.ttl<=0){d.misses++;d.perfect=false;d.signal=Math.max(0,d.signal-25);d.index++;d.ttl=2.8;if(d.signal<=0){endNewMini(false,{reason:"signal-depleted"});return}if(d.index>=d.checkpoints.length){endNewMini(true);return}}
 const next=d.checkpoints[d.index];if(next){const pulse=5+3*Math.sin(performance.now()/160);x.fillStyle="rgba(116,234,255,.10)";x.strokeStyle="#74eaff";x.lineWidth=3;x.beginPath();x.arc(next.x,next.y,21+pulse,0,Math.PI*2);x.fill();x.stroke();x.fillStyle="#eafaff";x.font="900 10px Arial";x.textAlign="center";x.fillText(String(d.index+1),next.x,next.y+3)}
 if(d.index>0){const prev=d.checkpoints[d.index-1];x.strokeStyle="rgba(162,130,255,.28)";x.lineWidth=2;x.setLineDash([5,7]);x.beginPath();x.moveTo(d.x,d.y);x.lineTo(next?.x??prev.x,next?.y??prev.y);x.stroke();x.setLineDash([])}
 apDrawMiniGates(d.gates,x);x.fillStyle="#7cecff";x.beginPath();x.arc(d.x,d.y,12,0,Math.PI*2);x.fill();miniEls().score.textContent=`${L("CHECKPOINT","CHECKPOINT")} ${Math.min(d.index,d.checkpoints.length)}/${d.checkpoints.length} • ${L("SIGNAL","TÍN HIỆU")} ${d.signal}% • ${d.ttl.toFixed(1)}s • ${apPerfectText(d.perfect)}`
}

function rectHitCircle(b,r){const cx=clamp(b.x,r.x,r.x+r.w),cy=clamp(b.y,r.y,r.y+r.h);return Math.hypot(b.x-cx,b.y-cy)<b.r}
function updateRift(dt,c,x,d){d.distance+=d.speed*dt;d.spawn-=dt;const up=SM.keys.has("KeyW")||SM.keys.has("ArrowUp"),down=SM.keys.has("KeyS")||SM.keys.has("ArrowDown");d.vy+=(down-up)*820*dt;d.vy*=Math.pow(.08,dt);d.y=clamp(d.y+d.vy*dt,40,c.height-40);if(d.spawn<=0){d.spawn=rand(.75,.42);const shard=Math.random()<.35;d.objects.push({x:c.width+30,y:rand(c.height-55,55),r:shard?8:rand(24,15),shard,hit:false})}for(const o of d.objects){o.x-=d.speed*dt;if(!o.hit&&Math.hypot(o.x-120,o.y-d.y)<o.r+12){o.hit=true;if(o.shard)d.shards++;else d.integrity--}}d.objects=d.objects.filter(o=>o.x>-40&&!o.hit);x.fillStyle="#7ee9ff";x.beginPath();x.arc(120,d.y,12,0,Math.PI*2);x.fill();for(const o of d.objects){x.strokeStyle=o.shard?"#ffd968":"#ff6f87";x.lineWidth=3;x.beginPath();x.arc(o.x,o.y,o.r,0,Math.PI*2);x.stroke()}const e=miniEls();e.score.textContent=`${L("INTEGRITY","TOÀN VẸN")} ${Math.max(0,d.integrity)}/3 • ${L("SHARDS","MẢNH")} ${d.shards}/5`;if(d.integrity<=0)endNewMini(false,{reason:"integrity-depleted"})}
function updateVault(dt,c,x,d){const b=d.ball,ax=((SM.keys.has("KeyD")||SM.keys.has("ArrowRight"))?1:0)-((SM.keys.has("KeyA")||SM.keys.has("ArrowLeft"))?1:0),ay=((SM.keys.has("KeyS")||SM.keys.has("ArrowDown"))?1:0)-((SM.keys.has("KeyW")||SM.keys.has("ArrowUp"))?1:0);b.vx=(b.vx+ax*390*dt)*Math.pow(.35,dt);b.vy=(b.vy+ay*390*dt)*Math.pow(.35,dt);let nx=clamp(b.x+b.vx*dt,b.r,c.width-b.r),ny=clamp(b.y+b.vy*dt,b.r,c.height-b.r);const oldx=b.x,oldy=b.y;b.x=nx;b.y=ny;for(const w of d.walls)if(rectHitCircle(b,w)){b.x=oldx;b.y=oldy;b.vx*=-.45;b.vy*=-.45}for(const h of d.holes)if(Math.hypot(b.x-h.x,b.y-h.y)<h.r-b.r*.25){d.falls++;b.x=95;b.y=375;b.vx=b.vy=0}const cp=d.checkpoints[d.checkpoint];if(cp&&Math.hypot(b.x-cp.x,b.y-cp.y)<30){d.checkpoint++;if(d.checkpoint>=3){endNewMini(true,{reason:"objective-complete"});return}}for(const w of d.walls){x.fillStyle="#17314a";x.fillRect(w.x,w.y,w.w,w.h)}for(const h of d.holes){x.fillStyle="#01040a";x.strokeStyle="#803bff";x.lineWidth=3;x.beginPath();x.arc(h.x,h.y,h.r,0,Math.PI*2);x.fill();x.stroke()}d.checkpoints.forEach((q,i)=>{x.strokeStyle=i<d.checkpoint?"#71f0ad":i===d.checkpoint?"#ffd963":"#46637d";x.lineWidth=4;x.beginPath();x.arc(q.x,q.y,25,0,Math.PI*2);x.stroke()});x.fillStyle="#b8efff";x.beginPath();x.arc(b.x,b.y,b.r,0,Math.PI*2);x.fill();miniEls().score.textContent=`${L("CHECKPOINT","CHECKPOINT")} ${d.checkpoint}/3 • ${L("FALLS","RƠI")} ${d.falls}`}
function updateChrono(dt,c,x,d){d.angle=(d.angle+d.speed*dt)%(Math.PI*2);const cx=c.width/2,cy=c.height/2,r=125+d.ring*18,win=.30;x.strokeStyle="#253b55";x.lineWidth=15;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke();x.strokeStyle="#ffd560";x.lineWidth=17;x.beginPath();x.arc(cx,cy,r,d.target-win,d.target+win);x.stroke();x.fillStyle="#9ceaff";x.beginPath();x.arc(cx+Math.cos(d.angle)*r,cy+Math.sin(d.angle)*r,9,0,Math.PI*2);x.fill();x.fillStyle="#eaf8ff";x.font="900 42px Arial";x.textAlign="center";x.fillText(`${d.locked}/5`,cx,cy+14);miniEls().score.textContent=`${L("MISSES","TRƯỢT")} ${d.misses} • ${L("RING","VÒNG")} ${d.ring+1}/5`}
function updateHeist(dt,c,x,d){const sp=205,dx=((SM.keys.has("KeyD")||SM.keys.has("ArrowRight"))?1:0)-((SM.keys.has("KeyA")||SM.keys.has("ArrowLeft"))?1:0),dy=((SM.keys.has("KeyS")||SM.keys.has("ArrowDown"))?1:0)-((SM.keys.has("KeyW")||SM.keys.has("ArrowUp"))?1:0);d.x=clamp(d.x+dx*sp*dt,18,c.width-18);d.y=clamp(d.y+dy*sp*dt,18,c.height-18);d.inv=Math.max(0,d.inv-dt);for(const q of d.coreList)if(!q.taken&&Math.hypot(d.x-q.x,d.y-q.y)<23){q.taken=true;d.cores++}for(const l of d.lasers){l.phase+=dt*.8;const lx=(Math.sin(l.phase)*.5+.5)*c.width;x.strokeStyle="rgba(255,72,108,.62)";x.lineWidth=7;x.beginPath();x.moveTo(lx,l.y-120);x.lineTo(lx,l.y+120);x.stroke();if(d.inv<=0&&Math.abs(d.x-lx)<12&&Math.abs(d.y-l.y)<125){d.alarms++;d.inv=1.2}}const ex={x:c.width-55,y:c.height-50};x.strokeStyle=d.cores>=3?"#72f0b2":"#50667a";x.lineWidth=4;x.strokeRect(ex.x-24,ex.y-24,48,48);for(const q of d.coreList)if(!q.taken){x.fillStyle="#ffd761";x.fillRect(q.x-8,q.y-8,16,16)}x.fillStyle=d.inv>0?"#ff8d9b":"#74eaff";x.beginPath();x.arc(d.x,d.y,12,0,Math.PI*2);x.fill();if(d.cores>=3&&Math.hypot(d.x-ex.x,d.y-ex.y)<30){endNewMini(true,{reason:"objective-complete"});return}miniEls().score.textContent=`${L("CORES","LÕI")} ${d.cores}/3 • ${L("ALARMS","BÁO ĐỘNG")} ${d.alarms}`}
function updateAuction(dt,c,x,d){x.fillStyle="#eaf8ff";x.font="900 24px Arial";x.textAlign="center";x.fillText(`${L("NEXT SAFE PAYOUT","THƯỞNG AN TOÀN KẾ TIẾP")} x${d.round}`,c.width/2,64);x.font="800 13px Arial";x.fillStyle=(d.cashTier||0)>0?"#72f0b2":"#7894aa";x.fillText((d.cashTier||0)>0?`${L("BANK READY","QUỸ SẴN SÀNG")} x${d.cashTier} • E ${L("CASH OUT","CHỐT THƯỞNG")}`:L("OPEN 1 LOT WITH 1 / 2 / 3","MỞ 1 LÔ BẰNG 1 / 2 / 3"),c.width/2,92);for(let i=0;i<3;i++){const px=180+i*240,py=220;x.fillStyle=i===d.selected?(i===d.trap?"#6b1733":"#20543f"):"#12273b";x.strokeStyle=i===d.selected?(i===d.trap?"#ff6684":"#6ff0ad"):"#52718b";x.lineWidth=3;x.fillRect(px-70,py-70,140,140);x.strokeRect(px-70,py-70,140,140);x.fillStyle="#e8f7ff";x.font="900 32px Arial";x.fillText(String(i+1),px,py+10)}x.font="700 12px Arial";x.fillStyle="#9ab4c9";x.fillText(d.result||L("SAFE raises Bank • CORRUPTION loses Bank • E cashes out","AN TOÀN tăng Quỹ • THA HÓA mất Quỹ • E để chốt"),c.width/2,386);miniEls().score.textContent=`${L("ROUND","VÒNG")} ${d.round}/5 • ${L("BANK","NGÂN QUỸ")} x${d.cashTier||0} • ${(d.cashTier||0)>0?L("E = CASH OUT","E = CHỐT"):L("PICK 1 / 2 / 3","CHỌN 1 / 2 / 3")}`}
function newMiniFrame(now){
 if(!SM.active)return;
 try{
  if(!repairModernMiniSurface())throw new Error("Minigame surface/state unavailable");
  const dt=Math.min(.035,Math.max(0,(now-SM.last)/1000)||.016);SM.last=now;
  const e=miniEls(),d=SM.data;const prior=Number(d.time);d.time-=dt;if(Number.isFinite(SM.lastObservedTime)&&d.time>SM.lastObservedTime+.08){try{window.VSX_RUNTIME_SAFETY?.state?.log?.push?.({ts:Date.now(),level:"WARN",code:"ANOMALY_MINI_TIME_RESET_CLAMPED",character:game.characterId||"unknown",detail:`${SM.id} ${SM.lastObservedTime.toFixed(2)} -> ${d.time.toFixed(2)}`})}catch{}d.time=SM.lastObservedTime}SM.lastObservedTime=Number(d.time);bg(e.canvas,e.ctx);
  if(SM.id==="rift_runner")updateRift(dt,e.canvas,e.ctx,d);
  else if(SM.id==="gravity_vault")updateVault(dt,e.canvas,e.ctx,d);
  else if(SM.id==="chrono_lock")updateChrono(dt,e.canvas,e.ctx,d);
  else if(SM.id==="drone_heist")updateHeist(dt,e.canvas,e.ctx,d);
  else if(SM.id==="shadow_replay")updateShadowReplay(dt,e.canvas,e.ctx,d);
  else if(SM.id==="void_pinball_gate")updateGatePinball(dt,e.canvas,e.ctx,d);
  else if(SM.id==="core_heist")updateCoreHeist(dt,e.canvas,e.ctx,d);
  else if(SM.id==="phase_chaser")updatePhaseChaser(dt,e.canvas,e.ctx,d);
  else updateAuction(dt,e.canvas,e.ctx,d);
  SM.frameErrors=0;SM.faultSince=0;
  const timer=ensureMiniTimer();if(timer)timer.textContent=`${Math.max(0,d.time).toFixed(1)}s`;
  if(!SM.active)return;
  if(d.time<=0){
   let ok=false;
   if(SM.id==="void_auction")ok=(d.cashTier||0)>0;
   else if(SM.id==="rift_runner")ok=(d.shards||0)>=5;
   else if(SM.id==="gravity_vault")ok=(d.checkpoint||0)>=3;
   else if(SM.id==="chrono_lock")ok=(d.locked||0)>=5;
   else if(SM.id==="drone_heist")ok=(d.cores||0)>=3;
   else if(SM.id==="shadow_replay")ok=true;
   else if(SM.id==="void_pinball_gate")ok=(d.broken||0)>=10;
   else if(SM.id==="core_heist"){if((d.cores||0)>0){d.cashTier=d.cores===3?4:d.cores===2?2:1;ok=true}}
   else if(SM.id==="phase_chaser")ok=(d.index||0)>=(d.checkpoints?.length||12);
   endNewMini(ok,{reason:"timer-complete"});return
  }
  window.VSX_REFRESH_ENCOUNTER_MAP_STATUS?.();SM.raf=requestAnimationFrame(newMiniFrame)
 }catch(err){
  SM.frameErrors=(SM.frameErrors||0)+1;SM.faultSince=SM.faultSince||performance.now();SM.lastError=String(err?.stack||err);const fatal=SM.frameErrors>=8&&(performance.now()-SM.faultSince)>=1200;console.error("[MINIGAME FRAME RECOVERY]",SM.id,`frame ${SM.frameErrors} · ${(performance.now()-SM.faultSince).toFixed(0)}ms`,err);
  try{window.VSX_RUNTIME_SAFETY?.state?.log?.push?.({ts:Date.now(),level:fatal?"ERROR":"WARN",code:fatal?"ANOMALY_MINI_FRAME_FATAL":"ANOMALY_MINI_FRAME_RETRY",character:game.characterId||"unknown",detail:SM.lastError})}catch{}
  if(SM.active&&!fatal){repairModernMiniSurface();SM.last=performance.now();SM.raf=requestAnimationFrame(newMiniFrame);return}
  endNewMini(false,{silent:true,reason:"frame-error-timeout"})
 }
}
function miniKey(code,repeat){if(!SM.active)return;if(code==="Escape"){endNewMini(false,{reason:"user-abort"});return}const d=SM.data;if(SM.id==="chrono_lock"&&code==="Space"&&!repeat){let delta=Math.abs(Math.atan2(Math.sin(d.angle-d.target),Math.cos(d.angle-d.target)));if(delta<.30){d.locked++;d.ring++;d.speed*=1.22;d.target=Math.random()*Math.PI*2;if(d.locked>=5){endNewMini(true,{reason:"objective-complete"});return}}else{d.misses++;d.time=Math.max(0,d.time-1.2)}}else if(SM.id==="void_auction"&&!repeat){if(code==="KeyE"&&(d.cashTier||0)>0){d.result=L(`CASHED OUT x${d.cashTier}`,`ĐÃ CHỐT x${d.cashTier}`);endNewMini(true);return}const idx={Digit1:0,Digit2:1,Digit3:2}[code];if(idx!=null&&d.selected<0){d.selected=idx;if(idx===d.trap){d.result=L("CORRUPTION — BANK LOST","THA HÓA — MẤT TOÀN BỘ QUỸ");d.cashTier=0;miniDelay(()=>endNewMini(false,{reason:"auction-corruption"}),850)}else{d.cashTier=d.round;d.result=L(`SAFE LOT — BANK x${d.cashTier} • E CASH OUT OR WAIT FOR NEXT ROUND`,`LÔ AN TOÀN — QUỸ x${d.cashTier} • E CHỐT HOẶC CHỜ VÒNG KẾ`);if(d.round>=5){miniDelay(()=>endNewMini(true,{reason:"auction-complete"}),900)}else miniDelay(()=>{d.round++;d.selected=-1;d.trap=(Math.random()*3)|0;d.result=L(`ROUND ${d.round} — choose 1 / 2 / 3 or E to cash out x${d.cashTier}`,`VÒNG ${d.round} — chọn 1 / 2 / 3 hoặc E chốt x${d.cashTier}`)},900)}}}}
document.addEventListener("keydown",ev=>{if(game.state!=="VSX_MINIGAME")return;ev.preventDefault();ev.stopImmediatePropagation();SM.keys.add(ev.code);miniKey(ev.code,ev.repeat)},true);document.addEventListener("keyup",ev=>{if(game.state!=="VSX_MINIGAME")return;SM.keys.delete(ev.code);ev.preventDefault();ev.stopImmediatePropagation()},true);

/* Minigame performance guard: the arena is static while a standalone challenge owns the screen.
   Skipping the full world render prevents Admin stress-test entities/projectiles from being redrawn behind the minigame. */
const MINI_WORLD_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){if(this.state==="VSX_MINIGAME"||this.state==="EVENT_MINIGAME")return;return MINI_WORLD_RENDER_BASE.apply(this,arguments)};
const MINI_MENU_BASE=Game.prototype.menu;
Game.prototype.menu=function(){if(SM.active)endNewMini(false,{silent:true,reason:"superseded-start"});clearMiniTimers();return MINI_MENU_BASE.apply(this,arguments)};
/* ---------- World Event mechanics ---------- */

function apWorldGateSet(g){const p=g.player;return[
 {x:p.x-285,y:p.y-90,label:"A",to:1,angle:0,color:"#73dcff",r:27},
 {x:p.x+285,y:p.y+90,label:"B",to:0,angle:Math.PI,color:"#b98cff",r:27},
 {x:p.x+70,y:p.y-285,label:"C",to:3,angle:Math.PI/2,color:"#73dcff",r:27},
 {x:p.x-70,y:p.y+285,label:"D",to:2,angle:-Math.PI/2,color:"#b98cff",r:27}
]}
function apPairWorldGates(rt,mode=0){
 const g=rt.gates||[];if(g.length<4)return;
 if(mode%3===0){g[0].to=1;g[1].to=0;g[2].to=3;g[3].to=2}
 else if(mode%3===1){g[0].to=2;g[2].to=0;g[1].to=3;g[3].to=1}
 else{g[0].to=3;g[3].to=0;g[1].to=2;g[2].to=1}
 rt.pairMode=mode%3;
 const palette=["#73dcff","#b98cff"],seen=new Set();let pi=0;
 for(let i=0;i<g.length;i++){if(seen.has(i))continue;const j=g[i].to,c=palette[pi++%palette.length];g[i].color=c;if(g[j])g[j].color=c;seen.add(i);seen.add(j)}
}
function apRecenterWorldGates(g,rt){if(!rt.gates?.length)return;const p=g.player,near=Math.min(...rt.gates.map(q=>Math.hypot(q.x-p.x,q.y-p.y)));if(near<760)return;const fresh=apWorldGateSet(g);for(let i=0;i<rt.gates.length;i++){rt.gates[i].x=fresh[i].x;rt.gates[i].y=fresh[i].y;rt.gates[i].angle=fresh[i].angle}}
function apRotateVec(obj,rot){if(!Number.isFinite(obj?.vx)||!Number.isFinite(obj?.vy))return;const c=Math.cos(rot),s=Math.sin(rot),vx=obj.vx,vy=obj.vy;obj.vx=vx*c-vy*s;obj.vy=vx*s+vy*c}
function apWorldTeleportEntity(ent,gates,dt,kind,rt,g){
 if(!ent||ent.dead||!gates?.length||!Number.isFinite(ent.x)||!Number.isFinite(ent.y))return false;
 ent.vsxGateLock=Math.max(0,(ent.vsxGateLock||0)-dt);if(ent.vsxGateLock>0)return false;
 if(kind==="enemy"&&(ent.isBoss||ent.isMiniBoss||ent.specialId||ent.isCaptive))return false;
 if(kind==="projectile"&&(ent.vsxGateHops||0)>=6)return false;
 for(let i=0;i<gates.length;i++){const a=gates[i];if(Math.hypot(ent.x-a.x,ent.y-a.y)>a.r+(kind==="player"?g.player.radius:(ent.radius||ent.size||8)))continue;const b=gates[a.to];if(!b)continue;const rot=(b.angle||0)-(a.angle||0);apRotateVec(ent,rot);ent.x=b.x+Math.cos(b.angle||0)*(b.r+(kind==="player"?g.player.radius:(ent.radius||ent.size||8))+8);ent.y=b.y+Math.sin(b.angle||0)*(b.r+(kind==="player"?g.player.radius:(ent.radius||ent.size||8))+8);ent.vsxGateLock=.34;ent.vsxGateHops=(ent.vsxGateHops||0)+1;if(kind==="player"){if(g.lastMoveDir){const v={vx:g.lastMoveDir.x,vy:g.lastMoveDir.y};apRotateVec(v,rot);g.lastMoveDir={x:v.vx,y:v.vy}}if(g.dashDir){const v={vx:g.dashDir.x,vy:g.dashDir.y};apRotateVec(v,rot);g.dashDir={x:v.vx,y:v.vy}}rt.playerTeleports=(rt.playerTeleports||0)+1}return true}
 return false
}
function apStepWorldGates(g,rt,dt){
 rt.gateStep=(rt.gateStep||0)+dt;if(rt.gateStep<.05)return;const step=Math.min(.12,rt.gateStep);rt.gateStep=0;apRecenterWorldGates(g,rt);
 apWorldTeleportEntity(g.player,rt.gates,step,"player",rt,g);
 for(const e of g.enemies||[])apWorldTeleportEntity(e,rt.gates,step,"enemy",rt,g);
 for(const q of (g.projectiles||[]).slice(-800))apWorldTeleportEntity(q,rt.gates,step,"projectile",rt,g);
 for(const q of (g.enemyProjectiles||[]).slice(-650))apWorldTeleportEntity(q,rt.gates,step,"projectile",rt,g)
}
function apDrawWorldGate(g,q){g.save();g.translate(q.x,q.y);g.rotate((game.time||0)*.45);g.globalCompositeOperation="screen";g.shadowBlur=18;g.shadowColor=q.color;g.strokeStyle=q.color;g.lineWidth=4;g.globalAlpha=.88;g.beginPath();g.arc(0,0,q.r,0,Math.PI*2);g.stroke();g.globalAlpha=.38;g.lineWidth=2;g.beginPath();g.arc(0,0,q.r+8,.3,2.2);g.stroke();g.beginPath();g.arc(0,0,q.r+8,3.35,5.85);g.stroke();g.globalCompositeOperation="source-over";g.fillStyle="#eaf8ff";g.font="900 9px Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(q.label,0,1);g.restore()}
function apRestoreGoldRush(g){for(const e of g.enemies||[])if(e._grBaseSpeed!=null){e.speed=e._grBaseSpeed;delete e._grBaseSpeed}}
function apEchoSnapshot(q,owner){return{x:q.x,y:q.y,vx:q.vx,vy:q.vy,radius:clamp(Number(q.radius)||5,2,12),damage:Math.max(1,(Number(q.damage)||8)*(owner==="player"?.65:.45)),life:Math.min(1.8,Math.max(.35,Number(q.life)||1.2)),owner,color:owner==="player"?"#bdefff":"#ff9ab4",delay:owner==="player"?.75:.90}}
function apEchoUpdate(g,rt,dt){
 rt.echoTokens=Math.min(16,(rt.echoTokens||0)+dt*14);rt.echoIdle=(rt.echoIdle||0)+dt;
 rt.scanStep=(rt.scanStep||0)+dt;
 if(rt.scanStep>=.05){
  rt.scanStep=0;
  const scan=(list,seen,owner,max)=>{for(const q of list.slice(-max)){if(!q||q.dead||q.vsxEcho||seen.has(q)||!Number.isFinite(q.x)||!Number.isFinite(q.y)||!Number.isFinite(q.vx)||!Number.isFinite(q.vy))continue;seen.add(q);if(rt.echoTokens<1||rt.echoQueue.length>=120)continue;rt.echoTokens-=1;rt.echoQueue.push(apEchoSnapshot(q,owner))}};
  scan(g.projectiles||[],rt.seenP,"player",260);scan(g.enemyProjectiles||[],rt.seenE,"enemy",220);
 }
 let resolved=0;
 for(let i=rt.echoQueue.length-1;i>=0;i--){const s=rt.echoQueue[i];s.delay-=dt;if(s.delay>0)continue;rt.echoQueue.splice(i,1);const q=new Projectile({x:s.x,y:s.y,vx:s.vx,vy:s.vy,radius:s.radius,damage:s.damage,life:s.life,pierce:0,bounce:0,color:s.color,owner:s.owner,critAllowed:false,weapon:s.owner==="player"?{id:"echo_war",cool:0,def:{cooldown:999,tags:["world_event","projectile"]}}:null,behavior:"straight"});q.vsxEcho=true;(s.owner==="player"?g.projectiles:g.enemyProjectiles).push(q);rt.echoes++;resolved++}
 if(resolved>0)rt.echoIdle=0;
 /* Fallback pulse: melee/area builds and melee-only enemy waves otherwise make Echo War visually inert. */
 if(rt.echoIdle>=2.4&&rt.echoQueue.length===0&&g.player){rt.echoIdle=0;rt.fallbackPulses=(rt.fallbackPulses||0)+1;const p=g.player,src={id:"echo_war_pulse",def:{tags:["world_event","area"]}};g.effects.push(new WaveEffect(p.x,p.y,155,.62,Math.max(8,10*g.player.damageMultiplier),35,src,"#9bd9ff"));const off=Math.random()*Math.PI*2;for(let i=0;i<4;i++){const a=off+i*Math.PI/2,x=p.x+Math.cos(a)*185,y=p.y+Math.sin(a)*185,n=normalize(p.x-x,p.y-y),q=new Projectile({x,y,vx:n.x*190,vy:n.y*190,radius:5,damage:Math.max(3,p.maxHp*.018),life:1.8,color:"#ff9ab4",owner:"enemy",critAllowed:false});q.vsxEcho=true;g.enemyProjectiles.push(q)}rt.echoes++}
}
function apGoldTier(k){return k>=5?5:k>=4?4:k>=3?3:k>=2?2:k>=1?1.5:1}
function apGoldSpawn(g,rt){const a=Math.random()*Math.PI*2,r=rand(340,210),hp=70+g.wave*5;rt.drones.push({id:NEXT_ID++,vsxGoldDrone:true,x:g.player.x+Math.cos(a)*r,y:g.player.y+Math.sin(a)*r,hp,maxHp:hp,max:hp,r:15,size:15,turn:Math.random()*6.28,dead:false,hit:new Set(),statuses:new Map(),knockbackResistance:1,isCaptive:false,isBoss:false,isMiniBoss:false,elite:false,flash:0,applyStatus(){}})}
function apGoldDamage(g,rt,d,amount,o={}){if(!d||d.dead)return{killed:false,crit:false};let dmg=Math.max(1,Number(amount)||1),crit=false;if(o.canCrit&&Math.random()<(g.player?.critChance||0)){dmg*=g.player?.critDamage||2;crit=true}d.hp-=dmg;d.flash=.08;if(!o.silent)g.texts.push(new FloatingText(d.x,d.y-d.r-7,crit?`${Math.round(dmg)} CRIT!`:`${Math.round(dmg)}`,crit?"#fff19a":"#ffe06a",crit?17:13));const killed=d.hp<=0;if(killed){d.dead=true;rt.kills++;rt.tier=apGoldTier(rt.kills);g.gems.push(new XPGem(d.x,d.y,25));g.spark(d.x,d.y,"#ffd45f",14)}return{killed,crit}}
window.VSX_GOLD_RUSH_DAMAGE=function(g,d,amount,o={}){const rt=g?.vsxNewWorldRuntime;if(g?.worldEvent?.id!=="gold_rush"||rt?.id!=="gold_rush"||!rt.drones?.includes(d))return{killed:false,crit:false};return apGoldDamage(g,rt,d,amount,o)};
function apGoldUpdate(g,rt,dt){
 rt.step=(rt.step||0)+dt;if(rt.step<.05)return;const step=Math.min(.12,rt.step);rt.step=0;rt.spawn-=step;
 if(rt.spawn<=0&&rt.drones.filter(x=>!x.dead).length<2&&rt.kills<6){rt.spawn=3.0;apGoldSpawn(g,rt)}
 const p=g.player;if(rt.cash&&Math.hypot(rt.cash.x-p.x,rt.cash.y-p.y)>620){rt.cash.x=p.x+225;rt.cash.y=p.y-165}for(const d of rt.drones){if(d.dead)continue;d.turn+=step*.9;const dx=p.x-d.x,dy=p.y-d.y,dist=Math.hypot(dx,dy)||1,n={x:dx/dist,y:dy/dist},side={x:-n.y,y:n.x};let radial=dist>290?190:dist>220?92:dist<125?-65:18;const weave=Math.sin(d.turn*2.1)*72;d.x+=(n.x*radial+side.x*weave)*step;d.y+=(n.y*radial+side.y*weave)*step;if(dist>560){d.x=p.x-n.x*340;d.y=p.y-n.y*340}for(const q of (g.projectiles||[]).slice(-420)){if(q.dead||d.hit.has(q.id))continue;if(Math.hypot(q.x-d.x,q.y-d.y)<d.r+(q.radius||4)){d.hit.add(q.id);apGoldDamage(g,rt,d,Math.max(1,q.damage||6),{canCrit:false,silent:true});if(d.dead)break}}}
 rt.drones=rt.drones.filter(x=>!x.dead);
 rt.threat=Math.min(.65,rt.kills*.10);for(const e of g.enemies||[]){if(e.dead||e.isBoss||e.isMiniBoss||e.specialId)continue;e._grBaseSpeed??=e.speed;e.speed=e._grBaseSpeed*(1+rt.threat)}
 rt.pressure-=step;if(rt.pressure<=0&&rt.kills>=2&&(g.enemies?.length||0)<520){rt.pressure=Math.max(.72,2.0-rt.kills*.18);g.spawnManager?.spawnOne?.(rt.kills>=5&&Math.random()<.25)}
 if(rt.kills>0&&rt.cash&&Math.hypot(p.x-rt.cash.x,p.y-rt.cash.y)<42){rt.cashed=true;rt.cashTier=rt.tier;g.worldEvent.time=Math.min(g.worldEvent.time,.08)}
}
function apBlackHoleUpdate(g,rt,dt){
 rt.step=(rt.step||0)+dt;if(rt.step<.05)return;const step=Math.min(.12,rt.step);rt.step=0;const p=g.player;rt.a+=step*.34;rt.x=lerp(rt.x,p.x+Math.cos(rt.a)*330,Math.min(1,step*.85));rt.y=lerp(rt.y,p.y+Math.sin(rt.a*.77)*240,Math.min(1,step*.85));const pull=(obj,kind)=>{if(!obj||obj.dead||!Number.isFinite(obj.x)||!Number.isFinite(obj.y))return;const dx=rt.x-obj.x,dy=rt.y-obj.y,d=Math.hypot(dx,dy)||1;if(d>430)return;const k=1-d/430,nx=dx/d,ny=dy/d,str=55+260*k*k;if(kind==="projectile"){obj.vx+=nx*str*step;obj.vy+=ny*str*step;if(d<160&&d>75&&!obj.vsxBHSlingshot){obj.vx*=1.15;obj.vy*=1.15;obj.vsxBHSlingshot=true}}else if(kind==="gem"){obj.vx=(obj.vx||0)+nx*str*.7*step;obj.vy=(obj.vy||0)+ny*str*.7*step}else if(kind==="enemy"){if(obj.isBoss||obj.isMiniBoss||obj.specialId)return;obj.x+=nx*str*.20*step*(1-(obj.knockbackResistance||0));obj.y+=ny*str*.20*step*(1-(obj.knockbackResistance||0))}};
 for(const e of g.enemies||[])pull(e,"enemy");for(const q of (g.projectiles||[]).slice(-900))pull(q,"projectile");for(const q of (g.enemyProjectiles||[]).slice(-700))pull(q,"projectile");for(const q of (g.gems||[]).slice(-600))pull(q,"gem");
 const dp=Math.hypot(p.x-rt.x,p.y-rt.y)||1;rt.gravity=clamp(1-dp/430,0,1);if(dp<380){const n=normalize(rt.x-p.x,rt.y-p.y);p.x+=n.x*(18+75*rt.gravity*rt.gravity)*step;p.y+=n.y*(18+75*rt.gravity*rt.gravity)*step}rt.hurt=Math.max(0,(rt.hurt||0)-step);if(dp<82&&rt.hurt<=0){rt.hurt=.7;rt.coreHits++;p.takeDamage(Math.max(4,p.maxHp*.04),{worldEvent:true})}
}
function apDrawAnomalyMinimap(g,ev,rt){
 if(VSX?.save?.settings?.minimapLayerObjectives===false)return;
 const cvs=document.getElementById("vsxMinimapCanvas"),wrap=document.getElementById("vsxMinimapWrap");if(!cvs||!wrap||wrap.style.display==="none"||!g.player)return;const m=cvs.getContext("2d"),w=cvs.width,h=cvs.height,cx=w/2,cy=h/2,maxR=Math.min(w,h)/2-14,R=1250;const proj=(x,y)=>{let dx=x-g.player.x,dy=y-g.player.y,sx=dx/R*maxR,sy=dy/R*maxR,dd=Math.hypot(sx,sy);if(dd>maxR){const k=maxR/dd;sx*=k;sy*=k}return{x:cx+sx,y:cy+sy}};
 const dot=(x,y,c,l)=>{const p=proj(x,y);m.save();m.fillStyle=c;m.strokeStyle="#fff";m.lineWidth=1;m.beginPath();m.arc(p.x,p.y,4,0,Math.PI*2);m.fill();m.stroke();m.fillStyle="#fff";m.font="900 7px Arial";m.textAlign="center";m.fillText(l,p.x,p.y-7);m.restore()};
 if(ev.id==="rift_network"){
   const gates=rt.gates||[],done=new Set();m.save();m.globalAlpha=.28;m.lineWidth=1.5;
   for(let i=0;i<gates.length;i++){if(done.has(i))continue;const q=gates[i],j=q.to,z=gates[j];if(!z)continue;const a=proj(q.x,q.y),b=proj(z.x,z.y);m.strokeStyle=q.color||"#73dcff";m.beginPath();m.moveTo(a.x,a.y);m.lineTo(b.x,b.y);m.stroke();done.add(i);done.add(j)}
   m.restore();for(const q of gates)dot(q.x,q.y,q.color,q.label)
 }else if(ev.id==="gold_rush"){for(const d of rt.drones||[])if(!d.dead)dot(d.x,d.y,"#ffd45f","$");if(rt.cash)dot(rt.cash.x,rt.cash.y,"#72f0b2","C")}
 else if(ev.id==="crown_hunt"&&rt.target&&!rt.target.dead){const q=proj(rt.target.x,rt.target.y);m.save();m.fillStyle="#ffd75e";m.strokeStyle="#fff2a6";m.lineWidth=2;m.beginPath();m.arc(q.x,q.y,6,0,Math.PI*2);m.fill();m.stroke();m.fillStyle="#fff7c7";m.font="900 10px Arial";m.textAlign="center";m.fillText("K",q.x,q.y-10);m.restore()}
 else if(ev.id==="black_hole_tide")dot(rt.x,rt.y,"#9b7cff","O")
}

function worldInit(g,id){
 const ev=g.worldEvent;if(!ev||!NEW_WORLD_IDS.includes(id)||!g.player)return;
 const rt=g.vsxNewWorldRuntime={id,startedWithBoss:!!g.boss};if(["rift_network","echo_war","gold_rush","black_hole_tide"].includes(id))document.getElementById("vsxAnnouncement")?.classList.remove("show");vsxDiscover("world_events",id);const s=ensureRunStats(g);s.worldBossStart=!!g.boss;
 if(id==="moving_eye")Object.assign(rt,{cx:g.player.x+160,cy:g.player.y,r:175,a:0,outside:0,tick:0});
 else if(id==="collapsing_grid")Object.assign(rt,{tiles:[],cycle:0,warn:0,hit:false,tick:0});
 else if(id==="crown_hunt")Object.assign(rt,{crowns:0,target:null});
 else if(id==="time_fracture")Object.assign(rt,{slowA:0,fastA:Math.PI,slowTime:0,fastTime:0});
 else if(id==="blackout_protocol")Object.assign(rt,{pulse:0});
 else if(id==="rift_network"){Object.assign(rt,{gates:apWorldGateSet(g),pairMode:0,shift:7,playerTeleports:0,gateStep:0});apPairWorldGates(rt,0)}
 else if(id==="echo_war")Object.assign(rt,{seenP:new WeakSet(),seenE:new WeakSet(),echoQueue:[],echoTokens:10,echoes:0,scanStep:0,echoIdle:0,fallbackPulses:0});
 else if(id==="gold_rush")Object.assign(rt,{drones:[],spawn:.35,kills:0,tier:1,threat:0,pressure:1.2,cash:{x:g.player.x+250,y:g.player.y-180},cashTier:0,cashed:false,step:0});
 else if(id==="black_hole_tide")Object.assign(rt,{x:g.player.x-330,y:g.player.y,a:0,gravity:0,coreHits:0,hurt:0,step:0});
}
function pickCrown(g,rt){const pool=g.enemies.filter(e=>!e.dead&&!e.isCaptive&&!e.specialId&&!e.isBoss&&!e.isMiniBoss);if(!pool.length){rt.target=null;return}pool.sort((a,b)=>(b.maxHp||b.hp)-(a.maxHp||a.hp));rt.target=pool[Math.min(pool.length-1,(Math.random()*Math.min(5,pool.length))|0)];rt.target.vsxCrowned=true}
function restoreTimeFracture(g){for(const e of g.enemies||[])if(e._tfBaseSpeed!=null){e.speed=e._tfBaseSpeed;delete e._tfBaseSpeed;delete e._tfFactor}for(const list of [g.enemyProjectiles||[],g.projectiles||[]])for(const q of list)if(q._tfFactor){q.vx/=q._tfFactor;q.vy/=q._tfFactor;delete q._tfFactor}}
function worldPre(g,dt){const ev=g.worldEvent,rt=g.vsxNewWorldRuntime;if(!ev||!rt||rt.id!==ev.id)return;if(ev.id==="time_fracture"){const p=g.player;rt.slowA+=dt*.42;rt.fastA-=dt*.50;rt.sx=p.x+Math.cos(rt.slowA)*235;rt.sy=p.y+Math.sin(rt.slowA)*180;rt.fx=p.x+Math.cos(rt.fastA)*250;rt.fy=p.y+Math.sin(rt.fastA)*190;const inS=Math.hypot(p.x-rt.sx,p.y-rt.sy)<135,inF=Math.hypot(p.x-rt.fx,p.y-rt.fy)<135;if(inS)rt.slowTime+=dt;if(inF)rt.fastTime+=dt;for(const e of g.enemies){if(e.dead)continue;e._tfBaseSpeed??=e.speed;const ds=Math.hypot(e.x-rt.sx,e.y-rt.sy),df=Math.hypot(e.x-rt.fx,e.y-rt.fy),fac=ds<135?.48:df<135?1.55:1;e.speed=e._tfBaseSpeed*fac;e._tfFactor=fac}for(const list of [g.enemyProjectiles,g.projectiles])for(const q of list){if(q.dead)continue;const ds=Math.hypot(q.x-rt.sx,q.y-rt.sy),df=Math.hypot(q.x-rt.fx,q.y-rt.fy),fac=ds<135?.58:df<135?1.45:1,old=q._tfFactor||1;if(Math.abs(fac-old)>.01){q.vx=q.vx/old*fac;q.vy=q.vy/old*fac;q._tfFactor=fac}}}}
function worldPost(g,dt){
 const ev=g.worldEvent,rt=g.vsxNewWorldRuntime;if(!ev||!rt||rt.id!==ev.id||!g.player)return;const p=g.player;
 if(ev.id==="moving_eye"){rt.a+=dt*.38;rt.cx=lerp(rt.cx,p.x+Math.cos(rt.a)*210,Math.min(1,dt*1.1));rt.cy=lerp(rt.cy,p.y+Math.sin(rt.a*1.21)*155,Math.min(1,dt*1.1));const out=Math.hypot(p.x-rt.cx,p.y-rt.cy)>rt.r;if(out){rt.outside+=dt;rt.tick-=dt;if(rt.tick<=0){rt.tick=.75;p.takeDamage(Math.max(3,p.maxHp*.035),{worldEvent:true})}}}
 else if(ev.id==="collapsing_grid"){rt.cycle-=dt;if(rt.cycle<=0){rt.cycle=2.35;rt.warn=.85;rt.tiles=[];const sz=145,cx=Math.round(p.x/sz)*sz,cy=Math.round(p.y/sz)*sz;const used=new Set();while(rt.tiles.length<5){const ix=((Math.random()*5)|0)-2,iy=((Math.random()*5)|0)-2,k=ix+","+iy;if(used.has(k))continue;used.add(k);rt.tiles.push({x:cx+ix*sz,y:cy+iy*sz})}}rt.warn=Math.max(0,rt.warn-dt);if(rt.warn<=0){rt.tick-=dt;if(rt.tick<=0){rt.tick=.38;for(const q of rt.tiles)if(Math.abs(p.x-q.x)<68&&Math.abs(p.y-q.y)<68){p.takeDamage(Math.max(5,p.maxHp*.045),{worldEvent:true});rt.hit=true;break}}}}
 else if(ev.id==="crown_hunt"){if(!rt.target)pickCrown(g,rt);else if(rt.target.dead){delete rt.target.vsxCrowned;rt.crowns++;rt.target=null;if(rt.crowns>=5)ev.time=Math.min(ev.time,.15)}else{const t=rt.target,dx=p.x-t.x,dy=p.y-t.y,dd=Math.hypot(dx,dy)||1;if(dd>82){const pull=Math.min(115,48+(t.speed||80)*.34);t.x+=dx/dd*pull*dt;t.y+=dy/dd*pull*dt}t.vsxCrowned=true}}
 else if(ev.id==="blackout_protocol"){rt.pulse=(rt.pulse+dt)%5;const ov=ensureBlackoutOverlay();ov.style.display="block";ov.style.opacity=rt.pulse<.7?String(.25+.45*rt.pulse/.7):"1"}
 else if(ev.id==="rift_network"){rt.shift-=dt;if(rt.shift<=0){rt.shift=7;apRecenterWorldGates(g,rt);apPairWorldGates(rt,(rt.pairMode||0)+1)}apStepWorldGates(g,rt,dt)}
 else if(ev.id==="echo_war")apEchoUpdate(g,rt,dt);
 else if(ev.id==="gold_rush")apGoldUpdate(g,rt,dt);
 else if(ev.id==="black_hole_tide")apBlackHoleUpdate(g,rt,dt);
}
function ensureBlackoutOverlay(){let o=document.getElementById("vsxBlackoutProtocolOverlay");if(!o){o=document.createElement("div");o.id="vsxBlackoutProtocolOverlay";document.body.appendChild(o)}return o}
function worldFinish(g,id,rt){
 if(!id||!rt)return;restoreTimeFracture(g);apRestoreGoldRush(g);if(!g.player){g.vsxNewWorldRuntime=null;return;}
 const ov=document.getElementById("vsxBlackoutProtocolOverlay");if(ov)ov.style.display="none";
 for(const e of g.enemies||[]){delete e.vsxCrowned;delete e.vsxGateLock;delete e.vsxGateHops}
 for(const list of [g.projectiles||[],g.enemyProjectiles||[]])for(const q of list){delete q.vsxGateLock;delete q.vsxGateHops;delete q.vsxBHSlingshot}
 if(g.player){delete g.player.vsxGateLock;delete g.player.vsxGateHops}
 const s=ensureRunStats(g);s.worldSet.add(id);VSX.save.meta.eventStats.worldEventsCompleted++;
 if(id==="moving_eye"){g.player.gainXP(65);if(rt.outside<2){award("eye_storm");eventChest()}}
 else if(id==="collapsing_grid"){g.player.gainXP(70);if(!rt.hit){award("floor_is_void");g.pickups.push(new Pickup(g.player.x-28,g.player.y,"golden_boost"))}}
 else if(id==="crown_hunt"){g.player.gainXP(20*rt.crowns);if(rt.crowns>=5){award("crown_breaker");eventChest()}}
 else if(id==="time_fracture"){g.player.gainXP(75);if(rt.slowTime>=5&&rt.fastTime>=5){award("time_lord");rewardWeaponLevel()}}
 else if(id==="blackout_protocol"){g.player.gainXP(60);eventChest()}
 else if(id==="rift_network"){g.player.gainXP(75);if((rt.playerTeleports||0)>=6)eventChest();VSX.save.meta.eventStats.worldEventBest[id]=Math.max(VSX.save.meta.eventStats.worldEventBest[id]||0,rt.playerTeleports||0)}
 else if(id==="echo_war"){g.player.gainXP(75);if((rt.echoes||0)>=20)eventChest();VSX.save.meta.eventStats.worldEventBest[id]=Math.max(VSX.save.meta.eventStats.worldEventBest[id]||0,rt.echoes||0)}
 else if(id==="gold_rush"){const tier=Number(rt.cashTier||rt.tier||1);g.player.gainXP(Math.round(32*tier));if(tier>=2)g.pickups.push(new Pickup(g.player.x-28,g.player.y,"golden_boost"));if(tier>=4)eventChest();if(tier>=5)rewardWeaponLevel();VSX.save.meta.eventStats.worldEventBest[id]=Math.max(VSX.save.meta.eventStats.worldEventBest[id]||0,tier)}
 else if(id==="black_hole_tide"){g.player.gainXP(75);if((rt.coreHits||0)===0){eventChest();if(!addPassiveLevel("magnetic_field"))g.pickups.push(new Pickup(g.player.x-28,g.player.y,"golden_boost"))}const score=Math.max(0,10-(rt.coreHits||0));VSX.save.meta.eventStats.worldEventBest[id]=Math.max(VSX.save.meta.eventStats.worldEventBest[id]||0,score)}
 if(rt.startedWithBoss||g.boss)award("crisis_manager");vsxSave();g.vsxNewWorldRuntime=null
}
function worldStatus(g){
 const rt=g.vsxNewWorldRuntime;if(!rt)return null;
 if(rt.id==="moving_eye")return `${L("OUTSIDE","BÊN NGOÀI")} ${rt.outside.toFixed(1)}s`;
 if(rt.id==="collapsing_grid")return rt.warn>0?L("TILES WARNING","Ô ĐANG CẢNH BÁO"):L("TILES COLLAPSED","Ô ĐÃ SỤP");
 if(rt.id==="crown_hunt")return `${L("CROWNS","VƯƠNG MIỆN")} ${rt.crowns}/5`;
 if(rt.id==="time_fracture")return `${L("SLOW","CHẬM")} ${rt.slowTime.toFixed(1)}s • ${L("FAST","NHANH")} ${rt.fastTime.toFixed(1)}s`;
 if(rt.id==="blackout_protocol"){const left=Math.max(0,5-(rt.pulse||0));return (rt.pulse||0)<.7?L("SCAN REVEAL NOW","ĐANG QUÉT SÁNG"):`${L("NEXT SCAN","LẦN QUÉT KẾ")} ${left.toFixed(1)}s`}
 if(rt.id==="rift_network")return `${L("GATES","CỔNG")} 4 • ${L("NETWORK SHIFT","ĐỔI MẠNG")} ${Math.max(0,rt.shift||0).toFixed(1)}s • ${L("JUMPS","LẦN XUYÊN")} ${rt.playerTeleports||0}`;
 if(rt.id==="echo_war")return `${L("ECHO","VỌNG ÂM")} 65% • ${L("ECHOES","VỌNG ẢNH")} ${rt.echoes||0} • ${L("PULSES","XUNG")} ${rt.fallbackPulses||0}`;
 if(rt.id==="gold_rush")return `${L("BOUNTY","THƯỞNG")} ×${Number(rt.tier||1).toFixed(1)} • ${L("THREAT","NGUY CƠ")} +${Math.round((rt.threat||0)*100)}% • ${L("CASH OUT","RÚT LUI")} ${rt.kills>0?L("OPEN","MỞ"):L("LOCKED","KHÓA")}`;
 if(rt.id==="black_hole_tide")return `${L("GRAVITY","TRỌNG LỰC")} ${Math.round((rt.gravity||0)*100)}% • ${L("CORE HITS","CHẠM LÕI")} ${rt.coreHits||0}`;
 return null
}
const UPDATE_BASE=Game.prototype.update;Game.prototype.update=function(dt){
 const beforeId=this.worldEvent?.id||null,beforeRt=this.vsxNewWorldRuntime,beforeBoss=!!this.boss;let eventFault=false;
 if(beforeId&&NEW_WORLD_IDS.includes(beforeId)){
  try{if(!beforeRt||beforeRt.id!==beforeId)worldInit(this,beforeId);worldPre(this,dt);if(this.worldEvent)this.worldEvent._vsxNewPreFaults=0}catch(err){eventFault=true;const ev=this.worldEvent;if(ev)ev._vsxNewPreFaults=(ev._vsxNewPreFaults||0)+1;console.error("[NEW WORLD EVENT PRE]",beforeId,`fault ${ev?._vsxNewPreFaults||1}/3`,err);try{window.VSX_RUNTIME_SAFETY?.state?.log?.push?.({ts:Date.now(),level:(ev?._vsxNewPreFaults||1)>=3?"ERROR":"WARN",code:(ev?._vsxNewPreFaults||1)>=3?"WORLD_NEW_PRE_FATAL":"WORLD_NEW_PRE_RETRY",character:this.characterId||"unknown",detail:String(err?.stack||err)})}catch{}if((ev?._vsxNewPreFaults||1)>=3){if(typeof abortWorldEvent==="function")abortWorldEvent("new-world-pre",err);else throw err}}
 }
 const r=UPDATE_BASE.apply(this,arguments);const afterId=this.worldEvent?.id||null;
 if(afterId){vsxDiscover("world_events",afterId);if(NEW_WORLD_IDS.includes(afterId)){try{if(!this.vsxNewWorldRuntime||this.vsxNewWorldRuntime.id!==afterId)worldInit(this,afterId);worldPost(this,dt);if(this.worldEvent)this.worldEvent._vsxNewPostFaults=0}catch(err){eventFault=true;const ev=this.worldEvent;if(ev)ev._vsxNewPostFaults=(ev._vsxNewPostFaults||0)+1;console.error("[NEW WORLD EVENT POST]",afterId,`fault ${ev?._vsxNewPostFaults||1}/3`,err);try{window.VSX_RUNTIME_SAFETY?.state?.log?.push?.({ts:Date.now(),level:(ev?._vsxNewPostFaults||1)>=3?"ERROR":"WARN",code:(ev?._vsxNewPostFaults||1)>=3?"WORLD_NEW_POST_FATAL":"WORLD_NEW_POST_RETRY",character:this.characterId||"unknown",detail:String(err?.stack||err)})}catch{}if((ev?._vsxNewPostFaults||1)>=3){if(typeof abortWorldEvent==="function")abortWorldEvent("new-world-post",err);else throw err}}}}
 const liveAfter=this.worldEvent?.id||null;
 if(!eventFault&&beforeId&&NEW_WORLD_IDS.includes(beforeId)&&liveAfter!==beforeId)worldFinish(this,beforeId,beforeRt||this.vsxNewWorldRuntime);
 else if(!eventFault&&beforeId&&!NEW_WORLD_IDS.includes(beforeId)&&liveAfter!==beforeId){const rs=ensureRunStats(this);rs.worldSet.add(beforeId);VSX.save.meta.eventStats.worldEventsCompleted++;if(beforeBoss)award("crisis_manager");vsxSave()}
 if(this.state==="PLAYING"&&this.player&&!this.worldEvent&&!this.vsxPendingEventBriefing&&!this.boss&&!this.miniBoss&&!VSX_TRIAL?.active&&!SM.active&&!window.VSX_VOID_RELAY_SERIES?.active){this.vsxMiniCooldown=Math.max(0,(this.vsxMiniCooldown??75)-dt);if(this.vsxMiniCooldown<=0&&miniSafe()){const id=pick(ALL_MINI_IDS);if(NEW_MINI_IDS.includes(id))startNewMini(id,false);else if(typeof VSX.startEventMinigame==="function")VSX.startEventMinigame(id);this.vsxMiniCooldown=rand(135,95)}}return r
};

const RENDER_BASE=Game.prototype.render;Game.prototype.render=function(){
 const r=RENDER_BASE.apply(this,arguments),ev=this.worldEvent,rt=this.vsxNewWorldRuntime;
 if(!ev||!rt||rt.id!==ev.id)return r;
 ctx.save();ctx.translate(-this.camera.x,-this.camera.y);
 if(ev.id==="moving_eye"){
  ctx.fillStyle="rgba(80,220,255,.05)";ctx.strokeStyle="#78e4ff";ctx.lineWidth=4;ctx.beginPath();ctx.arc(rt.cx,rt.cy,rt.r,0,Math.PI*2);ctx.fill();ctx.stroke()
 }else if(ev.id==="collapsing_grid"){
  for(const q of rt.tiles||[]){ctx.fillStyle=rt.warn>0?"rgba(255,190,80,.12)":"rgba(255,72,96,.20)";ctx.strokeStyle=rt.warn>0?"#ffc15d":"#ff536f";ctx.lineWidth=3;ctx.fillRect(q.x-68,q.y-68,136,136);ctx.strokeRect(q.x-68,q.y-68,136,136)}
 }else if(ev.id==="crown_hunt"&&rt.target&&!rt.target.dead){
  const e=rt.target;ctx.strokeStyle="#ffd75e";ctx.lineWidth=5;ctx.shadowBlur=15;ctx.shadowColor="#ffd75e";ctx.beginPath();ctx.arc(e.x,e.y,e.size+12,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle="#ffd75e";ctx.font="900 16px Arial";ctx.textAlign="center";ctx.fillText("♛",e.x,e.y-e.size-17)
 }else if(ev.id==="time_fracture"){
  for(const z of [{x:rt.sx,y:rt.sy,c:"#69d8ff",t:L("SLOW","CHẬM")},{x:rt.fx,y:rt.fy,c:"#ff8ad7",t:L("FAST","NHANH")}]){ctx.fillStyle=z.c+"18";ctx.strokeStyle=z.c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.x,z.y,135,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=z.c;ctx.font="900 10px Arial";ctx.textAlign="center";ctx.fillText(z.t,z.x,z.y-145)}
 }else if(ev.id==="rift_network"){
  for(const q of rt.gates||[])apDrawWorldGate(ctx,q)
 }else if(ev.id==="echo_war"){
  const qs=(rt.echoQueue||[]).slice(-28);ctx.save();ctx.globalCompositeOperation="screen";for(const s of qs){const a=clamp(1-(s.delay||0)/.95,.12,.75),ang=Math.atan2(s.vy||0,s.vx||1);ctx.globalAlpha=.18+.38*a;ctx.strokeStyle=s.owner==="player"?"#9bd9ff":"#ff9ab4";ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(s.x,s.y,6+5*a,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x+Math.cos(ang)*34,s.y+Math.sin(ang)*34);ctx.stroke()}ctx.restore();
 }else if(ev.id==="gold_rush"){
  for(const d of rt.drones||[]){if(d.dead)continue;ctx.save();ctx.translate(d.x,d.y);ctx.rotate((this.time||0)*1.4+d.turn);ctx.shadowBlur=16;ctx.shadowColor="#ffd45f";ctx.fillStyle="#ffd45f";ctx.strokeStyle="#fff0a2";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(13,0);ctx.lineTo(0,15);ctx.lineTo(-13,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();const hp=clamp(d.hp/Math.max(1,d.max),0,1);ctx.fillStyle="rgba(6,12,22,.82)";ctx.fillRect(d.x-18,d.y-24,36,4);ctx.fillStyle="#ffd45f";ctx.fillRect(d.x-18,d.y-24,36*hp,4)}
  if(rt.kills>0&&rt.cash){const p=.5+.5*Math.sin((this.time||0)*5);ctx.save();ctx.strokeStyle="#72f0b2";ctx.fillStyle="rgba(64,240,160,.07)";ctx.lineWidth=3;ctx.setLineDash([7,7]);ctx.beginPath();ctx.arc(rt.cash.x,rt.cash.y,38+p*4,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#cffff0";ctx.font="900 9px Arial";ctx.textAlign="center";ctx.fillText(L("CASH OUT","RÚT LUI"),rt.cash.x,rt.cash.y+3);ctx.restore()}
 }else if(ev.id==="black_hole_tide"){
  const pulse=.5+.5*Math.sin((this.time||0)*4);ctx.save();ctx.translate(rt.x,rt.y);const gr=ctx.createRadialGradient(0,0,14,0,0,120);gr.addColorStop(0,"rgba(5,2,16,.98)");gr.addColorStop(.23,"rgba(76,42,160,.72)");gr.addColorStop(.58,"rgba(155,124,255,.18)");gr.addColorStop(1,"rgba(155,124,255,0)");ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,120,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#a78bfa";ctx.globalAlpha=.72;ctx.lineWidth=3;ctx.setLineDash([9,11]);ctx.rotate((this.time||0)*.55);ctx.beginPath();ctx.arc(0,0,82+pulse*5,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;ctx.fillStyle="#020107";ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.fill();ctx.restore()
 }
 ctx.restore();
 if(ev.id==="rift_network"||ev.id==="gold_rush"||ev.id==="black_hole_tide")apDrawAnomalyMinimap(this,ev,rt);
 return r
};
const HUD_BASE=Game.prototype.updateHUD;Game.prototype.updateHUD=function(force=false){const r=HUD_BASE.apply(this,arguments);const ev=this.worldEvent,eh=document.getElementById("vsxEventHud");if(ev&&eh){const d=WORLD_EVENT_DEFINITIONS[ev.id];if(d&&!eh.querySelector(".vsxEvtTop")){const pct=100*clamp((ev.time||0)/(ev.max||d.duration||1),0,1),status=worldStatus(this)||d.desc?.[VSX.lang]||"";eh.style.display="block";eh.innerHTML=`<div class="vsxWorldEventHudTag">WORLD EVENT</div><div class="vsxEvtName">${VSX.esc(d.name?.[VSX.lang]||ev.id)}</div><div class="vsxEvtStatus"><b>${L("OBJECTIVE","MỤC TIÊU")}</b> ${VSX.esc(status)} • ${Math.max(0,ev.time||0).toFixed(1)}s</div><div class="vsxEvtProgress"><i style="width:${pct}%;background:${d.color||'#76dfff'}"></i></div>`}}return r};

/* Existing legacy minigame completion hook, used after old minigames were detached from World Event scheduling. */
window.VSX_MINIGAME_SYSTEM={defs:MINI_DEFS,ids:ALL_MINI_IDS,newIds:NEW_MINI_IDS,worldIds:()=>Object.entries(WORLD_EVENT_DEFINITIONS).filter(([,d])=>d?.type!=="minigame").map(([id])=>id),start(id,forced=true){if(!game.player||game.worldEvent)return false;if(VSX_ADMIN?.open)closeAdminSafe();if(forced&&game.state==="PAUSED"){document.getElementById("pauseScreen")?.classList.remove("active");game.state="PLAYING";game.input?.clear?.()}if(forced&&game.state==="ADMIN")game.state="PLAYING";if(NEW_MINI_IDS.includes(id))return startNewMini(id,forced);if(ALL_MINI_IDS.includes(id)&&typeof VSX.startEventMinigame==="function"){if(game.state!=="PLAYING")return false;vsxDiscover("minigames",id);return VSX.startEventMinigame(id)!==false}return false},end:()=>{if(SM.active)return endNewMini(false,{reason:"external-end"});if(game.state==="EVENT_MINIGAME"&&VSX.eventDebug?.endMini)return VSX.eventDebug.endMini(false);return false},recordLegacyResult(id,data,success){if(success)markMiniComplete(id,data||{})},resolveLegacySlot(d){const rw=d.stopped?.[2]||"CHEST";if(rw==="WEAPON")rewardWeaponLevel();else if(rw==="PASSIVE"){const ids=Object.keys(PASSIVE_DEFINITIONS).filter(x=>game.player.passiveLevel(x)<PASSIVE_DEFINITIONS[x].maxLevel);if(ids.length)addPassiveLevel(pick(ids));else eventChest()}else if(rw==="BOOST")game.pickups.push(new Pickup(game.player.x-30,game.player.y,"golden_boost"));else eventChest()},state:()=>({active:SM.active,id:SM.id,time:Number(SM.data?.time)||0,cooldown:game.vsxMiniCooldown,worldEvent:game.worldEvent?.id||null,session:SM.session,pendingTimers:SM.timers.size,lastError:SM.lastError,frameErrors:SM.frameErrors,surfaceActive:!!document.getElementById("vsxEventMinigame")?.classList.contains("active"),owner:document.getElementById("vsxEventMinigame")?.dataset.owner||null,lastEnd:SM.lastEnd}),selfTest(){return{minigames:ALL_MINI_IDS.length,newMinigames:NEW_MINI_IDS.length,newWorldEvents:NEW_WORLD_IDS.length,achievementsAdded:11,separatePool:!game.worldEvent||!ALL_MINI_IDS.includes(game.worldEvent.id),collectionMini:VSX.codexEntries("minigames").length,collectionWorld:VSX.codexEntries("world_events").length}}};

/* Public/Admin world-event gate: forced QA cannot start underneath Level Up, Minigame or another modal. Natural scheduler already has its own eventSafe gate. */
const START_WORLD_PUBLIC=VSX.startWorldEventId;
if(typeof START_WORLD_PUBLIC==="function")VSX.startWorldEventId=function(id,forced=false){if(game.state!=="PLAYING"||SM.active||game.state==="VSX_MINIGAME"||game.state==="EVENT_MINIGAME")return false;return START_WORLD_PUBLIC(id,forced)};

/* ---------- Admin Event Lab ---------- */
function injectEventLab(){const grid=document.querySelector("#vsxAdminContent .vsxAdminGrid");if(!grid||VSX_ADMIN?.tab!=="run"||document.getElementById("vsxEventLabAdmin"))return;const c=document.createElement("div");c.id="vsxEventLabAdmin";c.className="vsxAdminCard vsxEventLabCard";const worlds=Object.entries(WORLD_EVENT_DEFINITIONS).filter(([,d])=>d?.type!=="minigame");c.innerHTML=`<h3>${L("EVENT LAB · SEPARATED SYSTEMS","PHÒNG TEST EVENT · HỆ TÁCH RIÊNG")}</h3><p>${L("Minigames suspend combat. World Events modify the live battlefield. They never start on top of each other.","Minigame tạm dừng combat. World Event thay đổi chiến trường đang chạy. Hai hệ không bao giờ khởi động chồng nhau.")}</p><div class="vsxEventLabGrid"><div><label>MINIGAME</label><select id="admMiniLab">${ALL_MINI_IDS.map(id=>`<option value="${id}">${VSX.esc(MINI_DEFS[id].name[VSX.lang])} · ${MINI_DEFS[id].duration}s</option>`).join("")}</select><div class="row"><button id="admStartMiniLab">${L("START MINIGAME","BẮT ĐẦU MINIGAME")}</button></div></div><div><label>WORLD EVENT</label><select id="admWorldLab">${worlds.map(([id,d])=>`<option value="${id}">${VSX.esc(d.name?.[VSX.lang]||id)} · ${d.duration||0}s</option>`).join("")}</select><div class="row"><button id="admStartWorldLab">${L("START WORLD EVENT","BẮT ĐẦU WORLD EVENT")}</button><button id="admEndWorldLab">${L("END EVENT","KẾT THÚC EVENT")}</button></div></div></div><div class="vsxEventLabStatus"><span>${ALL_MINI_IDS.length} MINIGAMES</span><span>${worlds.length} WORLD EVENTS</span><span>${L("NO OVERLAP","KHÔNG CHỒNG HỆ")}</span></div>`;grid.appendChild(c);{const guideOk=worlds.filter(([,d])=>d?.how?.en&&d?.how?.vi).length;c.querySelector(".vsxEventLabStatus")?.insertAdjacentHTML("beforeend",`<span>${L("GUIDES","HƯỚNG DẪN")} ${guideOk}/${worlds.length}</span><span>${L("DIRECTOR","DIRECTOR")} 6s</span>`)}c.querySelector("#admStartMiniLab").onclick=()=>{const resume=VSX_ADMIN?.open?VSX_ADMIN.previousState:game.state;if(!game.player||!["PLAYING","PAUSED"].includes(resume))return VSX.announce("ADMIN",L("START A RUN FIRST","HÃY VÀO TRẬN TRƯỚC"),"#ff9b71");if(game.worldEvent)return VSX.announce("ADMIN",L("END WORLD EVENT FIRST","HÃY KẾT THÚC WORLD EVENT TRƯỚC"),"#ff9b71");const id=c.querySelector("#admMiniLab").value;closeAdminSafe();if(game.state==="PAUSED"){document.getElementById("pauseScreen")?.classList.remove("active");game.state="PLAYING"}setTimeout(()=>{const ok=VSX_MINIGAME_SYSTEM.start(id,true);if(!ok&&game.state==="ADMIN")game.state="PLAYING";if(!ok)VSX.announce("ADMIN",L("MINIGAME COULD NOT START","KHÔNG THỂ KHỞI ĐỘNG MINIGAME"),"#ff9b71")},0)};c.querySelector("#admStartWorldLab").onclick=()=>{const resume=VSX_ADMIN?.open?VSX_ADMIN.previousState:game.state;if(!game.player||!["PLAYING","PAUSED"].includes(resume))return VSX.announce("ADMIN",L("START A RUN FIRST","HÃY VÀO TRẬN TRƯỚC"),"#ff9b71");const id=c.querySelector("#admWorldLab").value;if(SM.active||game.state==="VSX_MINIGAME"||game.state==="EVENT_MINIGAME")return VSX.announce("ADMIN",L("END MINIGAME FIRST","HÃY KẾT THÚC MINIGAME TRƯỚC"),"#ff9b71");if(game.worldEvent)return VSX.announce("ADMIN",L("END CURRENT WORLD EVENT FIRST","HÃY KẾT THÚC WORLD EVENT HIỆN TẠI TRƯỚC"),"#ff9b71");closeAdminSafe();if(game.state==="PAUSED"){document.getElementById("pauseScreen")?.classList.remove("active");game.state="PLAYING"}setTimeout(()=>{const ok=VSX.startWorldEventId?.(id,true);if(!ok)VSX.announce("ADMIN",L("WORLD EVENT COULD NOT START","KHÔNG THỂ KHỞI ĐỘNG WORLD EVENT"),"#ff9b71")},0)};c.querySelector("#admEndWorldLab").onclick=()=>{if(game.worldEvent){const id=game.worldEvent.id,rt=game.vsxNewWorldRuntime;game.worldEvent=null;if(rt&&NEW_WORLD_IDS.includes(id))worldFinish(game,id,rt);game.updateHUD?.(true)}}}
if(window.VSX_ADMIN){const open=VSX_ADMIN.openPanel;if(typeof open==="function")VSX_ADMIN.openPanel=function(){const r=open.apply(this,arguments);queueMicrotask(injectEventLab);return r}}const ac=document.getElementById("vsxAdminContent");if(ac)new MutationObserver(()=>{if(VSX_ADMIN?.open)queueMicrotask(injectEventLab)}).observe(ac,{childList:true,subtree:false});

/* language refresh */
const LANG_BASE=vsxApplyLanguage;vsxApplyLanguage=function(){const r=LANG_BASE.apply(this,arguments);queueMicrotask(()=>{if(document.getElementById("vsxCollectionScreen")?.classList.contains("active"))buildSplitCollectionNav();if(VSX_ADMIN?.open){document.getElementById("vsxEventLabAdmin")?.remove();injectEventLab()}});return r};
window.VSX_EVENT_SPLIT_API={minigames:MINI_DEFS,newWorldEvents:WORLD_NEW,achievements:["riftwalker","gravity_favorite","clockwork_perfect","ghost_in_machine","house_edge","variety_hour","eye_storm","floor_is_void","crown_breaker","time_lord","crisis_manager"],collectionNav:buildSplitCollectionNav,admin:injectEventLab,debugMini:()=>SM.active?{id:SM.id,data:SM.data}:null,selfTest(){const miniIds=Object.keys(MINI_DEFS),worldIds=VSX_MINIGAME_SYSTEM.worldIds(),ach=this.achievements;return{minigames:miniIds.length,worldEvents:worldIds.length,newMinigames:NEW_MINI_IDS.length,newWorldEvents:NEW_WORLD_IDS.length,achievementsAdded:ach.length,duplicateIds:miniIds.filter(id=>worldIds.includes(id)),missingMiniDefs:miniIds.filter(id=>!MINI_DEFS[id]?.duration),missingWorldDefs:NEW_WORLD_IDS.filter(id=>!WORLD_EVENT_DEFINITIONS[id]?.duration),missingAchievements:ach.filter(id=>!ACHIEVEMENT_DEFINITIONS[id]),adminSeparated:![...document.querySelectorAll("#admEvent option")].some(o=>miniIds.includes(o.value))}}};

/* ---------- WORLD EVENT RELIABILITY + UNIVERSAL DURATION HUD ----------
   Final guard layer for every World Event family. The goal is simple:
   an event can never strand the game in ADMIN/EVENT_BRIEFING or leave
   persistent field modifiers behind after an abort/error. */
const WORLD_EVENT_IDS=()=>Object.entries(WORLD_EVENT_DEFINITIONS).filter(([,d])=>d?.type!=="minigame").map(([id])=>id);
const WORLD_FALLBACK_DURATION=25;
for(const [id,d] of Object.entries(WORLD_EVENT_DEFINITIONS)){
 if(d?.type==="minigame")continue;
 const n=Number(d?.duration);
 if(!Number.isFinite(n)||n<=0)d.duration=WORLD_FALLBACK_DURATION;
 /* Late normalization: newer World Events are registered after the original guide table.
    Every current/future event still receives bilingual HOW TO PLAY copy. */
 const guide=window.VSX_WORLD_EVENT_GUIDES?.[id];
 d.how||=guide?.how||d.desc||{en:"Adapt to the battlefield anomaly.",vi:"Thích nghi với dị thường chiến trường."};
 if(!d.reward&&guide?.reward)d.reward=guide.reward;
}
function clearWorldEventVisuals(g){
 try{restoreTimeFracture(g)}catch{}
 try{apRestoreGoldRush(g)}catch{}
 const ov=document.getElementById("vsxBlackoutProtocolOverlay");if(ov){ov.style.display="none";ov.style.opacity="0"}
 for(const e of g.enemies||[]){delete e.vsxCrowned;delete e.vsxPolarity;delete e.vsxWarTeam;delete e.vsxWarCaptain;delete e.vsxGateLock;delete e.vsxGateHops;if(e._tfBaseSpeed!=null){e.speed=e._tfBaseSpeed;delete e._tfBaseSpeed;delete e._tfFactor}if(e._grBaseSpeed!=null){e.speed=e._grBaseSpeed;delete e._grBaseSpeed}}
 for(const list of [g.projectiles||[],g.enemyProjectiles||[]])for(const q of list){if(q?._tfFactor){q.vx/=q._tfFactor;q.vy/=q._tfFactor;delete q._tfFactor}if(q){delete q.vsxPolarity;delete q.vsxGateLock;delete q.vsxGateHops;delete q.vsxBHSlingshot}}
 if(g.player){delete g.player.vsxGateLock;delete g.player.vsxGateHops}
 try{cleanupAdvanced(g)}catch{}
 for(const o of g.vsxEventObjects||[])if(o)o.dead=true;
 g.vsxEventObjects=[];g.vsxAdvancedEventObjects=[];g.nearExpandedEventInteractable=null;g.nearAdvancedEventInteractable=null;
 g.vsxBankedBullets=[];g.vsxHotCore=null;g.vsxPolarity=1;g.vsxNewWorldRuntime=null;
 try{g.player?.recalc?.()}catch{}
}
function hideWorldBriefing(g){
 document.getElementById("vsxEventBriefing")?.classList.remove("active");document.body.classList.remove("vsxBriefingOpen");
 g.vsxPendingEventBriefing=null;
 if(g.state==="EVENT_BRIEFING")g.state=g.player?"PLAYING":"TITLE";
}
function abortWorldEvent(reason="abort",err=null){
 const g=game,id=g.worldEvent?.id||g.vsxPendingEventBriefing||g.vsxNewWorldRuntime?.id||null;
 const snapshot=g.worldEvent?{...g.worldEvent}:null;
 g.worldEvent=null;hideWorldBriefing(g);clearWorldEventVisuals(g);
 g.eventSpawnTimer=0;g.vsxEventReady=false;g.vsxWorldCooldown=Math.max(30,g.vsxWorldCooldown||0);
 if(g.state==="ADMIN"&&!VSX_ADMIN?.open)g.state=g.player?"PLAYING":"TITLE";
 g.input?.clear?.();g.updateHUD?.(true);
 if(err){g.vsxWorldLastError=String(err?.stack||err);console.error("[WORLD EVENT RECOVERY]",id,reason,err)}
 return {id,reason,snapshot};
}
function worldObjective(g,ev,d){
 try{if(NEW_WORLD_IDS.includes(ev.id))return worldStatus(g)||d.desc?.[VSX.lang]||""}catch{}
 try{if(typeof ADV_EVENT_DEFS!=="undefined"&&ADV_EVENT_DEFS[ev.id]&&typeof eventStatus==="function")return eventStatus(g,ev)||d.desc?.[VSX.lang]||""}catch{}
 try{if(ev.id==="mountain_protocol"){const b=g.vsxEventObjects?.find(o=>o.kind==="mountain"&&!o.dead),dist=b&&g.player?Math.round(Math.hypot(b.x-g.player.x,b.y-g.player.y)):null;return ev.active?`${L("ELITE PRESSURE","ÁP LỰC ELITE")} • ${Math.max(0,ev.time||0).toFixed(1)}s`:`${L("BEACON","ĐÀI HIỆU")} ${dist==null?"—":dist+"px"} • E ${L("TO ACTIVATE","ĐỂ KÍCH HOẠT")}`}if(ev.id==="infernal_cache")return `${L("KILLS","HẠ GỤC")} ${Math.max(0,(g.kills||0)-(ev.startKills||0))}/${ev.goal||40}`;if(ev.id==="rift_breach")return `${L("SEALED RIFTS","KHE ĐÃ ĐÓNG")} ${ev.closed||0}/3`;if(ev.id==="kill_chain")return `${L("CHAIN","CHUỖI")} ${ev.chain||0} • ${L("BEST","CAO NHẤT")} ${ev.best||0}`;if(ev.id==="bullet_bank")return `${L("STORED SHOTS","ĐẠN TÍCH TRỮ")} ${(g.vsxBankedBullets||[]).filter(x=>!x.dead).length}`;if(ev.id==="gravity_storm")return `${L("GRAVITY CORES","LÕI TRỌNG LỰC")} ${(g.vsxEventObjects||[]).filter(o=>o instanceof VSX_GravityCore&&!o.dead).length}`}catch{}
 return d.desc?.[VSX.lang]||d.desc?.en||"";
}
function worldHowToPlay(ev,d){const guide=window.VSX_WORLD_EVENT_GUIDES?.[ev.id];return d.how?.[VSX.lang]||guide?.how?.[VSX.lang]||d.desc?.[VSX.lang]||d.desc?.en||""}
function renderUniversalWorldHud(g){
 const eh=document.getElementById("vsxEventHud"),ev=g.worldEvent;if(!eh)return;
 if(!ev||g.state==="EVENT_BRIEFING")return;
 const d=WORLD_EVENT_DEFINITIONS[ev.id];if(!d)return;
 let total=Number(ev.max);if(!Number.isFinite(total)||total<=0)total=Number(d.duration)||WORLD_FALLBACK_DURATION;
 let rem=Number(ev.time);if(!Number.isFinite(rem)){rem=total;ev.time=rem}if(!Number.isFinite(ev.max)||ev.max<=0)ev.max=total;
 const pct=100*clamp(rem/Math.max(.001,total),0,1),color=d.color||"#76dfff",status=worldObjective(g,ev,d),how=worldHowToPlay(ev,d);
 const sec=Math.max(0,rem),timeText=sec.toFixed(1)+"s",showLive=status&&status!==how;
 eh.style.display="block";eh.style.borderColor=color;eh.style.boxShadow=`0 8px 28px rgba(0,0,0,.30),0 0 18px ${color}22`;
 eh.innerHTML=`<div class="vsxWorldEventHudHead"><span class="vsxWorldEventHudTag">${L("WORLD EVENT","SỰ KIỆN THẾ GIỚI")}</span><span class="vsxWorldEventHudTime">${timeText}</span></div><div class="vsxEvtName">${VSX.esc(d.name?.[VSX.lang]||ev.id)}</div><div class="vsxEvtStatus"><b>${L("HOW","CÁCH CHƠI")}</b> ${VSX.esc(how)}</div>${showLive?`<div class="vsxWorldEventHudLive"><b>${L("LIVE","TRẠNG THÁI")}</b> ${VSX.esc(status)}</div>`:""}<div class="vsxEvtProgress"><i style="width:${pct}%;background:${color};color:${color}"></i></div><div class="vsxWorldEventHudFoot"><span>${L("REMAINING","CÒN LẠI")} ${timeText}</span><span>${L("DURATION","THỜI LƯỢNG")} ${Math.round(total)}s</span></div>`;
}
/* Time Fracture is the only new field event that touches every active entity.
   Run its zone recalculation at 20 Hz to avoid an avoidable per-frame spike
   when Admin stress tests hundreds of enemies/projectiles. */
const WORLD_PRE_FULLRATE=worldPre;
worldPre=function(g,dt){
 if(g.worldEvent?.id==="time_fracture"&&g.vsxNewWorldRuntime){const rt=g.vsxNewWorldRuntime;rt._safeStep=(rt._safeStep||0)+dt;if(rt._safeStep<.05)return;const step=Math.min(.12,rt._safeStep);rt._safeStep=0;return WORLD_PRE_FULLRATE(g,step)}
 return WORLD_PRE_FULLRATE(g,dt)
};
/* Universal update fail-safe. Any exception while a World Event is active
   aborts only the event and lets the next gameplay frame continue. */
const WORLD_SAFE_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
 const activeBefore=this.worldEvent?.id||null;
 try{
   const r=WORLD_SAFE_UPDATE_BASE.apply(this,arguments);
   const ev=this.worldEvent;if(ev){const d=WORLD_EVENT_DEFINITIONS[ev.id];if(d){if(!Number.isFinite(ev.max)||ev.max<=0)ev.max=Number(d.duration)||WORLD_FALLBACK_DURATION;if(!Number.isFinite(ev.time))ev.time=ev.max}}
   return r;
 }catch(err){
   /* Do NOT abort a healthy event because an unrelated character/ally/global subsystem threw.
      Event-specific update paths have their own boundaries above; the full-roster runtime safety
      outside this wrapper owns generic Game.update recovery. */
   if(activeBefore||this.worldEvent||this.vsxPendingEventBriefing){this.vsxWorldLastErrorContext=String(err?.stack||err);console.error("[WORLD EVENT CONTEXT · GLOBAL UPDATE ERROR]",activeBefore||this.worldEvent?.id||this.vsxPendingEventBriefing,err)}
   throw err;
 }
};
const WORLD_SAFE_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force=false){const r=WORLD_SAFE_HUD_BASE.apply(this,arguments);try{renderUniversalWorldHud(this)}catch(err){console.error("[WORLD EVENT HUD RECOVERY]",err)}return r};
/* Replace the public forced-start gate with a state-safe version. Natural
   scheduler behavior is unchanged; Admin starts close their modal first. */
const WORLD_SAFE_START_BASE=VSX.startWorldEventId;
VSX.startWorldEventId=function(id,forced=false){
 const d=WORLD_EVENT_DEFINITIONS[id];if(!d||d.type==="minigame"||!game.player)return false;
 if(SM.active||game.state==="VSX_MINIGAME"||game.state==="EVENT_MINIGAME")return false;
 if(forced&&VSX_ADMIN?.open)closeAdminSafe();
 if(forced&&game.state==="PAUSED"){document.getElementById("pauseScreen")?.classList.remove("active");game.state="PLAYING";game.input?.clear?.()}
 if(forced&&game.state==="ADMIN"){game.state="PLAYING";game.input?.clear?.()}
 if(game.state!=="PLAYING")return false;
 if(game.worldEvent)abortWorldEvent("replace");
 let ok=false;try{ok=WORLD_SAFE_START_BASE?.(id,forced)!==false}catch(err){abortWorldEvent("start-error",err);return false}
 if(ok&&game.worldEvent){game.worldEvent.max=Number(game.worldEvent.max)||Number(d.duration)||WORLD_FALLBACK_DURATION;game.worldEvent.time=Number.isFinite(Number(game.worldEvent.time))?Number(game.worldEvent.time):game.worldEvent.max;vsxDiscover("world_events",id);game.updateHUD?.(true)}
 return !!ok;
};
/* Old Boss-tab Admin controls now use the same safe launch path instead of
   constructing a World Event while game.state is still ADMIN. */
try{adminForceEvent=function(id){if(!game.player)return false;closeAdminSafe();if(game.state==="PAUSED")game.state="PLAYING";return VSX.startWorldEventId(id,true)}}catch{}
/* The legacy STOP EVENT path calls vsxFinishExpandedEvent after clearing the
   event. Teach it to clean the five new field events as well. */
try{const WORLD_FINISH_EXP_BASE=vsxFinishExpandedEvent;vsxFinishExpandedEvent=function(g,prev){if(prev&&NEW_WORLD_IDS.includes(prev.id)){const rt=g.vsxNewWorldRuntime;if(rt&&rt.id===prev.id)worldFinish(g,prev.id,rt);else clearWorldEventVisuals(g);return}return WORLD_FINISH_EXP_BASE(g,prev)}}catch{}
/* Rebind Event Lab END to a single idempotent abort routine so every event
   family cleans up the same way. */
const WORLD_EVENT_LAB_BASE=injectEventLab;
injectEventLab=function(){WORLD_EVENT_LAB_BASE();const b=document.getElementById("admEndWorldLab");if(b)b.onclick=()=>{if(game.worldEvent||game.vsxPendingEventBriefing)abortWorldEvent("admin-stop")}};
window.VSX_WORLD_EVENT_SYSTEM={
 ids:WORLD_EVENT_IDS,
 definitions:WORLD_EVENT_DEFINITIONS,
 start:(id,forced=true)=>VSX.startWorldEventId(id,forced),
 end:(reason="manual")=>abortWorldEvent(reason),
 active:()=>game.worldEvent?{id:game.worldEvent.id,time:game.worldEvent.time,max:game.worldEvent.max,state:game.state}:null,
 lastError:()=>game.vsxWorldLastError||null,
 selfTest(){const ids=WORLD_EVENT_IDS(),bad=ids.filter(id=>!Number.isFinite(Number(WORLD_EVENT_DEFINITIONS[id]?.duration))||Number(WORLD_EVENT_DEFINITIONS[id]?.duration)<=0),missingHow=ids.filter(id=>!WORLD_EVENT_DEFINITIONS[id]?.how?.en||!WORLD_EVENT_DEFINITIONS[id]?.how?.vi);return{worldEvents:ids.length,missingDuration:bad,missingHow,guideCoverage:`${ids.length-missingHow.length}/${ids.length}`,active:this.active(),hud:!!document.getElementById("vsxEventHud"),blackoutOverlayParent:document.getElementById("vsxBlackoutProtocolOverlay")?.parentElement?.tagName||null,echoFallback:true,mountainProxyInteract:!!window.VSX_EVENT_PROXY_SAFE,directorGap:window.VSX_ENCOUNTER_DIRECTOR?.policy?.idleGapSeconds||null,minigameOverlap:!!(game.worldEvent&&(SM.active||game.state==="VSX_MINIGAME"||game.state==="EVENT_MINIGAME"))}}
};


window.VSX_ANOMALY_PROTOCOL={
 version:"1.0.0",
 minigames:["shadow_replay","void_pinball_gate","core_heist","phase_chaser"],
 worldEvents:["rift_network","echo_war","gold_rush","black_hole_tide"],
 limits:{worldGateProjectileHops:6,echoQueue:120,echoTokenRate:14,shadowCount:5,goldDrones:2},
 selfTest(){
  const miniMissing=this.minigames.filter(id=>!MINI_DEFS[id]||!ALL_MINI_IDS.includes(id));
  const worldMissing=this.worldEvents.filter(id=>!WORLD_EVENT_DEFINITIONS[id]||!NEW_WORLD_IDS.includes(id));
  const badDur=[...this.minigames.map(id=>MINI_DEFS[id]),...this.worldEvents.map(id=>WORLD_EVENT_DEFINITIONS[id])].filter(d=>!Number.isFinite(Number(d?.duration))||Number(d.duration)<=0).length;
  return{
   miniMissing,worldMissing,badDuration:badDur,
   collectionMini:VSX.codexEntries("minigames").filter(r=>this.minigames.includes(r[0])).length,
   collectionWorld:VSX.codexEntries("world_events").filter(r=>this.worldEvents.includes(r[0])).length,
   overlap:!!(game.worldEvent&&(SM.active||game.state==="VSX_MINIGAME"||game.state==="EVENT_MINIGAME")),
   activeMini:SM.active?SM.id:null,activeWorld:game.worldEvent?.id||null
  }
 }
};

})();
