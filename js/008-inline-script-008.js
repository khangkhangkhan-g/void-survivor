// ======================================================
// SIX NEW NARRATIVE ALLIES — STORY ENCOUNTER EXPANSION
// ======================================================
Object.assign(I18N.en,{
 seraphObjective:"Collect 3 Radiant Seals, then defend Seraph-IX's beacon for 15 seconds.",
 echoObjective:"Activate the Mirror Anomaly and defeat your reflected combat pattern.",
 aurelionObjective:"Protect the Storm Egg for two full Waves until it hatches.",
 morrowObjective:"Offer a price to the Grave Broker: HP, a reroll, or a chest.",
 rookObjective:"Recover 3 War Modules, then defend Rook-13 while it reboots.",
 umbraObjective:"Track 3 hidden shadows during Blackout, then survive the Shadow Hunt.",
 seraphJoin:"SERAPH-IX HAS DESCENDED",echoJoin:"ECHO ZERO ACCEPTS THE ORIGINAL",aurelionJoin:"THE STORM DRAKE HAS HATCHED",
 morrowJoin:"MORROW HAS SIGNED THE LEDGER",rookJoin:"ROOK-13 IS ONLINE",umbraJoin:"UMBRA STEPS OUT OF YOUR SHADOW",
 radiantSeal:"RADIANT SEAL",mirrorAnomaly:"MIRROR ANOMALY",stormEgg:"STORM EGG",soulContract:"SOUL CONTRACT",warModule:"WAR MODULE",shadowTrace:"SHADOW TRACE"
});
Object.assign(I18N.vi,{
 seraphObjective:"Thu đủ 3 Thánh Ấn, sau đó bảo vệ tín hiệu Seraph-IX trong 15 giây.",
 echoObjective:"Kích hoạt Dị Thường Phản Chiếu và đánh bại bản sao chiến đấu của chính bạn.",
 aurelionObjective:"Bảo vệ Trứng Lôi Long trong đủ hai Đợt để nó nở.",
 morrowObjective:"Trả giá cho Kẻ Môi Giới Tử Giới: Máu, một lượt Đổi Lại hoặc một Rương.",
 rookObjective:"Thu đủ 3 Mô-đun Chiến Trận, sau đó bảo vệ Rook-13 trong lúc khởi động lại.",
 umbraObjective:"Lần theo 3 Bóng Ẩn trong Mất Đèn, rồi sống sót qua Cuộc Săn Bóng Tối.",
 seraphJoin:"SERAPH-IX ĐÃ GIÁNG XUỐNG",echoJoin:"ECHO ZERO CÔNG NHẬN BẢN GỐC",aurelionJoin:"LONG THÚ LÔI ĐIỆN ĐÃ NỞ",
 morrowJoin:"MORROW ĐÃ GHI TÊN VÀO SỔ NỢ",rookJoin:"ROOK-13 ĐÃ TRỰC TUYẾN",umbraJoin:"UMBRA BƯỚC RA KHỎI CÁI BÓNG CỦA BẠN",
 radiantSeal:"THÁNH ẤN",mirrorAnomaly:"DỊ THƯỜNG PHẢN CHIẾU",stormEgg:"TRỨNG LÔI LONG",soulContract:"KHẾ ƯỚC LINH HỒN",warModule:"MÔ-ĐUN CHIẾN TRẬN",shadowTrace:"DẤU BÓNG"
});

Object.assign(ALLY_DEFINITIONS,{
 seraph:{name:{en:"Seraph-IX — Fallen Seraph",vi:"Seraph-IX — Thiên Sứ Sa Ngã"},short:{en:"SERAPH-IX",vi:"SERAPH-IX"},desc:{en:"An aerial guardian armed with radiant spears and a sacrificial rescue protocol.",vi:"Hộ vệ trên không dùng thương quang minh và giao thức hy sinh để cứu chủ nhân khỏi đòn chí mạng."},role:{en:"Support Artillery",vi:"Pháo Kích Hỗ Trợ"},color:"#fff0a3",glyph:"S",hp:.76,damage:36,speed:390,cooldown:.72,acquire:{en:"Collect 3 Radiant Seals within 30 seconds, then defend the celestial beacon.",vi:"Nhặt 3 Thánh Ấn trong 30 giây, sau đó trấn giữ tín hiệu thiên giới."}},
 echo:{name:{en:"Echo Zero — Mirror Operative",vi:"Echo Zero — Đặc Vụ Phản Chiếu"},short:{en:"ECHO ZERO",vi:"ECHO ZERO"},desc:{en:"An adaptive mirror intelligence that imitates the shape of your latest eligible attack.",vi:"Trí tuệ phản chiếu thích ứng, mô phỏng dạng tấn công hợp lệ gần nhất của bạn."},role:{en:"Adaptive",vi:"Thích Ứng"},color:"#9dc7ff",glyph:"E",hp:.68,damage:30,speed:420,cooldown:.75,acquire:{en:"Defeat your Mirror Operative at the anomaly.",vi:"Đánh bại Đặc Vụ Phản Chiếu sinh ra từ dị thường."}},
 aurelion:{name:{en:"Aurelion — Storm Drake",vi:"Aurelion — Long Thú Lôi Điện"},short:{en:"AURELION",vi:"AURELION"},desc:{en:"A flying storm drake that dive-bombs crowds and chains lightning between packed targets.",vi:"Long thú bay lượn bổ nhào vào đám đông và truyền sét giữa các mục tiêu tụ lại."},role:{en:"Aerial Area DPS",vi:"Sát Thương Diện Rộng"},color:"#7ee7ff",glyph:"D",hp:.92,damage:40,speed:470,cooldown:2.6,acquire:{en:"Protect its Storm Egg for two full Waves.",vi:"Bảo vệ Trứng Lôi Long trong đủ hai Đợt."}},
 morrow:{name:{en:"Morrow — Grave Broker",vi:"Morrow — Kẻ Môi Giới Tử Giới"},short:{en:"MORROW",vi:"MORROW"},desc:{en:"A death broker that marks high-value targets and cashes stored damage into corpse-bursts.",vi:"Kẻ môi giới tử giới đánh dấu mục tiêu giá trị cao và biến sát thương tích lũy thành vụ nổ tử khí."},role:{en:"Death Specialist",vi:"Chuyên Gia Tử Khí"},color:"#c6b1ff",glyph:"M",hp:.70,damage:26,speed:350,cooldown:1.05,acquire:{en:"After a mini-boss, pay the Soul Contract's price.",vi:"Sau khi hạ Mini-boss, trả cái giá của Khế Ước Linh Hồn."}},
 rook:{name:{en:"Rook-13 — Siege Automaton",vi:"Rook-13 — Cỗ Máy Công Thành"},short:{en:"ROOK-13",vi:"ROOK-13"},desc:{en:"A heavy siege platform that alternates mortar fire, rotary suppression and anchored defense.",vi:"Nền tảng công thành hạng nặng luân phiên pháo cối, súng xoay áp chế và chế độ neo phòng thủ."},role:{en:"Siege Tank",vi:"Xe Tăng Công Thành"},color:"#ffbd72",glyph:"13",hp:1.42,damage:34,speed:235,cooldown:2.8,acquire:{en:"Recover 3 War Modules within 30 seconds, then protect its reboot cycle.",vi:"Nhặt 3 Mô-đun Chiến Trận trong 30 giây, sau đó bảo vệ chu kỳ khởi động lại."}},
 umbra:{name:{en:"Umbra — Living Shadow",vi:"Umbra — Bóng Sống"},short:{en:"UMBRA",vi:"UMBRA"},desc:{en:"A living shadow that phase-slashes weakened prey and leaves decoys that bend enemy movement.",vi:"Bóng sống dịch chuyển kết liễu con mồi suy yếu và để lại phân thân bóng làm lệch hướng kẻ địch."},role:{en:"Assassin Control",vi:"Sát Thủ Khống Chế"},color:"#8572ff",glyph:"U",hp:.64,damage:54,speed:520,cooldown:.58,acquire:{en:"During Blackout, find 3 hidden shadows and win the Shadow Hunt.",vi:"Trong Mất Đèn, tìm 3 Bóng Ẩn và thắng Cuộc Săn Bóng Tối."}}
});

function vsxProtectedExecuteTarget(e){return !e||e.dead||e.isBoss||e.isMiniBoss||e.isCaptive||e.specialId||e.isRecruitDuel||e.noExecute}

class VSX_EchoDuelist extends Enemy{
 constructor(x,y){super("runner",x,y,1.75,null);this.isRecruitDuel=true;this.noExecute=true;this.maxHp=Math.round((620+game.player.level*28)*(DIFFICULTY_DEFINITIONS[game.difficultyMode||"normal"].hp||1));this.hp=this.maxHp;this.damage=20;this.speed=175;this.size=18;this.xp=0;this.mirrorCool=.45;this.def={...this.def,color:"#9dc7ff",shape:"diamond",name:"Echo Zero"}}
 update(dt){super.update(dt);if(this.dead)return;this.mirrorCool-=dt;if(this.mirrorCool<=0){this.mirrorCool=1.15;const src=game.lastAttackWeapon,t=game.player;if(src&&!src.def.rewardOnly&&!src.def.legendaryRelic&&src.def.behavior!=="mirrorClone"){const n=normalize(t.x-this.x,t.y-this.y),s=src.getStats?.()||src.def,base=Math.max(10,Math.min(48,(s.damage||22)*.55));game.enemyProjectiles.push(new Projectile({x:this.x,y:this.y,vx:n.x*420,vy:n.y*420,radius:6,damage:base,life:2.4,color:"#9dc7ff",owner:"enemy",critAllowed:false}))}else{const n=normalize(t.x-this.x,t.y-this.y);game.enemyProjectiles.push(new Projectile({x:this.x,y:this.y,vx:n.x*380,vy:n.y*380,radius:5,damage:16,life:2.2,color:"#9dc7ff",owner:"enemy",critAllowed:false}))}}}
 die(){if(this.dead)return;super.die(false);game.activeRecruitChallenge=null;game.recruitAlly("echo",this.x,this.y)}
 render(g){super.render(g);g.fillStyle="#e7f3ff";g.font="900 9px Arial";g.textAlign="center";g.fillText("ECHO",this.x,this.y-this.size-13)}
}

class VSX_UmbraHunter extends Enemy{
 constructor(x,y){super("runner",x,y,1.85,null);this.isRecruitDuel=true;this.noExecute=true;this.maxHp=Math.round(760*(DIFFICULTY_DEFINITIONS[game.difficultyMode||"normal"].hp||1));this.hp=this.maxHp;this.damage=27;this.speed=205;this.size=17;this.xp=0;this.blink=1.8;this.def={...this.def,color:"#8572ff",shape:"diamond",name:"Umbra"}}
 update(dt){super.update(dt);if(this.dead)return;this.blink-=dt;if(this.blink<=0){this.blink=2.2;const a=Math.random()*Math.PI*2;this.x=game.player.x+Math.cos(a)*rand(190,120);this.y=game.player.y+Math.sin(a)*rand(190,120);game.spark(this.x,this.y,"#8572ff",10)}}
 die(){if(this.dead)return;super.die(false);game.activeRecruitChallenge=null;game.recruitAlly("umbra",this.x,this.y)}
 render(g){super.render(g);g.fillStyle="#e8e3ff";g.font="900 9px Arial";g.textAlign="center";g.fillText("UMBRA",this.x,this.y-this.size-13)}
}

class VSX_MorrowThrall{
 constructor(x,y){this.x=x;this.y=y;this.life=4.5;this.cool=.15;this.dead=false;this.phase=Math.random()*6.28}
 update(dt){this.life-=dt;this.cool-=dt;if(this.life<=0){this.dead=true;return}let t=game.findNearest(this.x,this.y,520);if(!t)return;const n=normalize(t.x-this.x,t.y-this.y);this.x+=n.x*260*dt;this.y+=n.y*260*dt;if(Math.hypot(t.x-this.x,t.y-this.y)<30&&this.cool<=0){this.cool=.55;const dmg=Math.min(18*game.allyDamageMultiplier(),Math.max(0,t.hp-1));if(dmg>0)game.damageEnemy(t,dmg,{source:{id:"ally_morrow_thrall",def:{tags:["ally","summon"]}},canCrit:false,knockback:12,fromX:this.x,fromY:this.y})}}
 render(g){g.save();g.globalAlpha=clamp(this.life/1.2,0,.55);g.fillStyle="#b69cff";g.shadowBlur=10;g.shadowColor="#b69cff";g.beginPath();g.arc(this.x,this.y,7,0,Math.PI*2);g.fill();g.restore()}
}

class VSX_UmbraDecoy{
 constructor(x,y){this.x=x;this.y=y;this.life=4;this.dead=false}
 update(dt){this.life-=dt;if(this.life<=0){this.dead=true;return}for(const e of game.grid.queryCircle(this.x,this.y,180)){if(e.dead||e.isBoss||e.isMiniBoss||e.specialId)continue;const n=normalize(this.x-e.x,this.y-e.y);e.x+=n.x*42*dt;e.y+=n.y*42*dt}}
 render(g){g.save();g.globalAlpha=.25+.2*Math.sin(game.time*7);g.fillStyle="#8572ff";g.beginPath();g.arc(this.x,this.y,15,0,Math.PI*2);g.fill();g.restore()}
}

const SIXALLY_BASE_OBJECT_UPDATE=VSX_RecruitObject.prototype.update;
VSX_RecruitObject.prototype.update=function(dt){
 if(this.type==="seraph_seal"){this.life-=dt;this.pulse+=dt;if(Math.hypot(game.player.x-this.x,game.player.y-this.y)<game.player.radius+this.r+4){this.dead=true;game.seraphSeals=(game.seraphSeals||0)+1;game.spark(this.x,this.y,"#fff0a3",16);if(game.seraphSeals>=3){const b=game.recruitObjects.find(o=>o.type==="seraph_beacon"&&!o.dead);if(b){b.stage="defend";b.progress=0;b.wave=0}VSX.announce(t("recruitment"),VSX.lang==="vi"?"ĐỦ THÁNH ẤN — BẢO VỆ TÍN HIỆU":"SEALS COMPLETE — DEFEND THE BEACON","#fff0a3")}}if(this.life<=0&&!this.dead)game.failRecruitChallenge("seraph");return}
 if(this.type==="seraph_beacon"){this.life-=dt;this.pulse+=dt;if(this.stage==="defend"){if(Math.hypot(game.player.x-this.x,game.player.y-this.y)<175){this.progress+=dt;this.holy=(this.holy||1.8)-dt;this.wave=(this.wave||0)-dt;if(this.holy<=0){this.holy=2;game.player.takeDamage(Math.max(1,game.player.maxHp*.012),{holyTrial:true})}if(this.wave<=0){this.wave=3.2;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;game.enemies.push(vsxApplyDifficulty(new Enemy(pick(["runner","swarmer","grunt"]),this.x+Math.cos(a)*230,this.y+Math.sin(a)*230,game.difficulty)))}}if(this.progress>=15){this.dead=true;game.recruitObjects=game.recruitObjects.filter(o=>o.type!=="seraph_seal");game.recruitAlly("seraph",this.x,this.y);return}}}if(this.life<=0&&!this.dead)game.failRecruitChallenge("seraph");return}
 if(this.type==="aurelion_egg"){this.life-=dt;this.pulse+=dt;this.hitTick=(this.hitTick||.7)-dt;if(this.hitTick<=0){this.hitTick=.7;let pressure=0;for(const e of game.grid.queryCircle(this.x,this.y,58)){if(!e.dead&&!e.isCaptive)pressure+=e.isBoss?22:e.isMiniBoss?16:5}if(pressure){this.hp-=pressure;game.texts.push(new FloatingText(this.x,this.y-28,`-${pressure}`,"#ff9b75",10))}}if(game.time>=this.targetTime&&this.hp>0){this.dead=true;game.recruitAlly("aurelion",this.x,this.y);return}if(this.hp<=0||this.life<=0){this.dead=true;game.failRecruitChallenge("aurelion")}return}
 if(this.type==="morrow_soul"){this.life-=dt;this.pulse+=dt;if(this.life<=0){this.dead=true;game.failRecruitChallenge("morrow")}return}
 if(this.type==="war_module"){this.life-=dt;this.pulse+=dt;if(Math.hypot(game.player.x-this.x,game.player.y-this.y)<game.player.radius+this.r+4){this.dead=true;game.rookModules=(game.rookModules||0)+1;game.spark(this.x,this.y,"#ffbd72",15);if(game.rookModules>=3){const r=game.recruitObjects.find(o=>o.type==="rook_repair"&&!o.dead);if(r){r.stage="defend";r.progress=0;r.hp=Math.max(r.hp,220)}VSX.announce(t("recruitment"),VSX.lang==="vi"?"ĐỦ MÔ-ĐUN — BẢO VỆ KHỞI ĐỘNG":"MODULES COMPLETE — DEFEND THE REBOOT","#ffbd72")}}if(this.life<=0)this.dead=true;return}
 if(this.type==="rook_supply"){this.life-=dt;this.pulse+=dt;if(Math.hypot(game.player.x-this.x,game.player.y-this.y)<game.player.radius+this.r+6){this.dead=true;game.recruitObjects.push(new VSX_RecruitObject("war_module",this.x,this.y,{life:35,r:12}))}if(this.life<=0)this.dead=true;return}
 if(this.type==="rook_repair"){this.life-=dt;this.pulse+=dt;if(this.stage==="defend"){this.progress+=dt;this.hitTick=(this.hitTick||.7)-dt;this.spawnTick=(this.spawnTick||2.8)-dt;if(this.hitTick<=0){this.hitTick=.7;let pressure=0;for(const e of game.grid.queryCircle(this.x,this.y,65))if(!e.dead&&!e.isCaptive)pressure+=e.isMiniBoss?15:4;this.hp-=pressure}if(this.spawnTick<=0){this.spawnTick=3;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;game.enemies.push(vsxApplyDifficulty(new Enemy(pick(["grunt","runner","shooter"]),this.x+Math.cos(a)*240,this.y+Math.sin(a)*240,game.difficulty)))}}if(this.progress>=15&&this.hp>0){this.dead=true;game.recruitAlly("rook",this.x,this.y);return}if(this.hp<=0){this.dead=true;game.failRecruitChallenge("rook");return}}if(this.life<=0&&!this.dead)game.failRecruitChallenge("rook");return}
 if(this.type==="umbra_shadow"){this.life-=dt;this.pulse+=dt;const a=game.time*.42+this.index*2.1;this.x+=Math.cos(a)*18*dt;this.y+=Math.sin(a*.83)*18*dt;const d=Math.hypot(game.player.x-this.x,game.player.y-this.y);if(d<220)this.revealed=true;if(d<70){this.dead=true;game.umbraTrace=(game.umbraTrace||0)+1;game.spark(this.x,this.y,"#8572ff",14);if(game.umbraTrace<3){const aa=Math.random()*Math.PI*2,rr=rand(390,250);game.recruitObjects.push(new VSX_RecruitObject("umbra_shadow",game.player.x+Math.cos(aa)*rr,game.player.y+Math.sin(aa)*rr,{life:18,index:game.umbraTrace+1,minimapHidden:true,revealed:false,r:17}))}else{game.activeRecruitChallenge="umbra_hunt";const aa=Math.random()*Math.PI*2,rr=180;game.enemies.push(new VSX_UmbraHunter(game.player.x+Math.cos(aa)*rr,game.player.y+Math.sin(aa)*rr));VSX.announce(t("recruitment"),VSX.lang==="vi"?"CUỘC SĂN BÓNG TỐI BẮT ĐẦU":"SHADOW HUNT BEGINS","#8572ff")}}if(this.life<=0&&!this.dead){this.dead=true;game.failRecruitChallenge("umbra")}return}
 return SIXALLY_BASE_OBJECT_UPDATE.call(this,dt)
};

const SIXALLY_BASE_OBJECT_INTERACT=VSX_RecruitObject.prototype.interact;
VSX_RecruitObject.prototype.interact=function(){
 if(this.dead||this.used)return;
 if(this.type==="echo_mirror"){this.used=true;this.dead=true;game.activeRecruitChallenge="echo_duel";const a=Math.atan2(this.y-game.player.y,this.x-game.player.x),rr=170;game.enemies.push(new VSX_EchoDuelist(game.player.x+Math.cos(a)*rr,game.player.y+Math.sin(a)*rr));VSX.announce(t("recruitment"),VSX.lang==="vi"?"ĐẶC VỤ PHẢN CHIẾU ĐÃ KÍCH HOẠT":"MIRROR OPERATIVE ACTIVATED","#9dc7ff");return}
 if(this.type==="morrow_soul"){this.used=true;game.openMorrowContract(this);return}
 return SIXALLY_BASE_OBJECT_INTERACT.call(this)
};

const SIXALLY_BASE_OBJECT_RENDER=VSX_RecruitObject.prototype.render;
VSX_RecruitObject.prototype.render=function(g){
 if(["seraph_seal","seraph_beacon","aurelion_egg","morrow_soul","war_module","rook_supply","rook_repair","umbra_shadow","echo_mirror"].includes(this.type)){
  if(this.type==="umbra_shadow"&&!this.revealed)return;
  g.save();g.translate(this.x,this.y);g.shadowBlur=16;
  let c="#a97cff",label="?";
  if(this.type.startsWith("seraph")){c="#fff0a3";label=this.type==="seraph_seal"?"S":"SR"}
  else if(this.type==="echo_mirror"){c="#9dc7ff";label="E"}
  else if(this.type==="aurelion_egg"){c="#7ee7ff";label="D"}
  else if(this.type==="morrow_soul"){c="#c6b1ff";label="M"}
  else if(this.type==="war_module"){c="#ffbd72";label="W"}
  else if(this.type==="rook_supply"){c="#ffcf8c";label="C"}
  else if(this.type==="rook_repair"){c="#ffbd72";label="13"}
  else if(this.type==="umbra_shadow"){c="#8572ff";label="U"}
  g.shadowColor=c;g.strokeStyle=c;g.fillStyle=c;g.lineWidth=3;const pulse=1+.08*Math.sin(this.pulse*5);
  if(this.type==="aurelion_egg"){g.scale(pulse,pulse);g.beginPath();g.ellipse(0,0,14,20,0,0,Math.PI*2);g.fill();g.fillStyle="#163044";g.beginPath();g.moveTo(-6,-4);g.lineTo(3,-9);g.lineTo(7,2);g.stroke()}
  else if(this.type==="rook_repair"){g.strokeRect(-20,-17,40,34);g.fillStyle="rgba(255,189,114,.2)";g.fillRect(-16,-13,32,26)}
  else{g.scale(pulse,pulse);g.beginPath();g.arc(0,0,this.r||16,0,Math.PI*2);g.globalAlpha=.25;g.fill();g.globalAlpha=1;g.stroke()}
  g.fillStyle="#eef8ff";g.font="900 9px Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(label,0,1);g.restore();
  if(this.type==="aurelion_egg"||this.type==="rook_repair"){const max=this.maxHp||this.max||350,hp=this.hp??max,w=44;g.fillStyle="rgba(4,10,20,.82)";g.fillRect(this.x-w/2,this.y-30,w,4);g.fillStyle=c;g.fillRect(this.x-w/2,this.y-30,w*clamp(hp/max,0,1),4)}
  return
 }
 return SIXALLY_BASE_OBJECT_RENDER.call(this,g)
};

const SIXALLY_BASE_INIT=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){SIXALLY_BASE_INIT.call(this);Object.assign(this.allySpawned,{seraph:false,echo:false,aurelion:false,morrow:false,rook:false,umbra:false});Object.assign(this.allyNextTry,{seraph:0,echo:0,aurelion:0,morrow:0,rook:0,umbra:0});this.seraphSeals=0;this.seraphSaveUsed=false;this.rookModules=0;this.umbraTrace=0;this.morrowMiniBossesSeen=0;this.morrowThralls=[];this.umbraDecoys=[];this.morrowMark=null};

const SIXALLY_BASE_RECRUIT=Game.prototype.recruitAlly;
Game.prototype.recruitAlly=function(id,x=this.player.x,y=this.player.y){if(!["seraph","echo","aurelion","morrow","rook","umbra"].includes(id))return SIXALLY_BASE_RECRUIT.call(this,id,x,y);if(this.storyAllyMap?.has(id))return this.storyAllyMap.get(id);const a=new VSX_NarrativeAlly(id,x,y);this.storyAllies.push(a);this.storyAllyMap.set(id,a);vsxDiscover("allies",id);this.stats.storyAllies++;this.activeRecruitChallenge=null;const key={seraph:"seraphJoin",echo:"echoJoin",aurelion:"aurelionJoin",morrow:"morrowJoin",rook:"rookJoin",umbra:"umbraJoin"}[id];VSX.announce(t("allyNetwork"),t(key),ALLY_DEFINITIONS[id].color);this.spark(x,y,ALLY_DEFINITIONS[id].color,30);this.audio.beep(id==="rook"?170:760,.16,"triangle",.035);if(id==="rook")a.radius=21;if(id==="aurelion")a.radius=18;return a};

const SIXALLY_BASE_FAIL=Game.prototype.failRecruitChallenge;
Game.prototype.failRecruitChallenge=function(id){SIXALLY_BASE_FAIL.call(this,id);if(["seraph","echo","aurelion","morrow","rook","umbra"].includes(id)){this.recruitObjects=this.recruitObjects.filter(o=>o.data?.recruitId!==id&&!((id==="seraph")&&o.type.startsWith("seraph_"))&&!((id==="rook")&&["rook_repair","rook_supply","war_module"].includes(o.type))&&!((id==="umbra")&&o.type==="umbra_shadow"));this.allySpawned[id]=false;this.allyNextTry[id]=this.time+(id==="umbra"?75:90);if(id==="seraph")this.seraphSeals=0;if(id==="rook")this.rookModules=0;if(id==="umbra")this.umbraTrace=0}};

const SIXALLY_BASE_SPAWN=Game.prototype.spawnRecruitChallenge;
Game.prototype.spawnRecruitChallenge=function(id){
 if(!["seraph","echo","aurelion","rook","umbra"].includes(id))return SIXALLY_BASE_SPAWN.call(this,id);
 if(this.activeRecruitChallenge||this.storyAllyMap.has(id))return false;
 this.allySpawned[id]=true;this.activeRecruitChallenge=id;const a=Math.random()*Math.PI*2,rr=rand(520,320),x=this.player.x+Math.cos(a)*rr,y=this.player.y+Math.sin(a)*rr;
 if(id==="seraph"){this.seraphSeals=0;this.recruitObjects.push(new VSX_RecruitObject("seraph_beacon",x,y,{recruitId:id,life:78,r:24,stage:"seals"}));for(let i=0;i<3;i++){const aa=i*Math.PI*2/3+Math.random()*.45,rad=rand(330,190);this.recruitObjects.push(new VSX_RecruitObject("seraph_seal",x+Math.cos(aa)*rad,y+Math.sin(aa)*rad,{recruitId:id,life:70,r:13,index:i}))}VSX.announce(t("recruitHint"),VSX.lang==="vi"?"TÍN HIỆU THIÊN GIỚI":"CELESTIAL BEACON",ALLY_DEFINITIONS.seraph.color)}
 else if(id==="echo"){this.recruitObjects.push(new VSX_RecruitObject("echo_mirror",x,y,{recruitId:id,life:70,r:22}));VSX.announce(t("recruitHint"),t("mirrorAnomaly"),ALLY_DEFINITIONS.echo.color)}
 else if(id==="aurelion"){this.recruitObjects.push(new VSX_RecruitObject("aurelion_egg",x,y,{recruitId:id,life:145,r:22,hp:360,maxHp:360,targetTime:this.time+120}));VSX.announce(t("recruitHint"),t("stormEgg"),ALLY_DEFINITIONS.aurelion.color)}
 else if(id==="rook"){this.rookModules=0;this.recruitObjects.push(new VSX_RecruitObject("rook_repair",x,y,{recruitId:id,life:95,r:25,hp:280,maxHp:280,stage:"modules"}));const aa=Math.random()*Math.PI*2;this.recruitObjects.push(new VSX_RecruitObject("rook_supply",this.player.x+Math.cos(aa)*rand(360,220),this.player.y+Math.sin(aa)*rand(360,220),{recruitId:id,life:55,r:18}));VSX.announce(t("recruitHint"),VSX.lang==="vi"?"TÍN HIỆU MÁY CÔNG THÀNH":"SIEGE AUTOMATON SIGNAL",ALLY_DEFINITIONS.rook.color)}
 else if(id==="umbra"){this.umbraTrace=0;if(this.worldEvent?.id==="blackout")this.worldEvent.time=Math.max(this.worldEvent.time,45);this.recruitObjects.push(new VSX_RecruitObject("umbra_shadow",x,y,{recruitId:id,life:20,r:17,index:1,minimapHidden:true,revealed:false}));VSX.announce(t("recruitHint"),VSX.lang==="vi"?"CÓ GÌ ĐÓ ĐANG DI CHUYỂN TRONG BÓNG TỐI":"SOMETHING MOVES INSIDE THE BLACKOUT",ALLY_DEFINITIONS.umbra.color)}
 return true
};

Game.prototype.openMorrowContract=function(obj){
 if(this.metaBusy||this.state!=="PLAYING")return;this.metaBusy=true;this.state="META_MODAL";this.input.clear();const title=document.getElementById("vsxMetaTitle"),box=document.getElementById("vsxMetaChoices");document.getElementById("vsxMetaModal").classList.add("active");title.textContent=t("soulContract");box.innerHTML="";const choices=[];
 choices.push({name:VSX.lang==="vi"?"TRẢ 25% MÁU HIỆN TẠI":"PAY 25% CURRENT HP",desc:VSX.lang==="vi"?"Morrow nhận máu làm giá khế ước.":"Morrow accepts blood as the contract price.",act:()=>{this.player.hp=Math.max(1,this.player.hp*.75);this.recruitAlly("morrow",obj.x,obj.y)}});
 if(this.rerollsRemaining>0)choices.push({name:VSX.lang==="vi"?"TRẢ 1 LƯỢT ĐỔI LẠI":"PAY 1 REROLL",desc:VSX.lang==="vi"?"Mất một lượt Đổi Lại hiện có.":"Spend one available reroll.",act:()=>{this.rerollsRemaining--;this.recruitAlly("morrow",obj.x,obj.y)}});
 if(this.chests?.some(c=>!c.dead))choices.push({name:VSX.lang==="vi"?"HIẾN 1 RƯƠNG":"SACRIFICE 1 CHEST",desc:VSX.lang==="vi"?"Một Rương đang nằm trên bản đồ sẽ biến mất.":"One unclaimed chest on the battlefield is consumed.",act:()=>{const c=this.chests.find(c=>!c.dead);if(c)c.dead=true;this.recruitAlly("morrow",obj.x,obj.y)}});
 this.metaChoices=choices;choices.forEach((c,i)=>{const e=document.createElement("div");e.className="vsxMetaCard";e.innerHTML=`<div class="key">${i+1}</div><h3>${VSX.esc(c.name)}</h3><p>${VSX.esc(c.desc)}</p>`;e.onclick=()=>{c.act();obj.dead=true;this.closeMeta()};box.appendChild(e)})
};

const SIXALLY_BASE_DIRECTOR=Game.prototype.updateRecruitDirector;
Game.prototype.updateRecruitDirector=function(dt){
 SIXALLY_BASE_DIRECTOR.call(this,dt);if(!this.player||this.state!=="PLAYING")return;
 if(!this.activeRecruitChallenge){const rules=[["aurelion",170,380,.010],["seraph",230,470,.009],["echo",290,540,.008],["rook",340,650,.007]];for(const [id,min,pity,chance] of rules){if(this.storyAllyMap.has(id)||this.allySpawned[id]||this.time<(this.allyNextTry[id]||0)||this.time<min)continue;if(this.time>=pity||Math.random()<chance){this.spawnRecruitChallenge(id);break}}}
 for(const q of this.morrowThralls||[])if(!q.dead)q.update(dt);this.morrowThralls=(this.morrowThralls||[]).filter(q=>!q.dead);for(const q of this.umbraDecoys||[])if(!q.dead)q.update(dt);this.umbraDecoys=(this.umbraDecoys||[]).filter(q=>!q.dead);
 if(this.morrowMark){this.morrowMark.time-=dt;const m=this.morrowMark;if(m.target?.dead){const burst=Math.min(240,Math.max(20,m.stored*.36));game.explosion(m.target.x,m.target.y,100,burst,"#c6b1ff",55,{id:"ally_morrow_ledger",def:{tags:["ally","area","arcane"]}},false);this.morrowMark=null}else if(m.time<=0)this.morrowMark=null}
};

const SIXALLY_BASE_MINIBOSS_DIE=VSX_MiniBoss.prototype.die;
VSX_MiniBoss.prototype.die=function(drop=true){const x=this.x,y=this.y;SIXALLY_BASE_MINIBOSS_DIE.call(this,drop);if(game.storyAllyMap?.has("morrow")||game.activeRecruitChallenge||game.time<210||game.allySpawned?.morrow)return;game.morrowMiniBossesSeen=(game.morrowMiniBossesSeen||0)+1;if(game.morrowMiniBossesSeen>=2||Math.random()<.5){game.allySpawned.morrow=true;game.activeRecruitChallenge="morrow";game.recruitObjects.push(new VSX_RecruitObject("morrow_soul",x,y,{recruitId:"morrow",life:48,r:20}));VSX.announce(t("recruitHint"),t("soulContract"),ALLY_DEFINITIONS.morrow.color)}};

const SIXALLY_BASE_WORLD_DESTROY=VSX_WorldObject.prototype.destroy;
VSX_WorldObject.prototype.destroy=function(){const wasGen=this.type==="generator",x=this.x,y=this.y;SIXALLY_BASE_WORLD_DESTROY.call(this);if(wasGen&&game.activeRecruitChallenge==="rook"&&game.rookModules<3&&Math.random()<.85)game.recruitObjects.push(new VSX_RecruitObject("war_module",x,y,{recruitId:"rook",life:35,r:12}))};

const SIXALLY_BASE_ENEMY_DIE=Enemy.prototype.die;
Enemy.prototype.die=function(drop=true){if(this.dead)return;const x=this.x,y=this.y,elite=!!this.elite&&!this.isBoss&&!this.isMiniBoss;SIXALLY_BASE_ENEMY_DIE.call(this,drop);if(elite&&game.activeRecruitChallenge==="rook"&&game.rookModules<3&&Math.random()<.28)game.recruitObjects.push(new VSX_RecruitObject("war_module",x,y,{recruitId:"rook",life:35,r:12}));const morrow=game.storyAllyMap?.get("morrow");if(morrow&&!morrow.dead&&Math.hypot(x-morrow.x,y-morrow.y)<260&&!this.isBoss&&!this.isMiniBoss&&!this.specialId&&Math.random()<.16)game.morrowThralls.push(new VSX_MorrowThrall(x,y))};

const SIXALLY_BASE_START_EVENT=Game.prototype.startWorldEvent;
Game.prototype.startWorldEvent=function(){const before=this.worldEvent;const r=SIXALLY_BASE_START_EVENT.call(this);if(!before&&this.worldEvent?.id==="blackout"&&!this.storyAllyMap?.has("umbra")&&!this.activeRecruitChallenge&&this.time>180&&this.time>=(this.allyNextTry?.umbra||0)){this.spawnRecruitChallenge("umbra")}return r};

const SIXALLY_BASE_DAMAGE=Game.prototype.damageEnemy;
Game.prototype.damageEnemy=function(e,a,o={}){const hp=e?.hp||0,r=SIXALLY_BASE_DAMAGE.call(this,e,a,o);if(this.morrowMark&&this.morrowMark.target===e&&!e?.dead)this.morrowMark.stored+=Math.max(0,hp-(e?.hp||0));else if(this.morrowMark&&this.morrowMark.target===e&&e?.dead)this.morrowMark.stored+=Math.max(0,hp);return r};

const SIXALLY_BASE_ALLY_UPDATE=VSX_NarrativeAlly.prototype.update;
VSX_NarrativeAlly.prototype.update=function(dt){
 SIXALLY_BASE_ALLY_UPDATE.call(this,dt);if(this.dead||!["seraph","echo","aurelion","morrow","rook","umbra"].includes(this.id))return;const d=this.def,atkSp=game.allyAttackSpeedMultiplier();
 if(this.id==="seraph"){const f=this.followPoint(170);this.moveToward(f.x,f.y,d.speed,dt);if(this.cool<=0){const t=game.findNearest(this.x,this.y,760);if(t){this.cool=d.cooldown/atkSp;const n=normalize(t.x-this.x,t.y-this.y);game.projectiles.push(new Projectile({x:this.x,y:this.y,vx:n.x*820,vy:n.y*820,radius:5,damage:d.damage*game.allyDamageMultiplier(),life:1.25,pierce:2,color:d.color,weapon:{id:"ally_seraph",def:{tags:["ally","projectile"]}},statSourceId:"ally_seraph"}))}}if(this.special<=0){this.special=12/atkSp;let n=0;for(const p of game.enemyProjectiles){if(!p.dead&&Math.hypot(p.x-game.player.x,p.y-game.player.y)<170&&n<6){p.dead=true;n++}}if(n){game.stats.projectilesBlocked+=n;game.effects.push(new WaveEffect(game.player.x,game.player.y,175,.45,0,0,{id:"ally_seraph_guard",def:{tags:["ally","defensive"]}},d.color))}}}
 else if(this.id==="echo"){const f=this.followPoint(125);this.moveToward(f.x,f.y,d.speed,dt);if(this.cool<=0){const target=game.findNearest(this.x,this.y,680);if(target){this.cool=d.cooldown/atkSp;const src=game.lastAttackWeapon,eligible=src&&!src.def.rewardOnly&&!src.def.legendaryRelic&&src.def.behavior!=="mirrorClone";if(eligible&&src.def.tags?.includes("area")){game.explosion(target.x,target.y,65,Math.max(18,(src.getStats?.().damage||d.damage)*.42*game.allyDamageMultiplier()),d.color,30,{id:"ally_echo",def:{tags:["ally","area"]}},false)}else{const n=normalize(target.x-this.x,target.y-this.y);game.projectiles.push(new Projectile({x:this.x,y:this.y,vx:n.x*680,vy:n.y*680,radius:5,damage:(eligible?Math.max(16,(src.getStats?.().damage||d.damage)*.45):d.damage)*game.allyDamageMultiplier(),life:1.4,pierce:eligible&&src.def.tags?.includes("projectile")?1:0,color:d.color,weapon:{id:"ally_echo",def:{tags:["ally","projectile"]}},statSourceId:"ally_echo"}))}}}}
 else if(this.id==="aurelion"){const f=this.followPoint(game.player.hp/game.player.maxHp<.35?90:185);this.moveToward(f.x,f.y,d.speed,dt);if(this.cool<=0){const t=game.findCluster(this.x,this.y,720)||game.findNearest(this.x,this.y,720);if(t){this.cool=d.cooldown/atkSp;game.explosion(t.x,t.y,92,d.damage*game.allyDamageMultiplier(),"#7ee7ff",80,{id:"ally_aurelion",def:{tags:["ally","area","electric"]}},false);game.effects.push(new AreaEffect({x:t.x,y:t.y,radius:75,life:2.4,damage:8*game.allyDamageMultiplier(),tick:.5,color:"rgba(82,196,255,.16)",weapon:{id:"ally_aurelion_storm",def:{tags:["ally","area","electric"]}},status:{type:"burn",duration:1.4,strength:2}}))}}if(this.special<=0){this.special=7/atkSp;let cur=game.findNearest(this.x,this.y,650),used=new Set();for(let i=0;i<4&&cur;i++){used.add(cur);this.hitEnemy(cur,24,20,{type:"slow",duration:1.2,strength:.18});game.lightning.push({pts:[{x:i?this.x:this.x,y:i?this.y:this.y},{x:cur.x,y:cur.y}],life:.12,max:.12,color:d.color});cur=game.nearestList(cur.x,cur.y,210,6).find(e=>!used.has(e))}}if(game.player.hp/game.player.maxHp<.35){let b=0;for(const p of game.enemyProjectiles){if(!p.dead&&Math.hypot(p.x-game.player.x,p.y-game.player.y)<125&&b<2){p.dead=true;b++}}}}
 else if(this.id==="morrow"){const f=this.followPoint(145);this.moveToward(f.x,f.y,d.speed,dt);if((!game.morrowMark||game.morrowMark.target?.dead)&&this.special<=0){this.special=6.2/atkSp;let t=null,best=-1;for(const e of game.enemies){if(e.dead||e.isCaptive)continue;const value=e.maxHp*(e.isBoss?3:e.isMiniBoss?2:e.elite?1.5:1);if(value>best&&Math.hypot(e.x-this.x,e.y-this.y)<760){best=value;t=e}}if(t){game.morrowMark={target:t,stored:0,time:6};game.texts.push(new FloatingText(t.x,t.y-t.size-16,VSX.lang==="vi"?"SỔ NỢ TỬ THẦN":"DEATH LEDGER",d.color,11))}}if(this.cool<=0){const t=game.findNearest(this.x,this.y,620);if(t){this.cool=d.cooldown/atkSp;this.hitEnemy(t,d.damage,20)}}}
 else if(this.id==="rook"){this.anchorTimer=Math.max(0,(this.anchorTimer||0)-dt);this.anchorCd=(this.anchorCd||6)-dt;const f=this.followPoint(100);if(this.anchorTimer<=0)this.moveToward(f.x,f.y,d.speed,dt);if(this.anchorCd<=0){this.anchorCd=10;this.anchorTimer=4.5;game.texts.push(new FloatingText(this.x,this.y-35,VSX.lang==="vi"?"NEO CÔNG THÀNH":"SIEGE ANCHOR",d.color,11))}const close=game.findNearest(this.x,this.y,230);if(close){this.rotary=(this.rotary||0)-dt;if(this.rotary<=0){this.rotary=(this.anchorTimer>0?.14:.26)/atkSp;const n=normalize(close.x-this.x,close.y-this.y);game.projectiles.push(new Projectile({x:this.x,y:this.y,vx:n.x*620,vy:n.y*620,radius:4,damage:13*game.allyDamageMultiplier(),life:.7,pierce:0,color:d.color,weapon:{id:"ally_rook_rotary",def:{tags:["ally","projectile"]}},statSourceId:"ally_rook"}))}}else if(this.cool<=0){const t=game.findCluster(this.x,this.y,780)||game.findNearest(this.x,this.y,780);if(t){this.cool=d.cooldown/atkSp;game.effects.push(new DelayedStrike(t.x,t.y,85,.55,d.damage*game.allyDamageMultiplier(),{id:"ally_rook_mortar",def:{tags:["ally","area","explosive"]}}))}}if(this.anchorTimer>0){let n=0;for(const p of game.enemyProjectiles){if(!p.dead&&Math.hypot(p.x-this.x,p.y-this.y)<115&&n<4){p.dead=true;n++}}if(n)game.stats.projectilesBlocked+=n}}
 else if(this.id==="umbra"){let t=null,best=1;for(const e of game.enemies){if(e.dead||e.isCaptive)continue;const r=e.hp/e.maxHp;if(r<best&&Math.hypot(e.x-this.x,e.y-this.y)<900){best=r;t=e}}if(t&&this.cool<=0){this.cool=d.cooldown/atkSp;const oldx=this.x,oldy=this.y,a=Math.random()*Math.PI*2;this.x=t.x+Math.cos(a)*(t.size+24);this.y=t.y+Math.sin(a)*(t.size+24);game.umbraDecoys.push(new VSX_UmbraDecoy(oldx,oldy));let dmg=d.damage;if(!vsxProtectedExecuteTarget(t)&&t.hp/t.maxHp<.16)dmg=Math.max(dmg,t.hp+1);this.hitEnemy(t,dmg,38);game.spark(t.x,t.y,d.color,10)}else{const f=this.followPoint(105);this.moveToward(f.x,f.y,d.speed,dt)}}
};

const SIXALLY_BASE_ALLY_RENDER=VSX_NarrativeAlly.prototype.render;
VSX_NarrativeAlly.prototype.render=function(g){if(this.dead||!["seraph","echo","aurelion","morrow","rook","umbra"].includes(this.id))return SIXALLY_BASE_ALLY_RENDER.call(this,g);const d=this.def;g.save();g.translate(this.x,this.y);g.shadowBlur=16;g.shadowColor=d.color;g.fillStyle=d.color;g.strokeStyle=d.color;g.lineWidth=3;if(this.id==="seraph"){g.beginPath();g.moveTo(-15,0);g.quadraticCurveTo(-9,-14,0,-5);g.quadraticCurveTo(9,-14,15,0);g.quadraticCurveTo(9,11,0,5);g.quadraticCurveTo(-9,11,-15,0);g.stroke();g.beginPath();g.arc(0,0,6,0,Math.PI*2);g.fill()}else if(this.id==="echo"){g.rotate(Math.PI/4);g.strokeRect(-11,-11,22,22);g.rotate(-Math.PI/4);g.beginPath();g.arc(0,0,6,0,Math.PI*2);g.fill()}else if(this.id==="aurelion"){g.beginPath();g.moveTo(-17,5);g.lineTo(-4,-8);g.lineTo(0,0);g.lineTo(7,-11);g.lineTo(17,6);g.lineTo(3,4);g.lineTo(0,13);g.lineTo(-3,4);g.closePath();g.fill()}else if(this.id==="morrow"){g.beginPath();g.arc(0,-2,12,Math.PI,0);g.lineTo(9,13);g.lineTo(-9,13);g.closePath();g.fill();g.fillStyle="#1a1230";g.fillRect(-6,0,4,4);g.fillRect(2,0,4,4)}else if(this.id==="rook"){g.strokeRect(-17,-15,34,30);g.fillStyle="rgba(255,189,114,.3)";g.fillRect(-13,-11,26,22);g.fillStyle=d.color;g.fillRect(6,-22,5,12)}else{g.globalAlpha=.85;g.beginPath();g.moveTo(0,-16);g.lineTo(13,10);g.lineTo(0,6);g.lineTo(-13,10);g.closePath();g.fill();g.globalAlpha=.25;g.beginPath();g.arc(0,0,22,0,Math.PI*2);g.stroke()}g.fillStyle="#07111d";g.font="900 8px Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(d.glyph,0,1);g.restore();const w=36;g.fillStyle="rgba(4,10,20,.82)";g.fillRect(this.x-w/2,this.y-this.radius-11,w,4);g.fillStyle=d.color;g.fillRect(this.x-w/2,this.y-this.radius-11,w*clamp(this.hp/this.maxHp,0,1),4)};

const SIXALLY_BASE_GAME_RENDER=Game.prototype.render;
Game.prototype.render=function(){const r=SIXALLY_BASE_GAME_RENDER.call(this);if(!this.player||this.state==="TITLE")return r;ctx.save();ctx.translate(-this.camera.x,-this.camera.y);for(const q of this.morrowThralls||[])if(!q.dead)q.render(ctx);for(const q of this.umbraDecoys||[])if(!q.dead)q.render(ctx);ctx.restore();return r};

const SIXALLY_BASE_END=Game.prototype.endGame;
Game.prototype.endGame=function(){const s=this.storyAllyMap?.get("seraph");if(s&&!s.dead&&!this.seraphSaveUsed&&this.player?.hp<=0){this.seraphSaveUsed=true;this.player.hp=1;this.player.invuln=2;s.hp-=s.maxHp*.40;if(s.hp<=0){s.hp=0;s.dead=true}this.spark(this.player.x,this.player.y,"#fff0a3",30);VSX.announce(t("allyNetwork"),VSX.lang==="vi"?"SERAPH-IX KÍCH HOẠT CỨU HỘ KHẨN CẤP":"SERAPH-IX TRIGGERED EMERGENCY SALVATION","#fff0a3");return}return SIXALLY_BASE_END.call(this)};

const SIXALLY_BASE_INTERACT_UPDATE=Game.prototype.update;
Game.prototype.update=function(dt){const r=SIXALLY_BASE_INTERACT_UPDATE.call(this,dt);if(this.state!=="PLAYING"||!this.player)return r;const ih=document.getElementById("vsxInteractHint");let near=null,best=999;for(const o of this.recruitObjects||[]){if(o.dead||!["echo_mirror","morrow_soul"].includes(o.type))continue;const d=Math.hypot(o.x-this.player.x,o.y-this.player.y);if(d<best){best=d;near=o}}if(near&&best<105){this.nearSixAllyInteractable=near;if(ih&&!this.nearRecruitInteractable&&!this.nearTrialPortal){ih.style.display="block";ih.textContent=near.type==="echo_mirror"?(VSX.lang==="vi"?"E — KÍCH HOẠT PHẢN CHIẾU":"E — ACTIVATE MIRROR"):(VSX.lang==="vi"?"E — MỞ KHẾ ƯỚC LINH HỒN":"E — OPEN SOUL CONTRACT")}}else this.nearSixAllyInteractable=null;return r};
const SIXALLY_BASE_HANDLE=Game.prototype.handleKey;
Game.prototype.handleKey=function(code){if(this.state==="PLAYING"&&code==="KeyE"&&this.nearSixAllyInteractable){this.nearSixAllyInteractable.interact();return}return SIXALLY_BASE_HANDLE.call(this,code)};

const SIXALLY_BASE_OBJECTIVE=currentRecruitObjective;
currentRecruitObjective=function(g){if(g.activeRecruitChallenge==="seraph"){const b=g.recruitObjects.find(o=>o.type==="seraph_beacon"&&!o.dead);return `${t("seraphObjective")} ${g.seraphSeals||0}/3${b?.stage==="defend"?` • ${Math.floor(clamp(b.progress/15,0,1)*100)}%`:""}`}if(g.activeRecruitChallenge==="echo"||g.activeRecruitChallenge==="echo_duel")return t("echoObjective");if(g.activeRecruitChallenge==="aurelion"){const e=g.recruitObjects.find(o=>o.type==="aurelion_egg"&&!o.dead);return `${t("aurelionObjective")} • ${Math.max(0,Math.ceil(((e?.targetTime||g.time)-g.time)/60))} ${VSX.lang==="vi"?"Đợt":"Wave"}`}if(g.activeRecruitChallenge==="morrow")return t("morrowObjective");if(g.activeRecruitChallenge==="rook"){const r=g.recruitObjects.find(o=>o.type==="rook_repair"&&!o.dead);return `${t("rookObjective")} ${g.rookModules||0}/3${r?.stage==="defend"?` • ${Math.floor(clamp(r.progress/15,0,1)*100)}%`:""}`}if(g.activeRecruitChallenge==="umbra"||g.activeRecruitChallenge==="umbra_hunt")return `${t("umbraObjective")} ${Math.min(3,g.umbraTrace||0)}/3`;return SIXALLY_BASE_OBJECTIVE(g)};

const SIXALLY_BASE_HUD_RENDER=renderStoryAllyHud;
renderStoryAllyHud=function(g){SIXALLY_BASE_HUD_RENDER(g);const el=document.getElementById("vsxAllyHud");if(!el)return;for(const a of g.storyAllies||[]){if(!["seraph","echo","aurelion","morrow","rook","umbra"].includes(a.id))continue;const cards=[...el.querySelectorAll(".vsxAllyCard")],card=cards.find(c=>c.querySelector(".vsxAllyName")?.textContent===allyShort(a.id));if(card){const n=card.querySelector(".vsxAllyName");if(n)n.innerHTML=`${VSX.esc(allyShort(a.id))}<small style="display:block;color:#718ca7;font-size:7px;margin-top:1px">${VSX.esc(a.def.role[VSX.lang])}</small>`}}};
