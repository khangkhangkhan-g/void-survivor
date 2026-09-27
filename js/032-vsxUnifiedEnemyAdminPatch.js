(function(){
"use strict";

/* =========================================================
   UNIFIED ADMIN ENEMY SPAWNER + COMPLETE ENEMY COLLECTION
   ========================================================= */
const A=window.VSX_ADMIN;
if(A){
  A.enemySelection=A.enemySelection instanceof Set?A.enemySelection:new Set(["grunt"]);
  A.enemySpawnCount=Math.max(1,Math.min(100,Number(A.enemySpawnCount)||10));
  A.enemyMoveSpeed=Math.max(.25,Math.min(5,Number(A.enemyMoveSpeed)||1));
  A.enemyAttackSpeed=Math.max(.25,Math.min(5,Number(A.enemyAttackSpeed)||1));
  A.enemyPower=Math.max(.25,Math.min(5,Number(A.enemyPower)||1));
  A.enemySize=Math.max(1,Math.min(5,Number(A.enemySize)||1));
  A.enemyElite=!!A.enemyElite;
  A.enemySearch=A.enemySearch||"";
}

const BASE_ENEMY_INFO={
 grunt:{name:{en:"Grunt",vi:"Bộ Binh"},wave:1,desc:{en:"Basic pursuer. Walks directly toward the survivor and deals contact damage; dangerous mainly when it fills space around harder enemies.",vi:"Kẻ truy đuổi cơ bản. Đi thẳng về phía người chơi và gây sát thương khi chạm; nguy hiểm nhất khi lấp kín khoảng trống quanh các địch chuyên biệt."}},
 swarmer:{name:{en:"Swarmer",vi:"Bầy Con"},wave:1,desc:{en:"Tiny, low-HP pressure unit that closes quickly in groups. Individually weak, but swarms punish narrow escape routes.",vi:"Đơn vị nhỏ, ít máu, áp sát theo bầy. Từng con yếu nhưng số đông sẽ khóa những đường thoát hẹp."}},
 runner:{name:{en:"Runner",vi:"Kẻ Chạy Nhanh"},wave:2,desc:{en:"Fast contact attacker with little durability. It tries to reach the survivor before slower enemies can form a wall around you.",vi:"Kẻ áp sát tốc độ cao nhưng khá mỏng. Nó cố chạm người chơi trước khi các địch chậm hơn dựng thành vòng vây."}},
 tank:{name:{en:"Tank",vi:"Thiết Giáp"},wave:3,desc:{en:"Slow, heavy body with high HP and knockback resistance. It advances relentlessly and turns crowded lanes into moving walls.",vi:"Chậm nhưng nhiều máu và kháng hất văng cao. Nó tiến đều để biến các lối đông địch thành những bức tường di động."}},
 charger:{name:{en:"Charger",vi:"Kẻ Xung Phong"},wave:3,desc:{en:"Alternates between a slow approach and a telegraphed high-speed charge. Sidestep the committed line rather than outrunning it.",vi:"Luân phiên áp sát chậm và lao thẳng tốc độ cao sau tín hiệu báo trước. Nên né ngang đường lao thay vì cố chạy đua."}},
 shooter:{name:{en:"Shooter",vi:"Xạ Kích"},wave:3,desc:{en:"Maintains medium range and repeatedly fires hostile bolts. It backs away when you get too close and advances when you leave its firing range.",vi:"Giữ cự ly trung bình và liên tục bắn đạn thù địch. Nó lùi khi bạn áp sát và tiến lên khi bạn ra ngoài tầm bắn."}},
 splitter:{name:{en:"Splitter",vi:"Thể Phân Tách"},wave:4,desc:{en:"A medium bruiser that splits into three Swarmers on death. Killing several at once can suddenly multiply local enemy density.",vi:"Địch tầm trung tách thành ba Bầy Con khi chết. Hạ nhiều con cùng lúc có thể khiến mật độ địch quanh bạn tăng đột ngột."}},
 shielded:{name:{en:"Shielded",vi:"Kẻ Khiên Pha"},wave:4,desc:{en:"Periodically toggles a defensive shield. While active, the shield heavily reduces incoming damage, rewarding timing or sustained pressure.",vi:"Định kỳ bật/tắt một lớp khiên phòng thủ. Khi khiên hoạt động, sát thương nhận vào giảm mạnh, buộc người chơi chọn nhịp tấn công hợp lý."}},
 exploder:{name:{en:"Exploder",vi:"Kẻ Tự Bạo"},wave:4,desc:{en:"Rushes into contact range and detonates. The blast deals heavy close-range damage, so spacing matters more than raw DPS.",vi:"Lao vào cự ly áp sát rồi tự kích nổ. Vụ nổ gây sát thương lớn ở gần, nên giữ khoảng cách quan trọng hơn việc chỉ dồn DPS."}},
 teleporter:{name:{en:"Teleporter",vi:"Kẻ Dịch Chuyển"},wave:5,desc:{en:"Approaches slowly, then periodically teleports to a new position around the survivor. It attacks by breaking predictable safe spacing.",vi:"Áp sát chậm rồi định kỳ dịch chuyển sang vị trí mới quanh người chơi. Nó phá những khoảng cách an toàn cố định và buộc bạn đọc lại hướng nguy hiểm."}},
 ronaldo:{name:{en:"Ronaldo Encounter",vi:"Đối Thủ Ronaldo"},wave:1,desc:{en:"Special football encounter. A fast, durable pursuer that pressures through direct contact until defeated as part of the legend encounter.",vi:"Encounter bóng đá đặc biệt. Đối thủ nhanh và bền, liên tục áp sát gây sát thương tiếp xúc cho đến khi bị hạ trong encounter huyền thoại."}},
 messi:{name:{en:"Messi Encounter",vi:"Đối Thủ Messi"},wave:2,desc:{en:"Special football encounter. Agile contact pressure with high durability; defeating him advances the football legend progression.",vi:"Encounter bóng đá đặc biệt. Cơ động, bền và gây áp lực áp sát; hạ mục tiêu sẽ tiến triển chuỗi huyền thoại bóng đá."}},
 mbappe_cell:{name:{en:"Mbappé Prison Cell",vi:"Lồng Giam Mbappé"},wave:1,desc:{en:"A captive objective rather than a hostile attacker. Break the prison cell to rescue MB9 and convert the encounter into an ally reward.",vi:"Mục tiêu giải cứu chứ không phải kẻ tấn công. Phá lồng giam để cứu MB9 và biến encounter thành phần thưởng đồng minh."}},
 mini_juggernaut:{name:{en:"Juggernaut",vi:"Cỗ Xe Ủi"},wave:1,desc:{en:"Mini-boss bruiser. Chases aggressively and periodically telegraphs a crushing forward impact that produces a heavy shockwave.",vi:"Tiểu Boss cận chiến. Truy đuổi quyết liệt và định kỳ báo trước một cú lao nghiền mạnh tạo sóng xung kích lớn."}},
 mini_sniper:{name:{en:"Sniper",vi:"Xạ Thủ"},wave:1,desc:{en:"Mini-boss ranged specialist. Keeps long range, paints a line telegraph, then fires a high-speed precision shot.",vi:"Tiểu Boss đánh xa. Giữ khoảng cách, khóa đường ngắm bằng telegraph rồi bắn phát đạn chính xác tốc độ cao."}},
 mini_summoner:{name:{en:"Summoner",vi:"Kẻ Triệu Hồi"},wave:1,desc:{en:"Mini-boss support unit. Periodically summons groups of normal enemies, increasing board density until the Summoner is prioritized.",vi:"Tiểu Boss hỗ trợ. Định kỳ triệu hồi nhóm địch thường, làm chiến trường ngày càng đông nếu người chơi không ưu tiên hạ nó."}},
 mini_shield_commander:{name:{en:"Shield Commander",vi:"Chỉ Huy Khiên"},wave:1,desc:{en:"Mini-boss support commander. Advances with the formation and periodically grants shields to nearby enemies.",vi:"Tiểu Boss chỉ huy hỗ trợ. Tiến cùng đội hình và định kỳ cấp khiên cho những kẻ địch xung quanh."}},
 mini_assassin:{name:{en:"Assassin",vi:"Sát Thủ"},wave:1,desc:{en:"Very fast mini-boss that closes distance and telegraphs sudden lunges, punishing stationary or repetitive movement.",vi:"Tiểu Boss cực nhanh, áp sát và báo trước các cú lướt đột kích, trừng phạt việc đứng yên hoặc di chuyển quá lặp lại."}},
 mini_necromancer:{name:{en:"Necromancer",vi:"Kẻ Gọi Hồn"},wave:1,desc:{en:"Mini-boss summoner that reconstructs recently slain enemy types around itself. Leaving it alive lets previous threats return.",vi:"Tiểu Boss triệu hồi có thể dựng lại những loại địch vừa bị tiêu diệt. Để nó sống lâu sẽ khiến các mối đe dọa cũ quay trở lại."}}
};

function enemyName(id){
 const m=BASE_ENEMY_INFO[id];if(m)return m.name[VSX.lang]||m.name.en;
 const e10=window.VSX_ENEMY10?.meta?.[id]?.name?.[VSX.lang];if(e10)return e10;
 const e31=window.VSX_ENEMY31?.meta?.[id]?.name?.[VSX.lang];if(e31)return e31;
 const d=ENEMY_DEFINITIONS[id];if(d){if(typeof d.name==="object")return d.name[VSX.lang]||d.name.en||id;return d.name||id}
 if(id.startsWith("mini_")){const k=id.slice(5),d=MINIBOSS_DEFINITIONS[k];if(d)return d.name?.[VSX.lang]||d.name?.en||k}
 return id;
}
function spawnableEnemyIds(){
 return Object.entries(ENEMY_DEFINITIONS).filter(([id,d])=>d&&!d.special&&!d.captive&&d.behavior!=="captive").map(([id])=>id).sort((a,b)=>{
   const da=ENEMY_DEFINITIONS[a],db=ENEMY_DEFINITIONS[b],ta=Number(da.minimumTime)||0,tb=Number(db.minimumTime)||0;
   return ta-tb||enemyName(a).localeCompare(enemyName(b),VSX.lang==="vi"?"vi":"en");
 });
}
function waveFromDef(id){const d=ENEMY_DEFINITIONS[id];return d?Math.max(1,1+Math.floor((Number(d.minimumTime)||0)/60)):1}
function currentEnemySelection(){if(!(A.enemySelection instanceof Set))A.enemySelection=new Set(A.enemySelection||[]);return A.enemySelection}

function applyAdminEnemyTuning(e,inheritFrom=null){
 if(!e||e.isBoss||e.isMiniBoss)return e;
 if(inheritFrom?.vsxAdminSpawned&&!e.vsxAdminSpawned)e.vsxAdminInherited=true;
 e.vsxAdminSpawned=true;
 if(!e.vsxAdminBase){e.vsxAdminBase={size:e.size,speed:e.speed,damage:e.damage,maxHp:e.maxHp,knockbackResistance:e.knockbackResistance||0}}
 const b=e.vsxAdminBase,move=Number(A.enemyMoveSpeed)||1,power=Number(A.enemyPower)||1,size=Number(A.enemySize)||1,atk=Number(A.enemyAttackSpeed)||1;
 const oldMax=Math.max(1,e.maxHp||b.maxHp),ratio=Math.max(0,Math.min(1,(e.hp??oldMax)/oldMax)),strength=Math.max(.0625,power*size);
 e.size=b.size*size;e.speed=b.speed*move;e.damage=b.damage*strength;e.maxHp=b.maxHp*strength;e.hp=Math.max(1,e.maxHp*ratio);e.knockbackResistance=Math.min(.96,b.knockbackResistance+(size-1)*.055);e.vsxAdminAttackSpeed=atk;e.vsxAdminTune={move,atk,power,size,strength};return e
}
function retuneAdminEnemies(){for(const e of game?.enemies||[])if(e.vsxAdminSpawned&&!e.dead)applyAdminEnemyTuning(e)}

/* Attack cadence multiplier for Admin-spawned enemies only.
   We accelerate AI time while compensating speed, so movement remains governed by Move Speed. */
const UEA_STATUS_BASE=Enemy.prototype.updateStatus;
Enemy.prototype.updateStatus=function(dt){const a=this.vsxAdminSpawned?Math.max(.25,Number(this.vsxAdminAttackSpeed)||1):1;return UEA_STATUS_BASE.call(this,dt/a)};
const UEA_UPDATE_BASE=Enemy.prototype.update;
Enemy.prototype.update=function(dt){
 if(!this.vsxAdminSpawned)return UEA_UPDATE_BASE.call(this,dt);
 const a=Math.max(.25,Number(this.vsxAdminAttackSpeed)||1),savedSpeed=this.speed,before=game?.enemies?.length||0;this.speed=savedSpeed/a;
 let r;try{r=UEA_UPDATE_BASE.call(this,dt*a)}finally{this.speed=savedSpeed}
 if(game?.enemies?.length>before){for(let i=before;i<game.enemies.length;i++){const child=game.enemies[i];if(child&&!child.isBoss&&!child.isMiniBoss&&!child.vsxAdminSpawned)applyAdminEnemyTuning(child,this)}}return r
};
const UEA_DAMAGE_BASE=Game.prototype.damageEnemy;
Game.prototype.damageEnemy=function(e,a,o={}){const before=this.enemies?.length||0,inherit=!!e?.vsxAdminSpawned,r=UEA_DAMAGE_BASE.call(this,e,a,o);if(inherit&&this.enemies?.length>before){for(let i=before;i<this.enemies.length;i++){const child=this.enemies[i];if(child&&!child.isBoss&&!child.isMiniBoss&&!child.vsxAdminSpawned)applyAdminEnemyTuning(child,e)}}return r};

function adminSpawnEnemy(id,elite=false){
 const p=game?.player,d=ENEMY_DEFINITIONS[id];if(!p||!d)return null;const a=Math.random()*Math.PI*2,r=rand(610,235),mod=elite?pick(["Swift","Giant","Regenerating","Explosive","Shielded","Frenzied"]):null;
 const e=vsxApplyDifficulty(new Enemy(id,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,game.difficulty,mod));applyAdminEnemyTuning(e);game.enemies.push(e);return e
}
function spawnBatch(ids,count,randomAll=false){
 if(!game?.player)return 0;const pool=randomAll?spawnableEnemyIds():ids.filter(id=>ENEMY_DEFINITIONS[id]&&!ENEMY_DEFINITIONS[id].special);if(!pool.length)return 0;let made=0;
 for(let i=0;i<count;i++){const id=randomAll?pool[Math.floor(Math.random()*pool.length)]:pool[i%pool.length];if(adminSpawnEnemy(id,A.enemyElite))made++}
 VSX.announce("ADMIN",`${VSX.lang==="vi"?"ĐÃ SPAWN":"SPAWNED"} ${made} ${VSX.lang==="vi"?"KẺ ĐỊCH":"ENEMIES"}`,"#73eeb8");return made
}

function enemyRange(id,label,min,max,step,val){return `<div class="vsxAdminEnemyRange"><div><label>${label}</label><output id="${id}Out">${Number(val).toFixed(2)}x</output></div><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></div>`}
function buildUnifiedSpawnUI(){
 if(!A?.open||A.tab!=="spawn")return;const root=document.querySelector("#vsxAdminContent .vsxAdminGrid");if(!root)return;
 const ids=spawnableEnemyIds(),sel=currentEnemySelection();for(const x of [...sel])if(!ids.includes(x))sel.delete(x);
 const q=(A.enemySearch||"").trim().toLowerCase(),visible=ids;
 const threat=window.VSX_ENEMY31?.state?.();
 root.innerHTML=`<div class="vsxAdminCard vsxEnemySpawnerWide" id="vsxUnifiedEnemySpawner"><h3>${VSX.lang==="vi"?"ENEMY SPAWNER THỐNG NHẤT":"UNIFIED ENEMY SPAWNER"}</h3>
 <div class="vsxEnemySpawnToolbar"><input id="admEnemySearchUnified" type="search" placeholder="${VSX.lang==="vi"?"Tìm enemy...":"Search enemies..."}" value="${VSX.esc(A.enemySearch||"")}"><button id="admEnemySelectAll">${VSX.lang==="vi"?"CHỌN TẤT CẢ":"SELECT ALL"}</button><button id="admEnemyClearSelection">${VSX.lang==="vi"?"BỎ CHỌN":"CLEAR"}</button></div>
 <div class="vsxEnemySelectMeta"><span>${VSX.lang==="vi"?"Chọn nhiều loại rồi Spawn Selected; enemy thêm về sau tự xuất hiện trong grid này.":"Select multiple types, then Spawn Selected. Future enemy definitions automatically appear in this grid."}</span><b id="admEnemySelectedCount">${sel.size}/${ids.length}</b></div>
 <div class="vsxEnemySelectGrid" id="admEnemySelectGrid">${visible.map(id=>{const d=ENEMY_DEFINITIONS[id],checked=sel.has(id),w=waveFromDef(id);return `<label class="vsxEnemyPick ${checked?"selected":""}" data-enemy-pick="${id}" style="${q&&!enemyName(id).toLowerCase().includes(q)&&!id.toLowerCase().includes(q)?"display:none":""}"><input type="checkbox" value="${id}" ${checked?"checked":""}><span>${VSX.esc(enemyName(id))}<small>W${w} · ${VSX.esc(d.behavior||"enemy")}</small></span></label>`}).join("")||`<small>${VSX.lang==="vi"?"Không tìm thấy enemy.":"No enemies match."}</small>`}</div>
 <div class="vsxEnemySpawnControls"><div class="vsxEnemyTuneBox"><strong>${VSX.lang==="vi"?"SPAWN CONTROL":"SPAWN CONTROL"}</strong>
 ${enemyRange("admEnemyCountUnified",VSX.lang==="vi"?"Số lượng (tối đa 100)":"Quantity (max 100)",1,100,1,A.enemySpawnCount).replace(Number(A.enemySpawnCount).toFixed(2)+"x",String(A.enemySpawnCount))}
 <label class="vsxAdminToggle"><span>Elite</span><input id="admEnemyEliteUnified" type="checkbox" ${A.enemyElite?"checked":""}></label>
 <div class="vsxEnemySpawnActions"><button id="admSpawnSelectedUnified">${VSX.lang==="vi"?"SPAWN ĐÃ CHỌN":"SPAWN SELECTED"}</button><button id="admSpawnRandomUnified">${VSX.lang==="vi"?"SPAWN RANDOM TẤT CẢ":"SPAWN RANDOM · ALL TYPES"}</button><button id="admClearEnemiesUnified">${VSX.lang==="vi"?"XÓA ĐỊCH":"CLEAR ENEMIES"}</button><button id="admClearBulletsUnified">${VSX.lang==="vi"?"XÓA ĐẠN ĐỊCH":"CLEAR HOSTILE BULLETS"}</button></div></div>
 <div class="vsxEnemyTuneBox"><strong>${VSX.lang==="vi"?"ENEMY TUNING · ADMIN SPAWN":"ENEMY TUNING · ADMIN SPAWN"}</strong>
 ${enemyRange("admEnemyMoveUnified",VSX.lang==="vi"?"Tốc chạy":"Move Speed",.25,5,.05,A.enemyMoveSpeed)}
 ${enemyRange("admEnemyAttackUnified",VSX.lang==="vi"?"Tốc đánh / nhịp kỹ năng":"Attack / Ability Rate",.25,5,.05,A.enemyAttackSpeed)}
 ${enemyRange("admEnemyPowerUnified",VSX.lang==="vi"?"Sức mạnh":"Power",.25,5,.05,A.enemyPower)}
 ${enemyRange("admEnemySizeUnified",VSX.lang==="vi"?"Độ lớn":"Size",1,5,.05,A.enemySize)}
 <div class="vsxEnemyTuningSummary" id="admEnemyTuningSummary"></div><button id="admEnemyResetTuning" style="width:100%;margin-top:7px">${VSX.lang==="vi"?"RESET ENEMY TUNING":"RESET ENEMY TUNING"}</button></div></div>
 <div class="vsxEnemyDiagnostics"><div><small>${VSX.lang==="vi"?"Địch trên sân":"Enemies"}</small><b>${game.enemies?.filter(e=>!e.dead).length||0}</b></div><div><small>${VSX.lang==="vi"?"Admin spawn":"Admin spawned"}</small><b>${game.enemies?.filter(e=>!e.dead&&e.vsxAdminSpawned).length||0}</b></div><div><small>Threat</small><b>${threat?threat.cost.toFixed(1)+" / "+threat.budget.toFixed(1):"—"}</b></div><div><small>${VSX.lang==="vi"?"Loại spawn được":"Spawnable types"}</small><b>${ids.length}</b></div></div>
 <small>${VSX.lang==="vi"?"Các multiplier chỉ tác động enemy được spawn từ Admin. Size tăng đồng thời kích thước, HP và damage; Power tiếp tục nhân HP và damage. Spawn Random dùng toàn bộ enemy thường + specialist trong registry và bỏ qua encounter đặc biệt/Boss.":"Multipliers affect enemies spawned from Admin only. Size increases physical size and also scales HP + damage; Power further multiplies HP + damage. Spawn Random uses every normal + specialist enemy in the registry, excluding special encounters and bosses."}</small></div>`;
 bindUnifiedSpawnUI();
}
function updateTuneSummary(){const el=document.getElementById("admEnemyTuningSummary");if(!el)return;const strength=A.enemyPower*A.enemySize;el.innerHTML=`${VSX.lang==="vi"?"Hiệu lực":"Effective"}: ${VSX.lang==="vi"?"Tốc chạy":"Move"} <b>${A.enemyMoveSpeed.toFixed(2)}x</b> · ${VSX.lang==="vi"?"Tốc đánh":"Attack"} <b>${A.enemyAttackSpeed.toFixed(2)}x</b><br>${VSX.lang==="vi"?"Kích thước":"Size"} <b>${A.enemySize.toFixed(2)}x</b> · HP/Damage <b>${strength.toFixed(2)}x</b> (${VSX.lang==="vi"?"Power × Size":"Power × Size"})`}
function bindUnifiedSpawnUI(){
 const grid=document.getElementById("admEnemySelectGrid");if(!grid)return;grid.querySelectorAll("[data-enemy-pick] input").forEach(cb=>cb.onchange=()=>{const id=cb.value,sel=currentEnemySelection();cb.checked?sel.add(id):sel.delete(id);cb.closest(".vsxEnemyPick")?.classList.toggle("selected",cb.checked);const c=document.getElementById("admEnemySelectedCount");if(c)c.textContent=`${sel.size}/${spawnableEnemyIds().length}`});
 const search=document.getElementById("admEnemySearchUnified");if(search)search.oninput=()=>{A.enemySearch=search.value;const q=A.enemySearch.trim().toLowerCase();grid.querySelectorAll("[data-enemy-pick]").forEach(row=>{const id=row.dataset.enemyPick||"",nm=enemyName(id).toLowerCase();row.style.display=!q||nm.includes(q)||id.toLowerCase().includes(q)?"":"none"})};
 document.getElementById("admEnemySelectAll")?.addEventListener("click",()=>{A.enemySelection=new Set(spawnableEnemyIds());buildUnifiedSpawnUI()});
 document.getElementById("admEnemyClearSelection")?.addEventListener("click",()=>{A.enemySelection=new Set();buildUnifiedSpawnUI()});
 const count=document.getElementById("admEnemyCountUnified"),countOut=document.getElementById("admEnemyCountUnifiedOut");if(count)count.oninput=()=>{A.enemySpawnCount=Math.max(1,Math.min(100,Number(count.value)||1));if(countOut)countOut.textContent=String(A.enemySpawnCount)};
 const elite=document.getElementById("admEnemyEliteUnified");if(elite)elite.onchange=()=>A.enemyElite=elite.checked;
 const tune=(id,key,out)=>{const x=document.getElementById(id),o=document.getElementById(out);if(!x)return;x.oninput=()=>{A[key]=Number(x.value)||1;if(o)o.textContent=A[key].toFixed(2)+"x";retuneAdminEnemies();updateTuneSummary()}};
 tune("admEnemyMoveUnified","enemyMoveSpeed","admEnemyMoveUnifiedOut");tune("admEnemyAttackUnified","enemyAttackSpeed","admEnemyAttackUnifiedOut");tune("admEnemyPowerUnified","enemyPower","admEnemyPowerUnifiedOut");tune("admEnemySizeUnified","enemySize","admEnemySizeUnifiedOut");
 document.getElementById("admEnemyResetTuning")?.addEventListener("click",()=>{Object.assign(A,{enemyMoveSpeed:1,enemyAttackSpeed:1,enemyPower:1,enemySize:1});retuneAdminEnemies();buildUnifiedSpawnUI()});
 document.getElementById("admSpawnSelectedUnified")?.addEventListener("click",()=>{const ids=[...currentEnemySelection()];if(!ids.length){VSX.announce("ADMIN",VSX.lang==="vi"?"CHƯA CHỌN ENEMY":"NO ENEMY SELECTED","#ff9c78");return}spawnBatch(ids,A.enemySpawnCount,false);buildUnifiedSpawnUI()});
 document.getElementById("admSpawnRandomUnified")?.addEventListener("click",()=>{spawnBatch([],A.enemySpawnCount,true);buildUnifiedSpawnUI()});
 document.getElementById("admClearEnemiesUnified")?.addEventListener("click",()=>{for(const e of game.enemies||[])if(!e.isBoss&&!e.isMiniBoss&&!e.specialId)e.dead=true;buildUnifiedSpawnUI()});
 document.getElementById("admClearBulletsUnified")?.addEventListener("click",()=>{for(const q of game.enemyProjectiles||[])q.dead=true;buildUnifiedSpawnUI()});updateTuneSummary();
}

/* Force the old Enemy10 / Enemy31 QA appenders to stay out once the unified panel exists. */
if(A?.openPanel){const OPEN_BASE=A.openPanel;A.openPanel=function(tab){const r=OPEN_BASE.call(A,tab);setTimeout(buildUnifiedSpawnUI,1);return r}}
if(typeof vsxApplyLanguage==="function"){const UEA_LANG_BASE=vsxApplyLanguage;vsxApplyLanguage=function(){const r=UEA_LANG_BASE();setTimeout(buildUnifiedSpawnUI,1);return r}}
document.addEventListener("click",e=>{const t=e.target?.closest?.("[data-admin-tab],#vsxAdminBtn,#vsxLangBtn");if(t&&(t.dataset?.adminTab==="spawn"||t.id==="vsxAdminBtn"||t.id==="vsxLangBtn"))setTimeout(buildUnifiedSpawnUI,1)});
document.addEventListener("keydown",e=>{if(e.code==="F10")setTimeout(buildUnifiedSpawnUI,1)});
setTimeout(buildUnifiedSpawnUI,0);

/* ---------- Complete Enemy Collection ---------- */
const COLLECTION_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){
 if(cat!=="enemies")return COLLECTION_BASE.call(VSX,cat);const list=document.getElementById("vsxCodexList");if(!list)return;list.innerHTML="";const seen=VSX.save.codex.enemies||{},rows=VSX.codexEntries("enemies");
 for(const row of rows){const id=row[0],unlocked=!!seen[id],card=document.createElement("div");card.className="vsxCodexItem vsxEnemyCodexItem";if(!unlocked){card.innerHTML=`<div class="vsxEnemyCodexHead"><b>???</b></div><div class="vsxEnemyCodexMechanic">${VSX.lang==="vi"?"Chưa chạm trán. Thông tin cơ chế sẽ được mở sau lần gặp đầu tiên.":"Undiscovered. Attack information unlocks after the first encounter."}</div>`;list.appendChild(card);continue}
   const info=BASE_ENEMY_INFO[id],d=id.startsWith("mini_")?MINIBOSS_DEFINITIONS[id.slice(5)]:ENEMY_DEFINITIONS[id],name=info?.name?.[VSX.lang]||row[1]||enemyName(id),desc=info?.desc?.[VSX.lang]||row[2]||"",wave=info?.wave||(!id.startsWith("mini_")?waveFromDef(id):null);
   const hp=d?.hp!=null?Math.round(d.hp):null,dmg=d?.damage!=null?Math.round(d.damage):null,spd=d?.speed!=null?Math.round(d.speed):null;
   card.innerHTML=`<div class="vsxEnemyCodexHead"><b>${VSX.esc(name)}</b>${wave?`<span class="vsxEnemyCodexWave">W${wave}+</span>`:""}</div><div class="vsxEnemyCodexMechanic"><span class="vsxEnemyCodexLabel">${VSX.lang==="vi"?"Cơ chế tấn công":"Attack pattern"}</span> · ${VSX.esc(desc)}</div><div class="vsxEnemyCodexStats">${hp!=null?`<span>HP ${hp}</span>`:""}${dmg!=null?`<span>DMG ${dmg}</span>`:""}${spd!=null?`<span>SPD ${spd}</span>`:""}${d?.behavior?`<span>${VSX.esc(String(d.behavior).toUpperCase())}</span>`:""}</div>`;list.appendChild(card)
 }
};

window.VSX_UNIFIED_ENEMY_ADMIN={build:buildUnifiedSpawnUI,spawnBatch,spawnOne:adminSpawnEnemy,applyTuning:applyAdminEnemyTuning,retune:retuneAdminEnemies,spawnable:spawnableEnemyIds,baseInfo:BASE_ENEMY_INFO};
})();
