(function(){
"use strict";

/* =========================================================
   CONTENT REGISTRIES
   ========================================================= */
const VSX_NEW_FREE_SURVIVORS=["castle_keeper","patient_zero","lion_dancer","water_puppeteer","kite_master","night_market_chef"];
const VSX_NEW_SHOP_SURVIVORS=["tomb_sovereign","beatmaster","ring_champion","titan_pilot","void_director","dragon_emperor"];
const VSX_NEW_WEAPONS=["castle_bell","grave_hands","firecracker_chain","lotus_puppets","razor_kite","skewer_launcher","scarab_swarm","bass_driver","meteor_palm","rail_halo","spotlight_rig","dragon_pearl"];
const VSX_PREMIUM_SURVIVORS={
 tomb_sovereign:{rarity:"epic",currency:"kills",cost:9000,color:"#e9c76f"},
 beatmaster:{rarity:"epic",currency:"kills",cost:10500,color:"#cb87ff"},
 ring_champion:{rarity:"epic",currency:"kills",cost:12000,color:"#ff8c62"},
 titan_pilot:{rarity:"legendary",currency:"kills",cost:20000,color:"#76dfff"},
 void_director:{rarity:"legendary",currency:"kills",cost:24000,color:"#d49aff"},
 dragon_emperor:{rarity:"legendary",currency:"kills",cost:30000,color:"#ffd65a"}
};
const VSX_NEW_ULT_META={
 level_shift:{name:{en:"LEVEL SHIFT",vi:"CHUYỂN MÀN"},desc:{en:"Turns the battlefield into a crushing castle stage.",vi:"Biến chiến trường thành màn lâu đài với các đợt nghiền ép."}},
 outbreak:{name:{en:"OUTBREAK",vi:"BÙNG DỊCH"},desc:{en:"Slain normal enemies rise briefly as allied infected.",vi:"Địch thường bị hạ sẽ tạm đứng dậy chiến đấu cho bạn."}},
 awaken_lion:{name:{en:"AWAKEN THE LION",vi:"LÂN THỨC GIẤC"},desc:{en:"Lion form devours hostile bullets and counterattacks with fireworks.",vi:"Hóa Lân, nuốt đạn địch rồi phản công bằng pháo hoa."}},
 water_festival:{name:{en:"WATER FESTIVAL",vi:"HỘI RỐI NƯỚC"},desc:{en:"Floods the arena and unleashes rotating puppet formations.",vi:"Ngập sân đấu và tung các đội hình rối nước liên hoàn."}},
 monsoon_updraft:{name:{en:"MONSOON UPDRAFT",vi:"CUỒNG PHONG NÂNG CÁNH"},desc:{en:"Lifts crowds into a violent aerial vortex.",vi:"Cuốn đám đông lên không trung trong một xoáy gió dữ dội."}},
 night_market_rush:{name:{en:"NIGHT MARKET RUSH",vi:"CHỢ ĐÊM XUẤT TRẬN"},desc:{en:"Four food carts charge through the field and leave different rewards.",vi:"Bốn xe hàng lao xuyên chiến trường và để lại bốn loại phần thưởng."}},
 weigh_the_heart:{name:{en:"WEIGH THE HEART",vi:"CÂN TRÁI TIM"},desc:{en:"Executes weakened mobs and condemns elites and bosses.",vi:"Phán quyết địch yếu và giáng Án lên Elite/Boss."}},
 drop_the_void:{name:{en:"DROP THE VOID",vi:"THẢ NHỊP HƯ KHÔNG"},desc:{en:"Eight battlefield beats reflect, pull and detonate enemies.",vi:"Tám nhịp chiến trường phản đạn, hút địch rồi kích nổ."}},
 sacred_ring:{name:{en:"SACRED RING",vi:"THÁNH ĐÀI"},desc:{en:"Creates a ring where boundary impacts become devastating ring-outs.",vi:"Dựng võ đài; kẻ chạm biên chịu cú Ring-out cực mạnh."}},
 titanfall:{name:{en:"TITANFALL",vi:"TITAN THIÊN GIÁNG"},desc:{en:"Pilot a combat Titan with its own armor and weapons for 12 seconds.",vi:"Điều khiển Titan chiến đấu có giáp và hỏa lực riêng trong 12 giây."}},
 retake:{name:{en:"CUT! — RETAKE",vi:"CẮT! — QUAY LẠI!"},desc:{en:"Rewinds enemies and hostile bullets four seconds without restoring their HP.",vi:"Tua vị trí địch và đạn về 4 giây trước nhưng không hoàn lại máu đã mất."}},
 nine_dragons:{name:{en:"NINE DRAGON ASCENSION",vi:"CỬU LONG THĂNG THIÊN"},desc:{en:"Nine dragon passes sweep the battlefield, then empower Echo Casts.",vi:"Cửu Long quét chiến trường rồi mở trạng thái Vọng Kích."}}
};

Object.assign(CHARACTER_DEFINITIONS,{
 castle_keeper:{name:{en:"Castle Keeper",vi:"Chúa Thành"},desc:{en:"A fortress-minded survivor who controls lanes with moving gates.",vi:"Sinh tồn theo lối phòng thành, điều khiển luồng địch bằng những cổng thành lao tới."},weapon:"castle_bell",mods:{armor:1,move:.94,area:1.08},ultimate:"level_shift",rarity:"rare"},
 patient_zero:{name:{en:"Patient Zero",vi:"Vật Chủ Số 0"},desc:{en:"A plague carrier who turns death itself into battlefield pressure.",vi:"Vật chủ dịch bệnh biến chính những cái chết quanh mình thành áp lực chiến trường."},weapon:"grave_hands",mods:{healing:.82,damage:1.06,duration:1.12},ultimate:"outbreak",rarity:"rare"},
 lion_dancer:{name:{en:"Lion Dancer",vi:"Nghệ Nhân Múa Lân"},desc:{en:"Mobile crowd fighter powered by firecrackers and aggressive movement.",vi:"Đấu sĩ cơ động dùng tràng pháo và nhịp di chuyển áp sát để phá đội hình địch."},weapon:"firecracker_chain",mods:{move:1.08,dodge:.03},ultimate:"awaken_lion",rarity:"rare"},
 water_puppeteer:{name:{en:"Water Puppeteer",vi:"Nghệ Nhân Rối Nước"},desc:{en:"Shapes crossfire between enchanted water puppets and control zones.",vi:"Giăng đường cắt bằng rối nước và kiểm soát không gian theo đội hình."},weapon:"lotus_puppets",mods:{area:1.10,duration:1.15},ultimate:"water_festival",rarity:"rare"},
 kite_master:{name:{en:"Kite Master",vi:"Nghệ Nhân Thả Diều"},desc:{en:"Turns movement into a cutting weapon through wind and tether control.",vi:"Biến chuyển động thành vũ khí bằng sức gió và dây diều cắt chiến trường."},weapon:"razor_kite",mods:{move:1.06,projectileSpeed:1.15,pickup:1.18},ultimate:"monsoon_updraft",rarity:"rare"},
 night_market_chef:{name:{en:"Night Market Chef",vi:"Bếp Trưởng Chợ Đêm"},desc:{en:"Pierces crowds with skewers and converts Ultimate time into a moving reward market.",vi:"Xiên xuyên đám đông và biến Tuyệt Kỹ thành một khu chợ thưởng di động."},weapon:"skewer_launcher",mods:{healing:1.08,luck:.6},ultimate:"night_market_rush",rarity:"rare"},
 tomb_sovereign:{name:{en:"Tomb Sovereign",vi:"Pharaon Tử Giới"},desc:{en:"EPIC — Commands armor-eating scarabs and judges weakened enemies.",vi:"EPIC — Điều khiển bọ hung bào mòn phòng thủ và phán xét kẻ đã suy yếu."},weapon:"scarab_swarm",mods:{area:1.10,duration:1.12},ultimate:"weigh_the_heart",rarity:"epic",shopOnly:true},
 beatmaster:{name:{en:"Beatmaster",vi:"Nhạc Trưởng Hư Không"},desc:{en:"EPIC — Builds rhythmic detonations and weaponizes battlefield tempo.",vi:"EPIC — Tích nhịp để kích nổ và biến tiết tấu chiến trường thành vũ khí."},weapon:"bass_driver",mods:{attackSpeed:1.12,move:1.03},ultimate:"drop_the_void",rarity:"epic",shopOnly:true},
 ring_champion:{name:{en:"Ring Champion",vi:"Võ Sĩ Thánh Đài"},desc:{en:"EPIC — Converts knockback into brutal ring control and impact damage.",vi:"EPIC — Biến lực hất văng thành kiểm soát võ đài và sát thương va chạm."},weapon:"meteor_palm",mods:{armor:1,knockback:1.28},ultimate:"sacred_ring",rarity:"epic",shopOnly:true},
 titan_pilot:{name:{en:"Titan Pilot",vi:"Phi Công Titan"},desc:{en:"LEGENDARY — Defensive pilot whose Ultimate replaces the survivor with a combat Titan.",vi:"LEGENDARY — Phi công phòng thủ có Tuyệt Kỹ thay nhân vật bằng Titan chiến đấu."},weapon:"rail_halo",mods:{hp:1.12,move:.92,shieldCap:1.25},ultimate:"titanfall",rarity:"legendary",shopOnly:true},
 void_director:{name:{en:"Void Director",vi:"Đạo Diễn Hư Không"},desc:{en:"LEGENDARY — Marks enemies with stage light and rewinds battlefield positions without undoing damage.",vi:"LEGENDARY — Đánh dấu bằng ánh đèn sân khấu và tua vị trí chiến trường mà không hoàn sát thương."},weapon:"spotlight_rig",mods:{crit:.08,duration:1.12},ultimate:"retake",rarity:"legendary",shopOnly:true},
 dragon_emperor:{name:{en:"Dragon Emperor",vi:"Long Đế"},desc:{en:"LEGENDARY — Feeds a celestial pearl with combat damage and commands nine dragon passes.",vi:"LEGENDARY — Nuôi Long Châu bằng sát thương chiến đấu và triệu Cửu Long quét sân."},weapon:"dragon_pearl",mods:{area:1.12,crit:.10,attackSpeed:.92,critDamage:1.12},ultimate:"nine_dragons",rarity:"legendary",shopOnly:true}
});

Object.assign(WEAPON_DEFINITIONS,{
 castle_bell:{name:"Castle Bell",desc:"Calls moving castle gates that bulldoze entire enemy lanes.",rarity:"rare",tags:["area","physical","control"],behavior:"castleBell",damage:38,cooldown:2.3,range:720,area:92,knockback:105,maxLevel:5,levels:lv({}, {damageMul:1.22},{cooldownMul:.86},{areaMul:1.22},{special:"twinGate"})},
 grave_hands:{name:"Grave Hands",desc:"Cursed hands erupt beneath clusters, pulling and pinning enemies.",rarity:"uncommon",tags:["area","control","arcane"],behavior:"graveHands",damage:15,cooldown:1.85,area:96,duration:1.6,knockback:-35,maxLevel:5,levels:lv({}, {areaMul:1.18},{damageMul:1.25},{durationMul:1.25},{special:"massGrasp"})},
 firecracker_chain:{name:"Firecracker Chain",desc:"A curved chain of sequential blasts races through enemy packs.",rarity:"rare",tags:["area","fire","explosive"],behavior:"firecrackerChain",damage:17,cooldown:1.7,range:610,area:42,count:7,knockback:38,maxLevel:5,levels:lv({}, {countAdd:2},{damageMul:1.23},{cooldownMul:.84},{special:"grandFinale"})},
 lotus_puppets:{name:"Lotus Puppets",desc:"Two orbiting puppets connect with a cutting water-thread attack.",rarity:"uncommon",tags:["area","control","arcane"],behavior:"lotusPuppets",damage:18,cooldown:.72,range:230,orbitRadius:108,size:8,knockback:18,maxLevel:5,levels:lv({}, {orbitRadiusMul:1.16},{damageMul:1.25},{cooldownMul:.82},{special:"tripleFormation"})},
 razor_kite:{name:"Razor Kite",desc:"A windborne kite trails the player; its tether slices anything crossing it.",rarity:"rare",tags:["area","physical","control"],behavior:"razorKite",damage:12,cooldown:.20,range:172,size:10,knockback:24,maxLevel:5,levels:lv({}, {rangeMul:1.16},{damageMul:1.25},{cooldownMul:.82},{special:"stormKite"})},
 skewer_launcher:{name:"Skewer Launcher",desc:"Launches burning skewers that pierce crowds in tight lines.",rarity:"uncommon",tags:["projectile","fire","physical"],behavior:"skewerLauncher",damage:25,cooldown:.88,speed:650,size:6,count:2,pierce:3,knockback:30,status:{type:"burn",duration:2.2,strength:3},maxLevel:5,levels:lv({}, {countAdd:1},{pierceAdd:2},{damageMul:1.28},{special:"feastVolley"})},
 scarab_swarm:{name:"Scarab Swarm",desc:"Seeking scarabs prioritize tough prey and leave them vulnerable.",rarity:"epic",shopLocked:true,tags:["projectile","homing","summon","arcane"],behavior:"scarabSwarm",damage:17,cooldown:1.18,speed:390,size:5,count:3,pierce:0,status:{type:"vulnerable",duration:2.2,strength:.12},maxLevel:5,levels:lv({}, {countAdd:1},{damageMul:1.25},{cooldownMul:.82},{special:"royalScarab"})},
 bass_driver:{name:"Bass Driver",desc:"Sound rings build Beat stacks; every fourth Beat detonates the target.",rarity:"rare",shopLocked:true,tags:["area","control","arcane"],behavior:"bassDriver",damage:20,cooldown:.88,area:165,knockback:30,maxLevel:5,levels:lv({}, {areaMul:1.16},{damageMul:1.24},{cooldownMul:.82},{special:"subwoofer"})},
 meteor_palm:{name:"Meteor Palm",desc:"A heavy cone strike launches enemies and turns impact into splash damage.",rarity:"uncommon",shopLocked:true,tags:["melee","area","physical"],behavior:"meteorPalm",damage:39,cooldown:1.08,range:205,area:55,knockback:132,maxLevel:5,levels:lv({}, {rangeMul:1.15},{damageMul:1.25},{cooldownMul:.84},{special:"impactCrater"})},
 rail_halo:{name:"Rail Halo",desc:"Three rotating rail nodes form a lethal triangle and discharge together.",rarity:"epic",shopLocked:true,tags:["beam","energy","area"],behavior:"railHalo",damage:35,cooldown:1.8,orbitRadius:82,size:7,area:140,maxLevel:5,levels:lv({}, {damageMul:1.22},{orbitRadiusMul:1.12},{cooldownMul:.82},{special:"overrail"})},
 spotlight_rig:{name:"Spotlight Rig",desc:"A rotating stage light marks enemies; leaving the light triggers a stage strike.",rarity:"epic",shopLocked:true,tags:["beam","control","arcane"],behavior:"spotlightRig",damage:28,cooldown:.18,range:390,area:58,duration:1.2,maxLevel:5,levels:lv({}, {rangeMul:1.14},{damageMul:1.25},{durationMul:1.18},{special:"encoreSpot"})},
 dragon_pearl:{name:"Celestial Dragon Pearl",desc:"Stores a share of all combat damage, then releases sweeping dragon passes.",rarity:"epic",shopLocked:true,tags:["orbit","area","arcane"],behavior:"dragonPearl",damage:48,cooldown:1,orbitRadius:88,size:12,area:76,maxLevel:5,levels:lv({}, {damageMul:1.20},{orbitRadiusMul:1.12},{areaMul:1.16},{special:"imperialPearl"})}
});

Object.assign(VI_WEAPON,{
 castle_bell:["Chuông Thành","Gọi cổng thành lao qua chiến trường, ủi thẳng cả một tuyến địch."],
 grave_hands:["Tay Mồ","Những bàn tay nguyền rủa trồi lên dưới cụm địch, kéo và ghì chúng lại."],
 firecracker_chain:["Tràng Pháo","Chuỗi pháo nổ liên tiếp theo đường cong xuyên qua đội hình địch."],
 lotus_puppets:["Rối Sen","Hai con rối nước xoay quanh người chơi và giăng sợi nước cắt ngang chiến trường."],
 razor_kite:["Diều Cắt Gió","Con diều bay theo chuyển động; dây diều gây sát thương mọi kẻ cắt ngang."],
 skewer_launcher:["Xiên Nướng","Phóng xiên cháy xuyên qua nhiều mục tiêu trên cùng một đường."],
 scarab_swarm:["Bầy Bọ Hung","Bọ hung tự tìm kẻ cứng đầu nhất và để lại trạng thái Dễ Tổn Thương."],
 bass_driver:["Đại Bác Âm Trầm","Sóng âm tích Nhịp trên mục tiêu; đủ bốn Nhịp sẽ kích nổ."],
 meteor_palm:["Chưởng Trọng Lực","Chưởng hình quạt cực nặng, hất địch văng ra và gây chấn động khi va chạm."],
 rail_halo:["Vòng Railgun","Ba nút Railgun xoay quanh người chơi, tạo tam giác hỏa lực xuyên phá."],
 spotlight_rig:["Dàn Đèn Sân Khấu","Đèn sân khấu quét và đánh dấu; mục tiêu rời ánh đèn sẽ bị Stage Strike."],
 dragon_pearl:["Long Châu","Tích sát thương chiến đấu rồi giải phóng những đường rồng quét qua chiến trường."]
});

/* New weapons must participate in Lv5 mutation flow too. */
for(const id of VSX_NEW_WEAPONS){
 const d=WEAPON_DEFINITIONS[id];
 if(!WEAPON_MUTATIONS[id])WEAPON_MUTATIONS[id]=[
  {id:id+"__tempo",name:{en:"Tempo Form",vi:"Biến Thể Tốc Chiến"},desc:{en:"Faster cadence with broader coverage.",vi:"Tăng nhịp triển khai và độ phủ."},mods:{cooldownMul:.80,countAdd:1,damageMul:.94,areaMul:1.10}},
  {id:id+"__power",name:{en:"Power Form",vi:"Biến Thể Trọng Kích"},desc:{en:"Slower but much heavier impacts.",vi:"Chậm hơn nhưng mỗi đòn nặng và bùng nổ hơn."},mods:{damageMul:1.50,sizeMul:1.18,areaMul:1.15,knockbackMul:1.25,cooldownMul:1.16}}
 ];
}

/* =========================================================
   WEAPON EFFECTS + BEHAVIORS
   ========================================================= */
class VSX_CastleGateEffect{
 constructor(w,s,a,reverse=false){this.weapon=w;this.stats=s;this.a=a+(reverse?Math.PI:0);this.x=game.player.x-Math.cos(this.a)*360;this.y=game.player.y-Math.sin(this.a)*360;this.life=this.max=1.18;this.dead=false;this.hit=new Set();this.speed=690}
 update(dt){this.life-=dt;const ox=this.x,oy=this.y;this.x+=Math.cos(this.a)*this.speed*dt;this.y+=Math.sin(this.a)*this.speed*dt;for(const e of game.grid.queryCircle(this.x,this.y,this.stats.area+55)){if(e.dead||e.isCaptive||this.hit.has(e.id))continue;if(pointSegDist(e.x,e.y,ox,oy,this.x,this.y)<e.size+this.stats.area*.55){this.hit.add(e.id);game.damageEnemy(e,this.stats.damage,{source:this.weapon,canCrit:true,knockback:this.stats.knockback,fromX:ox,fromY:oy})}}if(this.life<=0)this.dead=true}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(this.a+Math.PI/2);const h=this.stats.area*1.2,w=34;g.fillStyle="#486078";g.strokeStyle="#9ddfff";g.lineWidth=2;g.fillRect(-w/2,-h/2,w,h);for(let y=-h/2;y<h/2;y+=18){g.fillStyle=(Math.floor(y/18)%2)?"#60778d":"#526a82";g.fillRect(-w/2+3,y+2,w-6,14)}g.strokeRect(-w/2,-h/2,w,h);g.restore()}
}
class VSX_GraveHandsEffect{
 constructor(w,s,x,y){this.weapon=w;this.stats=s;this.x=x;this.y=y;this.life=this.max=s.duration;this.dead=false;this.tick=0}
 update(dt){this.life-=dt;this.tick-=dt;for(const e of game.grid.queryCircle(this.x,this.y,this.stats.area+35)){if(e.dead||e.isCaptive)continue;const d=Math.hypot(e.x-this.x,e.y-this.y);if(d>this.stats.area+e.size)continue;const n=normalize(this.x-e.x,this.y-e.y),pull=(e.isBoss||e.isMiniBoss?24:72)*(1-e.knockbackResistance);e.x+=n.x*pull*dt;e.y+=n.y*pull*dt;e.applyStatus("slow",.28,e.isBoss?.18:.42,this.weapon)}if(this.tick<=0){this.tick=.38;for(const e of game.grid.queryCircle(this.x,this.y,this.stats.area))if(!e.dead&&!e.isCaptive)game.damageEnemy(e,this.stats.damage,{source:this.weapon,canCrit:true,damageType:"arcane",silent:true})}if(this.life<=0)this.dead=true}
 render(g){g.save();g.globalAlpha=.32+.12*Math.sin(game.time*8);g.strokeStyle="#b9a8d8";g.lineWidth=4;for(let i=0;i<7;i++){const a=i*Math.PI*2/7+game.time*.2,r=this.stats.area*.72,x=this.x+Math.cos(a)*r,y=this.y+Math.sin(a)*r;g.beginPath();g.moveTo(x,y+18);g.lineTo(x,y-12);g.stroke();for(let f=-2;f<=2;f++){g.beginPath();g.moveTo(x,y-10);g.lineTo(x+f*5,y-25-Math.abs(f)*2);g.stroke()}}g.strokeStyle="#8d6bd2";g.lineWidth=2;g.beginPath();g.arc(this.x,this.y,this.stats.area,0,Math.PI*2);g.stroke();g.restore()}
}
class VSX_WaterThreadEffect{
 constructor(w,s,a,count=2){this.weapon=w;this.stats=s;this.life=this.max=.42;this.dead=false;this.done=false;this.a=a;this.count=count}
 endpoints(i){const off=i*Math.PI*2/this.count;const a=this.a+off,x1=game.player.x+Math.cos(a)*this.stats.orbitRadius,y1=game.player.y+Math.sin(a)*this.stats.orbitRadius,x2=game.player.x-Math.cos(a)*this.stats.orbitRadius,y2=game.player.y-Math.sin(a)*this.stats.orbitRadius;return{x1,y1,x2,y2}}
 update(dt){this.life-=dt;if(!this.done){this.done=true;for(let i=0;i<this.count;i++){const q=this.endpoints(i);for(const e of game.grid.queryCircle(game.player.x,game.player.y,this.stats.orbitRadius+70)){if(e.dead||e.isCaptive)continue;if(pointSegDist(e.x,e.y,q.x1,q.y1,q.x2,q.y2)<=e.size+7){game.damageEnemy(e,this.stats.damage,{source:this.weapon,canCrit:true,damageType:"arcane",knockback:this.stats.knockback,fromX:game.player.x,fromY:game.player.y});e.applyStatus("slow",.7,.24,this.weapon)}}}}if(this.life<=0)this.dead=true}
 render(g){g.save();g.globalAlpha=clamp(this.life/this.max,0,1);g.strokeStyle="#72e8ff";g.shadowBlur=13;g.shadowColor="#72e8ff";g.lineWidth=3;for(let i=0;i<this.count;i++){const q=this.endpoints(i);g.beginPath();g.moveTo(q.x1,q.y1);g.quadraticCurveTo(game.player.x+Math.sin(game.time*5+i)*20,game.player.y+Math.cos(game.time*4+i)*20,q.x2,q.y2);g.stroke()}g.restore()}
}
class VSX_DragonSweepEffect{
 constructor(w,damage,a,color="#ffd65a",scale=1){this.weapon=w;this.damage=damage;this.a=a;this.color=color;this.scale=scale;this.life=this.max=.82;this.dead=false;this.hit=new Set();this.x=game.player.x-Math.cos(a)*620;this.y=game.player.y-Math.sin(a)*620;this.v=1550}
 update(dt){this.life-=dt;const ox=this.x,oy=this.y;this.x+=Math.cos(this.a)*this.v*dt;this.y+=Math.sin(this.a)*this.v*dt;for(const e of game.grid.queryCircle(this.x,this.y,80*this.scale)){if(e.dead||e.isCaptive||this.hit.has(e.id))continue;if(pointSegDist(e.x,e.y,ox,oy,this.x,this.y)<e.size+30*this.scale){this.hit.add(e.id);game.damageEnemy(e,this.damage,{source:this.weapon,canCrit:true,damageType:"arcane",knockback:75*this.scale,fromX:ox,fromY:oy})}}if(this.life<=0)this.dead=true}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(this.a);g.globalAlpha=.78;g.strokeStyle=this.color;g.fillStyle=this.color;g.shadowBlur=20;g.shadowColor=this.color;g.lineWidth=5*this.scale;g.beginPath();g.moveTo(-42*this.scale,0);for(let i=0;i<7;i++){const x=-32*this.scale+i*12*this.scale,y=Math.sin(i*1.8+game.time*10)*9*this.scale;g.lineTo(x,y)}g.stroke();g.beginPath();g.arc(34*this.scale,0,13*this.scale,0,Math.PI*2);g.fill();g.restore()}
}
class VSX_CastleStageEffect{
 constructor(){this.life=9;this.max=9;this.dead=false;this.timer=.45;this.phase=0;this.weapon={id:"ultimate_level_shift",def:{tags:["ultimate","area","physical"]}}}
 update(dt){this.life-=dt;this.timer-=dt;if(this.timer<=0){this.timer=.82;this.phase++;const p=game.player;for(let i=-1;i<=1;i++){const horizontal=this.phase%2===0,x=p.x+(horizontal?i*150:rand(210,-210)),y=p.y+(horizontal?rand(210,-210):i*150);game.telegraphs.push(new VSX_Telegraph({x,y,r:48,life:.58,color:"#89d9ff",callback:()=>game.explosion(x,y,58,46*game.player.damageMultiplier,"#6fb6d8",105,this.weapon,false)}))}}for(const e of game.grid.queryCircle(game.player.x,game.player.y,520))if(!e.dead&&!e.isBoss)e.applyStatus("slow",.2,.14,this.weapon);if(this.life<=0){game.explosion(game.player.x,game.player.y,330,95*game.player.damageMultiplier,"#7fc8ff",140,this.weapon,false);this.dead=true}}
 render(g){const p=game.player;g.save();g.globalAlpha=.18;g.strokeStyle="#77cfff";g.lineWidth=5;for(let i=-2;i<=2;i++){g.strokeRect(p.x-350,p.y+i*140-18,700,36);g.strokeRect(p.x+i*140-18,p.y-350,36,700)}g.globalAlpha=.5;g.strokeStyle="#d4efff";g.setLineDash([12,12]);g.strokeRect(p.x-330,p.y-330,660,660);g.setLineDash([]);g.restore()}
}
class VSX_NightCartEffect{
 constructor(a,type,index){this.a=a;this.type=type;this.index=index;this.life=this.max=2.1;this.dead=false;this.hit=new Set();this.x=game.player.x-Math.cos(a)*520+Math.cos(a+Math.PI/2)*(index-1.5)*78;this.y=game.player.y-Math.sin(a)*520+Math.sin(a+Math.PI/2)*(index-1.5)*78;this.v=520;this.weapon={id:"ultimate_night_market",def:{tags:["ultimate","area"]}}}
 update(dt){this.life-=dt;this.x+=Math.cos(this.a)*this.v*dt;this.y+=Math.sin(this.a)*this.v*dt;for(const e of game.grid.queryCircle(this.x,this.y,55)){if(e.dead||e.isCaptive||this.hit.has(e.id))continue;this.hit.add(e.id);game.damageEnemy(e,58*game.player.damageMultiplier,{source:this.weapon,canCrit:true,knockback:100,fromX:this.x-Math.cos(this.a)*20,fromY:this.y-Math.sin(this.a)*20})}if(this.life<=0){game.pickups.push(new Pickup(this.x,this.y,this.type));this.dead=true}}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(this.a);const colors={golden_boost:"#ffd65a",frenzy:"#ff9f43",health:"#ff6678",shield:"#89a7ff"};g.fillStyle=colors[this.type]||"#fff";g.shadowBlur=12;g.shadowColor=g.fillStyle;g.fillRect(-24,-14,48,28);g.fillStyle="#152032";g.beginPath();g.arc(-15,17,6,0,Math.PI*2);g.arc(15,17,6,0,Math.PI*2);g.fill();g.restore()}
}
class VSX_ZombieThrall{
 constructor(x,y){this.x=x;this.y=y;this.life=8;this.dead=false;this.radius=10;this.cool=0;this.source={id:"ultimate_outbreak",def:{tags:["ultimate","ally","summon"]}}}
 update(dt){this.life-=dt;this.cool-=dt;const t=game.findNearest(this.x,this.y,520);if(t){const n=normalize(t.x-this.x,t.y-this.y),d=Math.hypot(t.x-this.x,t.y-this.y);this.x+=n.x*(d>55?190:70)*dt;this.y+=n.y*(d>55?190:70)*dt;if(d<t.size+this.radius+10&&this.cool<=0){this.cool=.55;game.damageEnemy(t,26*game.player.damageMultiplier,{source:this.source,canCrit:false,knockback:35,fromX:this.x,fromY:this.y})}}if(this.life<=0)this.dead=true}
 render(g){g.save();g.translate(this.x,this.y);g.fillStyle="#78d66d";g.shadowBlur=8;g.shadowColor="#78d66d";g.beginPath();g.arc(0,0,this.radius,0,Math.PI*2);g.fill();g.fillStyle="#24331f";g.fillRect(-6,-2,4,4);g.fillRect(2,-2,4,4);g.restore()}
}

ATTACK_BEHAVIORS.castleBell=function(w,s){const t=game.findCluster(game.player.x,game.player.y,s.range)||game.findNearest(game.player.x,game.player.y,s.range);const a=t?Math.atan2(t.y-game.player.y,t.x-game.player.x):Math.atan2(game.lastMoveDir.y,game.lastMoveDir.x);game.effects.push(new VSX_CastleGateEffect(w,s,a));if(w.special==="twinGate")game.effects.push(new PulseDelayEffect(.32,()=>game.effects.push(new VSX_CastleGateEffect(w,s,a,true))));game.audio.beep(150,.13,"square",.02)};
ATTACK_BEHAVIORS.graveHands=function(w,s){const t=game.findCluster(game.player.x,game.player.y,560)||game.findNearest(game.player.x,game.player.y,560);if(!t)return;game.effects.push(new VSX_GraveHandsEffect(w,s,t.x,t.y));if(w.special==="massGrasp"){const t2=game.findNearest(t.x,t.y,260,t.id);if(t2)game.effects.push(new VSX_GraveHandsEffect(w,{...s,area:s.area*.72,damage:s.damage*.7},t2.x,t2.y))}};
ATTACK_BEHAVIORS.firecrackerChain=function(w,s){const t=game.findCluster(game.player.x,game.player.y,s.range)||game.findNearest(game.player.x,game.player.y,s.range);if(!t)return;const a=Math.atan2(t.y-game.player.y,t.x-game.player.x),per=a+Math.PI/2,count=Math.max(5,s.count);for(let i=0;i<count;i++){const d=55+i*55,x=game.player.x+Math.cos(a)*d+Math.cos(per)*Math.sin(i*.9)*28,y=game.player.y+Math.sin(a)*d+Math.sin(per)*Math.sin(i*.9)*28,fin=i===count-1;game.effects.push(new PulseDelayEffect(i*.075,()=>game.explosion(x,y,s.area*(fin&&w.special==="grandFinale"?1.55:1),s.damage*(fin&&w.special==="grandFinale"?2.0:1),"#ff7548",s.knockback,w,false)))}game.audio.beep(760,.05,"square",.014)};
ATTACK_BEHAVIORS.lotusPuppets=function(w,s){const count=w.special==="tripleFormation"?3:2;game.effects.push(new VSX_WaterThreadEffect(w,s,game.time*1.05,count));game.audio.beep(520,.035,"sine",.008)};
ATTACK_BEHAVIORS.skewerLauncher=function(w,s){const t=game.findCluster(game.player.x,game.player.y,680)||game.findNearest(game.player.x,game.player.y,680);if(!t)return;const base=Math.atan2(t.y-game.player.y,t.x-game.player.x),count=s.count+(w.special==="feastVolley"?2:0);for(let i=0;i<count;i++){const a=base+(i-(count-1)/2)*.09;const p=new Projectile({x:game.player.x,y:game.player.y,vx:Math.cos(a)*s.speed,vy:Math.sin(a)*s.speed,radius:s.size,damage:s.damage,life:1.65,color:"#ff9e55",weapon:w,pierce:s.pierce,behavior:"spear",knockback:s.knockback,status:s.status});p.vsxSkewer=true;game.projectiles.push(p)}};
ATTACK_BEHAVIORS.scarabSwarm=function(w,s){const pool=game.grid.queryCircle(game.player.x,game.player.y,760).filter(e=>!e.dead&&!e.isCaptive).sort((a,b)=>(Number(b.isBoss)-Number(a.isBoss))||(Number(b.elite)-Number(a.elite))||b.maxHp-a.maxHp);if(!pool.length)return;const count=s.count+(w.special==="royalScarab"?1:0);for(let i=0;i<count;i++){const t=pool[i%pool.length],a=Math.atan2(t.y-game.player.y,t.x-game.player.x);game.projectiles.push(new Projectile({x:game.player.x+rand(16,-16),y:game.player.y+rand(16,-16),vx:Math.cos(a)*s.speed,vy:Math.sin(a)*s.speed,radius:s.size,damage:s.damage,life:2.5,color:"#e0c14f",weapon:w,behavior:"homing",homingStrength:4.8,target:t,status:s.status,pierce:w.special==="royalScarab"?1:0}))}};
ATTACK_BEHAVIORS.bassDriver=function(w,s){game.effects.push(new WaveEffect(game.player.x,game.player.y,s.area,.58,0,0,w,"#c47cff"));for(const e of game.grid.queryCircle(game.player.x,game.player.y,s.area)){if(e.dead||e.isCaptive)continue;game.damageEnemy(e,s.damage,{source:w,canCrit:true,damageType:"arcane",knockback:s.knockback,fromX:game.player.x,fromY:game.player.y});e.vsxBassBeat=(e.vsxBassBeat||0)+1;if(e.vsxBassBeat>=4){e.vsxBassBeat=0;game.explosion(e.x,e.y,55+(w.special==="subwoofer"?22:0),s.damage*(w.special==="subwoofer"?2.1:1.55),"#b76dff",60,w,false)}}game.audio.beep(105,.09,"sawtooth",.018)};
ATTACK_BEHAVIORS.meteorPalm=function(w,s){const t=game.findNearest(game.player.x,game.player.y,s.range+100);if(!t)return;const a=Math.atan2(t.y-game.player.y,t.x-game.player.x);for(const e of game.grid.queryCircle(game.player.x,game.player.y,s.range+50)){if(e.dead||e.isCaptive)continue;const ea=Math.atan2(e.y-game.player.y,e.x-game.player.x),d=Math.hypot(e.x-game.player.x,e.y-game.player.y);if(d<=s.range+e.size&&Math.abs(angleDiff(ea,a))<.72){game.damageEnemy(e,s.damage,{source:w,canCrit:true,knockback:s.knockback,fromX:game.player.x,fromY:game.player.y});game.explosion(e.x,e.y,s.area,s.damage*(w.special==="impactCrater"?.38:.24),"#ff9b5a",35,w,false,true)}}game.effects.push(new WaveEffect(game.player.x,game.player.y,s.range,.34,0,0,w,"#ffb26d"));game.audio.beep(170,.06,"square",.018)};

/* Persistent weapons — intentionally separate from one-shot attack registry. */
const VSX_EXP_WEAPON_UPDATE_BASE=WeaponInstance.prototype.update;
WeaponInstance.prototype.update=function(dt){
 const b=this.def.behavior;
 if(b==="razorKite"){
  this.angle+=dt;
  this.cool-=dt;
  const s=this.getStats(),p=game.player,dir=game.lastMoveDir||{x:1,y:0};
  this.kitePhase=(this.kitePhase||0)+dt*(1.5+Math.min(1.2,p.movingTime*.08));
  const side=Math.sin(this.kitePhase)*48,back=-s.range;
  this.kiteX=p.x+dir.x*back-dir.y*side;
  this.kiteY=p.y+dir.y*back+dir.x*side;
  this.kiteHitTimes||=new Map();
  if(this.cool<=0){
   this.cool=Math.max(.08,s.cooldown);
   for(const e of game.grid.queryCircle((p.x+this.kiteX)/2,(p.y+this.kiteY)/2,s.range*.65+65)){
    if(e.dead||e.isCaptive)continue;
    if(pointSegDist(e.x,e.y,p.x,p.y,this.kiteX,this.kiteY)>e.size+7)continue;
    const r=this.kiteHitTimes.get(e.id)||0;
    if(r>game.time)continue;
    this.kiteHitTimes.set(e.id,game.time+.22);
    game.damageEnemy(e,s.damage*(1+Math.min(.7,p.movingTime*.025)),{source:this,canCrit:true,knockback:s.knockback,fromX:p.x,fromY:p.y});
   }
   if(this.special==="stormKite"&&Math.floor(game.time*2)%6===0)game.explosion(this.kiteX,this.kiteY,62,s.damage*.75,"#8eeaff",55,this,false);
  }
  return;
 }
 if(b==="railHalo"){
  this.angle+=dt*1.55;
  this.cool-=dt;
  const s=this.getStats();
  if(this.cool<=0){
   this.cool=Math.max(.18,s.cooldown);
   const pts=[];
   for(let i=0;i<3;i++){
    const a=this.angle+i*Math.PI*2/3;
    pts.push({x:game.player.x+Math.cos(a)*s.orbitRadius,y:game.player.y+Math.sin(a)*s.orbitRadius});
   }
   const sign=(p1,p2,p3)=>(p1.x-p3.x)*(p2.y-p3.y)-(p2.x-p3.x)*(p1.y-p3.y);
   const inside=(e)=>{
    const b1=sign(e,pts[0],pts[1])<0,b2=sign(e,pts[1],pts[2])<0,b3=sign(e,pts[2],pts[0])<0;
    return b1===b2&&b2===b3;
   };
   let hit=0;
   for(const e of game.grid.queryCircle(game.player.x,game.player.y,s.orbitRadius*1.4)){
    if(!e.dead&&!e.isCaptive&&inside(e)){
     game.damageEnemy(e,s.damage*(this.special==="overrail"?1.35:1),{source:this,canCrit:true,damageType:"arcane"});
     hit++;
    }
   }
   for(let i=0;i<3;i++){
    const q=pts[(i+1)%3];
    game.beams.push({x1:pts[i].x,y1:pts[i].y,x2:q.x,y2:q.y,life:.11,color:"#75e8ff",width:this.special==="overrail"?5:3});
   }
   if(!hit){
    const t=game.findNearest(game.player.x,game.player.y,760);
    if(t)for(const q of pts){
     game.beams.push({x1:q.x,y1:q.y,x2:t.x,y2:t.y,life:.1,color:"#75e8ff",width:2});
     game.damageEnemy(t,s.damage*.35,{source:this,canCrit:true,damageType:"arcane",silent:true});
    }
   }
  }
  return;
 }
 if(b==="spotlightRig"){
  this.angle=(this.angle||0)+dt*(this.special==="encoreSpot"?1.15:.82);
  this.cool-=dt;
  const s=this.getStats(),a=this.angle,cos=Math.cos(a),sin=Math.sin(a),current=new Map();
  for(const e of game.grid.queryCircle(game.player.x,game.player.y,s.range+30)){
   if(e.dead||e.isCaptive)continue;
   const dx=e.x-game.player.x,dy=e.y-game.player.y,d=Math.hypot(dx,dy);
   if(d>s.range+e.size)continue;
   const dot=(dx*cos+dy*sin)/Math.max(1,d);
   if(dot>.88){
    current.set(e.id,{x:e.x,y:e.y,ref:e});
    e.applyStatus("vulnerable",.4,.10+(this.special==="encoreSpot"?.06:0),this);
    game.damageEnemy(e,s.damage*.12,{source:this,canCrit:false,damageType:"arcane",silent:true});
   }
  }
  this.vsxSpotPrev||=new Map();
  for(const [id,q] of this.vsxSpotPrev){
   if(current.has(id)||q.ref?.dead)continue;
   const x=q.x,y=q.y;
   game.telegraphs.push(new VSX_Telegraph({x,y,r:s.area,life:.32,color:"#ffe99d",callback:()=>game.explosion(x,y,s.area,s.damage*(this.special==="encoreSpot"?1.45:1),"#fff0a6",45,this,false)}));
  }
  this.vsxSpotPrev=current;
  return;
 }
 if(b==="dragonPearl"){
  this.angle+=dt*1.4;
  const s=this.getStats(),total=game.stats?.damageDealt||0;
  this.vsxDragonPrev??=total;
  this.vsxDragonCharge=(this.vsxDragonCharge||0)+Math.max(0,total-this.vsxDragonPrev);
  this.vsxDragonPrev=total;
  const need=this.special==="imperialPearl"?185:245;
  if(this.vsxDragonCharge>=need){
   this.vsxDragonCharge-=need;
   const t=game.findCluster(game.player.x,game.player.y,850)||game.findNearest(game.player.x,game.player.y,850);
   const a=t?Math.atan2(t.y-game.player.y,t.x-game.player.x):Math.random()*Math.PI*2;
   game.effects.push(new VSX_DragonSweepEffect(this,s.damage,a,"#ffd65a",.82));
   game.audio.beep(690,.08,"triangle",.014);
  }
  return;
 }
 const before=this.cool,r=VSX_EXP_WEAPON_UPDATE_BASE.call(this,dt);
 if(game.vsxImperialEcho>0&&before<=0&&this.cool>0&&ATTACK_BEHAVIORS[this.def.behavior]&&!['mirrorClone','orbit','aegis','repulsor','companion','vanDijk','floodlights','trophyShield','medicalDrone','ironBall'].includes(this.def.behavior)&&Math.random()<.20){
  const src=this;
  game.effects.push(new PulseDelayEffect(.08,()=>{
   if(game.state==="PLAYING")ATTACK_BEHAVIORS[src.def.behavior]?.(src,src.getStats());
  }));
 }
 return r;
};
const VSX_EXP_WEAPON_RENDER_BASE=WeaponInstance.prototype.renderPersistent;
WeaponInstance.prototype.renderPersistent=function(g){VSX_EXP_WEAPON_RENDER_BASE.call(this,g);const s=this.getStats(),b=this.def.behavior;if(b==="lotusPuppets"){const count=this.special==="tripleFormation"?3:2;for(let i=0;i<count;i++){const a=game.time*1.05+i*Math.PI*2/count,x=game.player.x+Math.cos(a)*s.orbitRadius,y=game.player.y+Math.sin(a)*s.orbitRadius;g.save();g.translate(x,y);g.fillStyle="#7eeaff";g.shadowBlur=12;g.shadowColor="#7eeaff";g.beginPath();for(let k=0;k<6;k++){const q=k*Math.PI/3,r=k%2?5:10;g.lineTo(Math.cos(q)*r,Math.sin(q)*r)}g.closePath();g.fill();g.restore()}}else if(b==="razorKite"&&Number.isFinite(this.kiteX)){g.save();g.strokeStyle="#d5f6ff";g.lineWidth=1.6;g.beginPath();g.moveTo(game.player.x,game.player.y);g.lineTo(this.kiteX,this.kiteY);g.stroke();g.translate(this.kiteX,this.kiteY);g.rotate(game.time*.8);g.fillStyle="#68dfff";g.beginPath();g.moveTo(0,-14);g.lineTo(12,0);g.lineTo(0,15);g.lineTo(-12,0);g.closePath();g.fill();g.restore()}else if(b==="railHalo"){for(let i=0;i<3;i++){const a=this.angle+i*Math.PI*2/3,x=game.player.x+Math.cos(a)*s.orbitRadius,y=game.player.y+Math.sin(a)*s.orbitRadius;g.save();g.translate(x,y);g.rotate(a);g.fillStyle="#73e8ff";g.shadowBlur=12;g.shadowColor="#73e8ff";g.fillRect(-9,-3,18,6);g.restore()}}else if(b==="spotlightRig"){const a=this.angle||0;g.save();g.translate(game.player.x,game.player.y);const grad=g.createLinearGradient(0,0,Math.cos(a)*s.range,Math.sin(a)*s.range);grad.addColorStop(0,"rgba(255,246,184,.20)");grad.addColorStop(1,"rgba(255,246,184,0)");g.fillStyle=grad;g.beginPath();g.moveTo(0,0);g.arc(0,0,s.range,a-.50,a+.50);g.closePath();g.fill();g.restore()}else if(b==="dragonPearl"){const a=this.angle||0,x=game.player.x+Math.cos(a)*s.orbitRadius,y=game.player.y+Math.sin(a)*s.orbitRadius;g.save();g.shadowBlur=22;g.shadowColor="#ffd65a";const gr=g.createRadialGradient(x-4,y-5,2,x,y,s.size);gr.addColorStop(0,"#fffbd0");gr.addColorStop(.48,"#ffd65a");gr.addColorStop(1,"#c78315");g.fillStyle=gr;g.beginPath();g.arc(x,y,s.size,0,Math.PI*2);g.fill();g.restore()}};

/* Skewer visual identity without altering normal projectile collision. */
const VSX_EXP_PROJECTILE_RENDER_BASE=Projectile.prototype.render;
Projectile.prototype.render=function(g){if(!this.vsxSkewer)return VSX_EXP_PROJECTILE_RENDER_BASE.call(this,g);g.save();g.translate(this.x,this.y);g.rotate(Math.atan2(this.vy,this.vx));g.strokeStyle="#7a3d20";g.lineWidth=3;g.beginPath();g.moveTo(-this.radius*3.5,0);g.lineTo(this.radius*3.5,0);g.stroke();g.fillStyle="#ff9957";for(let i=-2;i<=2;i++){g.beginPath();g.arc(i*this.radius*1.2,0,this.radius*.72,0,Math.PI*2);g.fill()}g.restore()};

/* =========================================================
   ULTIMATE RUNTIME
   ========================================================= */
function vsxStartExpansionUlt(g,id,duration=0,data={}){g.ultimateCharge=0;g._ultReadyAnnounced=false;g.ultimateActive=true;g.stats.ultimates++;g.vsxExpansionUlt={id,time:duration,max:duration,...data};if(duration>0){g.ultimateBuff={id:"expansion_"+id,time:duration};g.ultimateBuffTimer=duration}VSX.announce(t("ultimate"),VSX_NEW_ULT_META[id]?.name?.[VSX.lang]||CHARACTER_DEFINITIONS[g.characterId].name[VSX.lang],"#b879ff");}
function vsxFinishExpansionUlt(g,explode=false){const u=g.vsxExpansionUlt;if(!u)return;if(u.id==="awaken_lion"&&explode)g.explosion(g.player.x,g.player.y,210,120*g.player.damageMultiplier,"#ffb342",160,{id:"ultimate_lion_finish",def:{tags:["ultimate","fire","area"]}},false);if(u.id==="monsoon_updraft"){for(const e of g.enemies){if(e.vsxMonsoon){delete e.vsxMonsoon;if(!e.dead)g.damageEnemy(e,58*g.player.damageMultiplier,{source:{id:"ultimate_monsoon",def:{tags:["ultimate","control"]}},canCrit:false,knockback:90,fromX:g.player.x,fromY:g.player.y})}}}if(u.id==="sacred_ring")for(const e of g.enemies)delete e.vsxRingInside;g.vsxExpansionUlt=null;g.ultimateActive=false;if(g.ultimateBuff?.id?.startsWith("expansion_"))g.ultimateBuff=null;g.ultimateBuffTimer=0;g.player?.recalc?.()}

const VSX_EXP_ULT_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){
 const id=CHARACTER_DEFINITIONS[this.characterId]?.ultimate;
 if(!Object.prototype.hasOwnProperty.call(VSX_NEW_ULT_META,id))return VSX_EXP_ULT_BASE.call(this);
 if(this.state!=="PLAYING"||this.ultimateCharge<100||this.ultimateActive)return;
 const p=this.player,src={id:"ultimate_"+id,def:{tags:["ultimate","area"]}};
 if(id==="level_shift"){vsxStartExpansionUlt(this,id,9);this.effects.push(new VSX_CastleStageEffect());p.recalc();return}
 if(id==="outbreak"){vsxStartExpansionUlt(this,id,10,{cap:18});this.vsxZombieThralls||=[];return}
 if(id==="awaken_lion"){vsxStartExpansionUlt(this,id,8,{swallowed:0,tick:0});p.recalc();return}
 if(id==="water_festival"){vsxStartExpansionUlt(this,id,9,{form:0,tick:0});return}
 if(id==="monsoon_updraft"){vsxStartExpansionUlt(this,id,7,{angle:0});return}
 if(id==="night_market_rush"){vsxStartExpansionUlt(this,id,2.4);const types=["golden_boost","frenzy","health","shield"];for(let i=0;i<4;i++)this.effects.push(new VSX_NightCartEffect(i*Math.PI/2,types[i],i));return}
 if(id==="weigh_the_heart"){
  vsxStartExpansionUlt(this,id,0);for(const e of [...this.enemies]){if(e.dead||e.isCaptive)continue;if(!e.isBoss&&!e.isMiniBoss&&!e.elite&&e.hp/e.maxHp<=.34)this.damageEnemy(e,e.hp+1,{source:src,canCrit:false});else if(e.elite||e.isMiniBoss){this.damageEnemy(e,Math.min(e.hp*.38,e.maxHp*.18),{source:src,canCrit:false,damageType:"arcane"});e.applyStatus("vulnerable",5,.24,src)}else if(e.isBoss){this.damageEnemy(e,Math.min(260*p.damageMultiplier,e.maxHp*.065),{source:src,canCrit:false,damageType:"arcane"});e.applyStatus("vulnerable",6,.18,src)}}this.effects.push(new WaveEffect(p.x,p.y,620,1.15,0,0,src,"#e6c66d"));this.ultimateActive=false;this.vsxExpansionUlt=null;return
 }
 if(id==="drop_the_void"){
  vsxStartExpansionUlt(this,id,3.2,{beat:0});for(let i=1;i<=8;i++)this.effects.push(new PulseDelayEffect(i*.34,()=>{const radius=260+i*18;this.effects.push(new WaveEffect(p.x,p.y,radius,.42,0,0,src,"#ca79ff"));if(i%2===1)for(const q of this.enemyProjectiles){if(q.dead)continue;if(Math.hypot(q.x-p.x,q.y-p.y)<radius){q.vx*=-1.25;q.vy*=-1.25;q.owner="player";q.weapon=src;q.damage=Math.max(12,q.damage*.75);q.color="#d9a4ff";q.hit=new Set()}}if(i===4)for(const e of this.grid.queryCircle(p.x,p.y,radius)){const n=normalize(p.x-e.x,p.y-e.y);e.x+=n.x*70*(1-e.knockbackResistance);e.y+=n.y*70*(1-e.knockbackResistance)}if(i===8)for(const e of this.grid.queryCircle(p.x,p.y,520)){const beats=e.vsxBassBeat||0;e.vsxBassBeat=0;if(!e.dead)this.damageEnemy(e,48*p.damageMultiplier*(1+beats*.22),{source:src,canCrit:true,damageType:"arcane"})}this.audio.beep(78+i*11,.08,"sawtooth",.018)}));return
 }
 if(id==="sacred_ring"){vsxStartExpansionUlt(this,id,10,{x:p.x,y:p.y,r:265,hit:new Map()});for(const e of this.grid.queryCircle(p.x,p.y,265))e.vsxRingInside=true;return}
 if(id==="titanfall"){vsxStartExpansionUlt(this,id,12,{armor:p.maxHp*1.65,maxArmor:p.maxHp*1.65,gat:.08,missile:.35,rail:1.5,trample:0});p.recalc();this.shake(14,.35);this.explosion(p.x,p.y,130,55*p.damageMultiplier,"#75e8ff",120,src,false);return}
 if(id==="retake"){
  vsxStartExpansionUlt(this,id,0);const hist=this.vsxDirectorHistory||[],target=hist.length?hist.reduce((best,q)=>Math.abs((this.time-4)-q.time)<Math.abs((this.time-4)-best.time)?q:best,hist[0]):null;if(target){for(const q of target.enemies){if(q.ref&&!q.ref.dead){q.ref.x=q.x;q.ref.y=q.y}}for(const q of target.bullets){if(q.ref&&!q.ref.dead){q.ref.x=q.x;q.ref.y=q.y;q.ref.vx=q.vx;q.ref.vy=q.vy}}this.vsxRetakeBuff=4;this.effects.push(new WaveEffect(p.x,p.y,520,.9,0,0,src,"#d49cff"));this.texts.push(new FloatingText(p.x,p.y-58,VSX.lang==="vi"?"ACTION! — SÁT THƯƠNG ĐƯỢC GIỮ NGUYÊN":"ACTION! — DAMAGE PRESERVED","#e4b8ff",16));p.recalc()}this.ultimateActive=false;this.vsxExpansionUlt=null;return
 }
 if(id==="nine_dragons"){
  vsxStartExpansionUlt(this,id,3.6);const target=this.boss&&!this.boss.dead?this.boss:(this.findCluster(p.x,p.y,900)||this.findNearest(p.x,p.y,900));const base=target?Math.atan2(target.y-p.y,target.x-p.x):0;for(let i=0;i<9;i++)this.effects.push(new PulseDelayEffect(i*.34,()=>{const a=i<2?(i?Math.PI/2:0):i<4?(i===2?Math.PI/4:-Math.PI/4):base+(i-4)*Math.PI*.36;this.effects.push(new VSX_DragonSweepEffect(src,72*p.damageMultiplier,a,"#ffd65a",1.15));if(i===8){if(this.boss&&!this.boss.dead)this.boss.applyStatus("vulnerable",6,.20,src);this.vsxImperialEcho=6;this.texts.push(new FloatingText(p.x,p.y-60,VSX.lang==="vi"?"VỌNG KÍCH 20%":"ECHO CAST 20%","#ffd65a",18))}}));return
 }
};

/* Expansion runtime runs after the existing game update, so it does not replace boss/event AI. */
const VSX_EXP_GAME_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
 const out=VSX_EXP_GAME_UPDATE_BASE.call(this,dt);if(this.state!=="PLAYING"||!this.player)return out;
 const edt=dt*(typeof VSX_ADMIN!=="undefined"?(VSX_ADMIN.speed||1):1);
 this.vsxImperialEcho=Math.max(0,(this.vsxImperialEcho||0)-edt);this.vsxRetakeBuff=Math.max(0,(this.vsxRetakeBuff||0)-edt);
 if(this.characterId==="void_director"){this.vsxDirectorSample=(this.vsxDirectorSample||0)-edt;if(this.vsxDirectorSample<=0){this.vsxDirectorSample=.22;this.vsxDirectorHistory||=[];this.vsxDirectorHistory.push({time:this.time,enemies:this.enemies.filter(e=>!e.dead).slice(0,360).map(e=>({ref:e,x:e.x,y:e.y})),bullets:this.enemyProjectiles.filter(q=>!q.dead).slice(0,260).map(q=>({ref:q,x:q.x,y:q.y,vx:q.vx,vy:q.vy}))});while(this.vsxDirectorHistory.length&&this.time-this.vsxDirectorHistory[0].time>4.8)this.vsxDirectorHistory.shift()}}else{this.vsxDirectorHistory=[]}
 const u=this.vsxExpansionUlt;if(u){u.time-=edt;
  if(u.id==="awaken_lion"){u.tick-=edt;for(const q of this.enemyProjectiles){if(q.dead)continue;if(Math.hypot(q.x-this.player.x,q.y-this.player.y)<78){q.dead=true;u.swallowed++;this.spark(q.x,q.y,"#ffd65a",4);if(u.swallowed%10===0)this.explosion(this.player.x,this.player.y,155,68*this.player.damageMultiplier,"#ffb442",100,{id:"ultimate_lion_firework",def:{tags:["ultimate","fire","area"]}},false)}}if(u.tick<=0){u.tick=.16;const dir=this.lastMoveDir||{x:1,y:0},cx=this.player.x+dir.x*48,cy=this.player.y+dir.y*48;for(const e of this.grid.queryCircle(cx,cy,70))if(!e.dead&&!e.isCaptive)this.damageEnemy(e,36*this.player.damageMultiplier,{source:{id:"ultimate_lion",def:{tags:["ultimate","melee"]}},canCrit:true,knockback:105,fromX:this.player.x,fromY:this.player.y,silent:true})}}
  else if(u.id==="water_festival"){u.tick-=edt;for(const q of this.enemyProjectiles){if(q.dead)continue;q.vsxWaterAge=(q.vsxWaterAge||0)+edt;const f=Math.pow(.45,edt);q.vx*=f;q.vy*=f;if(q.vsxWaterAge>2.6)q.dead=true}if(u.tick<=0){u.tick=.62;u.form++;const src={id:"ultimate_water_festival",def:{tags:["ultimate","area","control"]}},a=u.form*Math.PI/5;for(let k=0;k<4;k++){const aa=a+k*Math.PI/2,x1=this.player.x+Math.cos(aa)*360,y1=this.player.y+Math.sin(aa)*360,x2=this.player.x-Math.cos(aa)*360,y2=this.player.y-Math.sin(aa)*360;this.beams.push({x1,y1,x2,y2,life:.16,color:"#7eeaff",width:5});for(const e of this.grid.queryCircle(this.player.x,this.player.y,390))if(!e.dead&&!e.isCaptive&&pointSegDist(e.x,e.y,x1,y1,x2,y2)<e.size+9)this.damageEnemy(e,32*this.player.damageMultiplier,{source:src,canCrit:true,damageType:"arcane"})}}}
  else if(u.id==="monsoon_updraft"){u.angle+=edt*2.6;for(const e of this.grid.queryCircle(this.player.x,this.player.y,540)){if(e.dead||e.isCaptive)continue;if(e.isBoss){e.applyStatus("vulnerable",.3,.10,{id:"ultimate_monsoon"});continue}e.vsxMonsoon=true;const strength=e.elite?.35:1,idx=(e.id%17)/17*Math.PI*2,r=125+(e.id%6)*23,tx=this.player.x+Math.cos(u.angle+idx)*r,ty=this.player.y+Math.sin(u.angle+idx)*r-35*strength;e.x=lerp(e.x,tx,clamp(edt*4.5*strength,0,1));e.y=lerp(e.y,ty,clamp(edt*4.5*strength,0,1));e.applyStatus("slow",.25,e.elite?.30:.55,{id:"ultimate_monsoon"})}}
  else if(u.id==="sacred_ring"){const cx=u.x,cy=u.y,r=u.r;for(const e of this.grid.queryCircle(cx,cy,r+100)){if(e.dead||e.isCaptive)continue;const d=Math.hypot(e.x-cx,e.y-cy),inside=d<=r-e.size*.2;if(inside)e.vsxRingInside=true;if(e.vsxRingInside&&!inside&&d<r+80){const ready=u.hit.get(e.id)||0;if(ready<=this.time){u.hit.set(e.id,this.time+.7);const n=normalize(e.x-cx,e.y-cy);this.damageEnemy(e,64*this.player.damageMultiplier*(e.isBoss?.55:1),{source:{id:"ultimate_sacred_ring",def:{tags:["ultimate","melee","area"]}},canCrit:true,knockback:0});this.explosion(cx+n.x*r,cy+n.y*r,72,34*this.player.damageMultiplier,"#ffae69",85,{id:"ultimate_ringout",def:{tags:["ultimate","area"]}},false);e.x=cx+n.x*(r-e.size-8);e.y=cy+n.y*(r-e.size-8);this.texts.push(new FloatingText(e.x,e.y-e.size-10,"RING OUT!","#ffc77d",13))}}}}
  else if(u.id==="titanfall"){u.gat-=edt;u.missile-=edt;u.rail-=edt;u.trample-=edt;const p=this.player;if(u.gat<=0){u.gat=.11;const t=this.findNearest(p.x,p.y,760);if(t){const n=normalize(t.x-p.x,t.y-p.y);this.projectiles.push(new Projectile({x:p.x,y:p.y,vx:n.x*820,vy:n.y*820,radius:4,damage:18*p.damageMultiplier,life:1.4,color:"#77eaff",weapon:{id:"titan_gatling",def:{tags:["ultimate","projectile"]}},pierce:1}))}}if(u.missile<=0){u.missile=.95;const t=this.findCluster(p.x,p.y,800)||this.findNearest(p.x,p.y,800);if(t){const n=normalize(t.x-p.x,t.y-p.y);this.projectiles.push(new Projectile({x:p.x,y:p.y,vx:n.x*390,vy:n.y*390,radius:8,damage:52*p.damageMultiplier,life:2,color:"#ff9b58",weapon:{id:"titan_missile",def:{tags:["ultimate","explosive"]}},explosionRadius:78,knockback:90}))}}if(u.rail<=0){u.rail=3;const t=this.findNearest(p.x,p.y,1000);if(t){this.beams.push({x1:p.x,y1:p.y,x2:t.x,y2:t.y,life:.18,color:"#bff8ff",width:8});for(const e of this.grid.queryCircle((p.x+t.x)/2,(p.y+t.y)/2,Math.hypot(t.x-p.x,t.y-p.y)*.55+40))if(!e.dead&&pointSegDist(e.x,e.y,p.x,p.y,t.x,t.y)<e.size+10)this.damageEnemy(e,115*p.damageMultiplier,{source:{id:"titan_rail",def:{tags:["ultimate","beam"]}},canCrit:true,damageType:"arcane"})}}if(u.trample<=0){u.trample=.18;for(const e of this.grid.queryCircle(p.x,p.y,52))if(!e.dead&&!e.isCaptive)this.damageEnemy(e,22*p.damageMultiplier,{source:{id:"titan_trample",def:{tags:["ultimate","melee"]}},canCrit:false,knockback:100,fromX:p.x,fromY:p.y,silent:true})}}
  if(u.time<=0)vsxFinishExpansionUlt(this,true)
 }
 if(this.vsxZombieThralls){for(const z of this.vsxZombieThralls)if(!z.dead)z.update(edt);this.vsxZombieThralls=this.vsxZombieThralls.filter(z=>!z.dead)}
 return out;
};

const VSX_EXP_ENEMY_DIE_BASE=Enemy.prototype.die;
Enemy.prototype.die=function(drop=true){const shouldRise=game?.vsxExpansionUlt?.id==="outbreak"&&!this.isBoss&&!this.isMiniBoss&&!this.isCaptive&&!this.specialId&&(!this.elite||Math.random()<.45),x=this.x,y=this.y;const r=VSX_EXP_ENEMY_DIE_BASE.call(this,drop);if(shouldRise){game.vsxZombieThralls||=[];const cap=game.vsxExpansionUlt?.cap||18;if(game.vsxZombieThralls.length<cap){game.vsxZombieThralls.push(new VSX_ZombieThrall(x,y));game.spark(x,y,"#79d86d",8)}}return r};

const VSX_EXP_TAKE_DAMAGE_BASE=Player.prototype.takeDamage;
Player.prototype.takeDamage=function(amount,src={}){const u=game?.vsxExpansionUlt;if(VSX_ADMIN?.invincible)return false;if(u?.id==="titanfall"&&u.armor>0){u.armor-=Math.max(1,amount);game.stats&&(game.stats.damagePrevented+=Math.max(1,amount));game.texts.push(new FloatingText(this.x,this.y-35,`TITAN -${Math.round(amount)}`,"#77eaff",12));if(u.armor<=0){game.explosion(this.x,this.y,165,90*this.damageMultiplier,"#76e7ff",130,{id:"titan_break",def:{tags:["ultimate","area"]}},false);vsxFinishExpansionUlt(game,false)}return false}return VSX_EXP_TAKE_DAMAGE_BASE.call(this,amount,src)};

const VSX_EXP_DASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){const titan=this.vsxExpansionUlt?.id==="titanfall",before=this.dashCooldown;const r=VSX_EXP_DASH_BASE.call(this);if(titan&&before<=0&&this.dashCooldown>0){this.dashCooldown=Math.min(this.dashCooldown,.9);this.effects.push(new WaveEffect(this.player.x,this.player.y,120,.42,36*this.player.damageMultiplier,120,{id:"titan_dash",def:{tags:["ultimate","area"]}},"#75e8ff"))}return r};

const VSX_EXP_HANDLE_BASE=Game.prototype.handleKey;
Game.prototype.handleKey=function(code){if(this.state==="PLAYING"&&code==="Space"&&this.vsxExpansionUlt?.id==="titanfall"){const u=this.vsxExpansionUlt,p=this.player;this.explosion(p.x,p.y,230,140*p.damageMultiplier,"#75e8ff",170,{id:"titan_core_eject",def:{tags:["ultimate","explosive","area"]}},false);vsxFinishExpansionUlt(this,false);this.player.invuln=Math.max(this.player.invuln,1.2);return}return VSX_EXP_HANDLE_BASE.call(this,code)};

const VSX_EXP_RECALC_BASE=Player.prototype.recalc;
Player.prototype.recalc=function(){VSX_EXP_RECALC_BASE.call(this);const c=CHARACTER_DEFINITIONS[game?.characterId]?.mods||{};if(c.pickup)this.pickupRadius*=c.pickup;if(c.knockback)this.knockbackMultiplier*=c.knockback;if(c.critDamage)this.critDamage*=c.critDamage;if(game?.vsxRetakeBuff>0)this.attackSpeed*=1.25;if(game?.vsxExpansionUlt?.id==="titanfall"){this.moveSpeed*=1.13;this.damageReduction=Math.min(.75,this.damageReduction+.12)}if(game?.vsxExpansionUlt?.id==="awaken_lion"){this.moveSpeed*=1.22;this.damageReduction=Math.min(.75,this.damageReduction+.10)}};

const VSX_EXP_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){const r=VSX_EXP_RENDER_BASE.call(this);if(!this.player||this.state==="TITLE")return r;ctx.save();ctx.translate(-this.camera.x,-this.camera.y);if(this.vsxZombieThralls)for(const z of this.vsxZombieThralls)z.render(ctx);const u=this.vsxExpansionUlt;if(u?.id==="sacred_ring"){ctx.save();ctx.strokeStyle="#ffba75";ctx.lineWidth=5;ctx.shadowBlur=18;ctx.shadowColor="#ff9b5e";ctx.beginPath();ctx.arc(u.x,u.y,u.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([10,10]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(u.x,u.y,u.r-18,0,Math.PI*2);ctx.stroke();ctx.restore()}if(u?.id==="titanfall"){const p=this.player;ctx.save();ctx.translate(p.x,p.y);ctx.strokeStyle="#8ff3ff";ctx.fillStyle="rgba(47,114,150,.35)";ctx.lineWidth=4;ctx.shadowBlur=18;ctx.shadowColor="#75e8ff";ctx.fillRect(-27,-31,54,62);ctx.strokeRect(-27,-31,54,62);ctx.fillRect(-39,-14,12,30);ctx.fillRect(27,-14,12,30);ctx.restore();const pct=clamp(u.armor/Math.max(1,u.maxArmor),0,1);ctx.fillStyle="#10243a";ctx.fillRect(p.x-38,p.y-48,76,6);ctx.fillStyle="#67e8ff";ctx.fillRect(p.x-38,p.y-48,76*pct,6)}if(u?.id==="monsoon_updraft"){ctx.save();ctx.strokeStyle="rgba(143,231,255,.42)";ctx.lineWidth=4;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(this.player.x,this.player.y,110+i*65,u.angle+i*.6,u.angle+Math.PI*1.4+i*.6);ctx.stroke()}ctx.restore()}ctx.restore();return r};

/* =========================================================
   SHOP / SKINS / COLLECTION
   ========================================================= */
I18N.en.armory="SHOP";I18N.vi.armory="CỬA HÀNG";
I18N.en.currencyEarned="SHOP CURRENCY EARNED";I18N.vi.currencyEarned="TÀI NGUYÊN CỬA HÀNG NHẬN ĐƯỢC";
I18N.en.survivorShop="SURVIVORS";I18N.vi.survivorShop="NHÂN VẬT";
if(I18N.en.resetQuestion)I18N.en.resetQuestion=I18N.en.resetQuestion.replace(/Armory\/Shop/gi,"Shop");
if(I18N.vi.resetQuestion)I18N.vi.resetQuestion=I18N.vi.resetQuestion.replace(/Kho Trang Bị\/Shop/gi,"Cửa Hàng");

Object.assign(SKIN_DEFINITIONS,{
 neon_circuit:{name:{en:"Neon Circuit",vi:"Mạch Neon"},currency:"score",cost:9000,color:"#35efff",secondary:"#2563eb",effect:"circuit",tier:"rare"},
 ember_crown:{name:{en:"Ember Crown",vi:"Vương Miện Hỏa Tàn"},currency:"kills",cost:3200,color:"#ff7046",secondary:"#ffd15a",effect:"ember",tier:"rare"},
 aurora_wave:{name:{en:"Aurora Wave",vi:"Sóng Cực Quang"},currency:"score",cost:11000,color:"#72ffd2",secondary:"#ad7cff",effect:"aurora",tier:"epic"},
 spectral_glitch:{name:{en:"Spectral Glitch",vi:"Nhiễu Quang Phổ"},currency:"kills",cost:4200,color:"#ff5dcc",secondary:"#54e8ff",effect:"glitch",tier:"epic"},
 lotus_bloom:{name:{en:"Lotus Bloom",vi:"Liên Hoa"},currency:"score",cost:12000,color:"#ff9fd6",secondary:"#8af3ff",effect:"lotus",tier:"epic"},
 dragon_aura:{name:{en:"Dragon Aura",vi:"Long Khí"},currency:"kills",cost:7000,color:"#ffd35e",secondary:"#f06545",effect:"dragon",tier:"legendary"},
 pixel_knight:{name:{en:"Pixel Knight",vi:"Kỵ Sĩ Pixel"},currency:"score",cost:9500,color:"#87b9ff",secondary:"#ffffff",effect:"pixel",tier:"rare"},
 starfall:{name:{en:"Starfall",vi:"Tinh Vũ"},currency:"kills",cost:5600,color:"#c9d8ff",secondary:"#7c69ff",effect:"starfall",tier:"epic"},
 toxic_matrix:{name:{en:"Toxic Matrix",vi:"Ma Trận Độc"},currency:"score",cost:10500,color:"#71f07f",secondary:"#b4ff5e",effect:"toxic",tier:"epic"},
 eclipse:{name:{en:"Eclipse Sovereign",vi:"Chúa Tể Nhật Thực"},currency:"kills",cost:8500,color:"#f2c65e",secondary:"#6f5aff",effect:"eclipse",tier:"legendary"}
});
const VSX_SKIN_EFFECT_NAMES={circuit:{en:"Circuit nodes",vi:"Nút mạch điện"},ember:{en:"Ember crown",vi:"Vương miện lửa"},aurora:{en:"Aurora arcs",vi:"Vòng cực quang"},glitch:{en:"Glitch after-image",vi:"Bóng nhiễu"},lotus:{en:"Lotus petals",vi:"Cánh sen"},dragon:{en:"Dragon pearls",vi:"Long Châu"},pixel:{en:"Pixel brackets",vi:"Khung Pixel"},starfall:{en:"Orbiting stars",vi:"Tinh tú xoay quanh"},toxic:{en:"Toxic matrix",vi:"Ma trận độc"},eclipse:{en:"Eclipse corona",vi:"Quầng nhật thực"}};

function vsxPurchasePremiumSurvivor(id){const o=VSX_PREMIUM_SURVIVORS[id],d=CHARACTER_DEFINITIONS[id];if(!o||!d)return false;if(isCharacterUnlocked(id))return true;if(!walletSpend(o.currency,o.cost))return false;VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[d.weapon]=true;vsxDiscover("characters",id);vsxDiscover("weapons",d.weapon);vsxSave();VSX.announce(VSX.lang==="vi"?"NHÂN VẬT ĐÃ MỞ KHÓA":"SURVIVOR UNLOCKED",d.name[VSX.lang],o.color);return true}
function renderSurvivorShop(c){c.innerHTML=`<div class="vsxSectionTitle">${VSX.lang==="vi"?"NHÂN VẬT CAO CẤP":"PREMIUM SURVIVORS"}</div><p style="font-size:11px;color:#8098b0;line-height:1.5;margin:0 0 10px">${VSX.lang==="vi"?"Mỗi nhân vật đi kèm vũ khí độc quyền. Mua nhân vật sẽ đồng thời mở vũ khí đó cho Collection và nhóm rơi.":"Each survivor includes its signature weapon. Purchasing the survivor also unlocks that weapon for Collection and the normal drop pool."}</p><div class="vsxShopGrid" id="vsxPremiumSurvivorGrid"></div>`;const g=document.getElementById("vsxPremiumSurvivorGrid");for(const id of VSX_NEW_SHOP_SURVIVORS){const o=VSX_PREMIUM_SURVIVORS[id],d=CHARACTER_DEFINITIONS[id],owned=isCharacterUnlocked(id),u=VSX_NEW_ULT_META[d.ultimate],extra=`<span class="vsxRarityBadge ${o.rarity}">${o.rarity.toUpperCase()}</span><div class="vsxSurvivorMeta"><span><b>${VSX.lang==="vi"?"Vũ khí":"Weapon"}:</b> ${VSX.esc(weaponName(d.weapon))}</span><span><b>${VSX.lang==="vi"?"Tuyệt Kỹ":"Ultimate"}:</b> ${VSX.esc(u.name[VSX.lang])}</span></div><p class="vsxPrice">${owned?t("owned"):o.cost+" "+(o.currency==="score"?t("spendScore"):t("spendKills"))}</p>`;const card=shopCard(d.name[VSX.lang],d.desc[VSX.lang],extra,owned?t("owned"):t("buy"),owned||!walletCan(o.currency,o.cost),()=>{if(vsxPurchasePremiumSurvivor(id))renderArmory()},`vsxSurvivorShopCard ${o.rarity}`);card.style.setProperty("--surv-color",o.color);g.appendChild(card)}}

renderArmoryTabs=function(){const box=document.getElementById("vsxArmoryTabs"),tabs=[["progression",t("progression")],["survivors",I18N[VSX.lang].survivorShop],["runprep",t("runPrep")],["arsenal",t("arsenal")],["loadout",t("loadout")],["customization",t("customization")]];box.innerHTML="";for(const [id,label] of tabs){const b=document.createElement("button");b.textContent=label;b.className=id===ARMORY_TAB?"selected":"";b.onclick=()=>{ARMORY_TAB=id;renderArmory()};box.appendChild(b)}};
renderArmory=function(){ensureArmorySave();document.getElementById("vsxArmoryTitle").textContent=t("armory");document.getElementById("vsxArmoryBack").textContent=t("back");document.getElementById("vsxWallet").innerHTML=walletHTML();renderArmoryTabs();const c=document.getElementById("vsxArmoryContent");if(ARMORY_TAB==="progression")renderProgression(c);else if(ARMORY_TAB==="survivors")renderSurvivorShop(c);else if(ARMORY_TAB==="runprep")renderRunPrep(c);else if(ARMORY_TAB==="arsenal")renderArsenal(c);else if(ARMORY_TAB==="loadout")renderLoadout(c);else renderCustomization(c)};
renderCustomization=function(c){c.innerHTML=`<div class="vsxSectionTitle">${t("skins")}</div><p style="font-size:11px;color:#8098b0;margin:0 0 10px">${VSX.lang==="vi"?"Tất cả ngoại trang chỉ thay đổi hình ảnh/hiệu ứng, không cộng chỉ số.":"All skins are cosmetic only. Visual effects never modify stats."}</p><div class="vsxShopGrid" id="vsxSkinGrid"></div>`;const g=document.getElementById("vsxSkinGrid");for(const [id,d] of Object.entries(SKIN_DEFINITIONS)){const own=!!VSX.save.meta.skins[id],sel=VSX.save.loadout.skin===id,effect=d.effect?VSX_SKIN_EFFECT_NAMES[d.effect]?.[VSX.lang]:(VSX.lang==="vi"?"Vòng màu nhân vật":"Character color ring"),extra=`<div class="vsxSkinPreview" style="--skin:${d.color}"><i></i></div><p style="font-size:10px;color:#9bb2c6">${VSX.lang==="vi"?"Hiệu ứng":"Effect"}: <b>${VSX.esc(effect||"")}</b></p><p class="vsxPrice">${own?t("owned"):d.cost+" "+(d.currency==="score"?t("spendScore"):t("spendKills"))}</p>`;g.appendChild(shopCard(d.name[VSX.lang],VSX.lang==="vi"?"Ngoại trang có hiệu ứng riêng, thuần mỹ thuật.":"Cosmetic skin with its own visual effect.",extra,sel?t("equipped"):own?(VSX.lang==="vi"?"TRANG BỊ":"EQUIP"):t("buy"),sel||(!own&&!walletCan(d.currency,d.cost)),()=>{if(!own){if(!walletSpend(d.currency,d.cost))return;VSX.save.meta.skins[id]=true}VSX.save.loadout.skin=id;vsxSave();renderArmory()},d.tier?`skin${d.tier[0].toUpperCase()+d.tier.slice(1)}`:""))}};

/* Cosmetic skin effects. No gameplay modifiers. */
const VSX_EXP_SKIN_RENDER_BASE=Player.prototype.render;
Player.prototype.render=function(g){VSX_EXP_SKIN_RENDER_BASE.call(this,g);const d=SKIN_DEFINITIONS[VSX.save.loadout.skin||"default"];if(!d?.effect)return;const t0=game.time||0,c=d.color,c2=d.secondary||"#fff",r=this.radius+11;g.save();g.translate(this.x,this.y);g.shadowBlur=12;g.shadowColor=c;if(d.effect==="circuit"){g.strokeStyle=c;g.lineWidth=2;for(let i=0;i<4;i++){const a=t0+i*Math.PI/2,x=Math.cos(a)*(r+7),y=Math.sin(a)*(r+7);g.strokeRect(x-3,y-3,6,6)}}else if(d.effect==="ember"){g.strokeStyle=c2;g.lineWidth=3;for(let i=0;i<5;i++){const a=i*Math.PI*2/5+t0*.8;g.beginPath();g.arc(Math.cos(a)*(r+4),Math.sin(a)*(r+4),4+2*Math.sin(t0*5+i),0,Math.PI*2);g.stroke()}}else if(d.effect==="aurora"){for(let i=0;i<3;i++){g.strokeStyle=i%2?c2:c;g.globalAlpha=.55;g.lineWidth=2;g.beginPath();g.arc(0,0,r+4+i*5,t0*(.4+i*.1)+i,t0*(.4+i*.1)+Math.PI*1.25+i);g.stroke()}}else if(d.effect==="glitch"){g.globalAlpha=.55;g.strokeStyle=c;g.strokeRect(-r-3+Math.sin(t0*19)*3,-r-3,r*2+6,r*2+6);g.strokeStyle=c2;g.strokeRect(-r-1+Math.cos(t0*23)*3,-r-1,r*2+2,r*2+2)}else if(d.effect==="lotus"){g.fillStyle=c;g.globalAlpha=.62;for(let i=0;i<8;i++){const a=i*Math.PI/4+t0*.25;g.save();g.rotate(a);g.beginPath();g.ellipse(r+5,0,8,3,0,0,Math.PI*2);g.fill();g.restore()}}else if(d.effect==="dragon"){for(let i=0;i<3;i++){const a=t0*(1.1+i*.15)+i*Math.PI*2/3;g.fillStyle=i===0?c:c2;g.beginPath();g.arc(Math.cos(a)*(r+10),Math.sin(a)*(r+10),4-i*.5,0,Math.PI*2);g.fill()}}else if(d.effect==="pixel"){g.strokeStyle=c;g.lineWidth=3;const q=r+7,s=7;for(const sx of [-1,1])for(const sy of [-1,1]){g.beginPath();g.moveTo(sx*q,sy*(q-s));g.lineTo(sx*q,sy*q);g.lineTo(sx*(q-s),sy*q);g.stroke()}}else if(d.effect==="starfall"){g.fillStyle=c;for(let i=0;i<6;i++){const a=t0*.55+i*Math.PI/3,rr=r+7+(i%2)*7,x=Math.cos(a)*rr,y=Math.sin(a)*rr;g.fillRect(x-1.5,y-1.5,3,3)}}else if(d.effect==="toxic"){g.strokeStyle=c;g.globalAlpha=.5;for(let i=0;i<3;i++){g.beginPath();g.arc(0,0,r+4+i*6+Math.sin(t0*3+i)*2,0,Math.PI*2);g.stroke()}}else if(d.effect==="eclipse"){g.fillStyle="rgba(3,4,12,.45)";g.beginPath();g.arc(0,0,r+7,0,Math.PI*2);g.fill();g.strokeStyle=c;g.lineWidth=4;g.globalAlpha=.7;g.beginPath();g.arc(0,0,r+10,0,Math.PI*2);g.stroke();g.strokeStyle=c2;g.lineWidth=1.5;g.beginPath();g.arc(0,0,r+16,0,Math.PI*2);g.stroke()}g.restore()};

/* Collection: add purchasable skins as a first-class category. */
const VSX_EXP_CODEX_ENTRIES_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){if(cat==="skins")return Object.entries(SKIN_DEFINITIONS).map(([id,d])=>[id,d.name[VSX.lang],VSX.lang==="vi"?"Ngoại trang thuần mỹ thuật trong Cửa Hàng.":"Cosmetic Shop skin."]);return VSX_EXP_CODEX_ENTRIES_BASE(cat)};
const VSX_EXP_COLLECTION_SHOW_BASE=VSX.showCollection;
VSX.showCollection=function(){VSX_EXP_COLLECTION_SHOW_BASE();const tabs=document.getElementById("vsxCodexTabs");if(tabs&&!document.getElementById("vsxSkinCodexTab")){const b=document.createElement("button");b.id="vsxSkinCodexTab";const total=Object.keys(SKIN_DEFINITIONS).length,owned=Object.keys(SKIN_DEFINITIONS).filter(id=>!!VSX.save.meta.skins?.[id]).length;b.textContent=`${VSX.lang==="vi"?"NGOẠI TRANG":"SKINS"} ${owned}/${total}`;b.onclick=()=>VSX.renderCodex("skins");tabs.appendChild(b)}};

/* Collection: characters remain visible, but shop ownership is explicit. */
const VSX_EXP_CODEX_RENDER_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){if(cat==="skins"){const list=document.getElementById("vsxCodexList");if(!list)return;list.innerHTML="";for(const [id,d] of Object.entries(SKIN_DEFINITIONS)){const owned=!!VSX.save.meta.skins?.[id],e=document.createElement("div");e.className="vsxCodexItem";e.innerHTML=`<b>${VSX.esc(d.name[VSX.lang])}</b><div class="vsxSkinCollectionSwatch" style="--skin:${d.color}"></div><div>${VSX.lang==="vi"?"Hiệu ứng":"Effect"}: ${VSX.esc(d.effect?(VSX_SKIN_EFFECT_NAMES[d.effect]?.[VSX.lang]||d.effect):(VSX.lang==="vi"?"Màu nhân vật":"Character color"))}</div><div style="margin-top:6px;font-size:9px;color:${owned?'#73eeb8':'#ffbd76'}">${owned?(VSX.lang==='vi'?'SỞ HỮU':'OWNED'):(VSX.lang==='vi'?'CHƯA MUA':'NOT PURCHASED')}</div>`;list.appendChild(e)}return}if(cat!=="characters")return VSX_EXP_CODEX_RENDER_BASE.call(VSX,cat);const list=document.getElementById("vsxCodexList");if(!list)return;list.innerHTML="";for(const [id,n,dsc] of VSX.codexEntries("characters")){const d=CHARACTER_DEFINITIONS[id],owned=isCharacterUnlocked(id),e=document.createElement("div");e.className="vsxCodexItem";const rarity=(d.rarity||"common").toUpperCase();e.innerHTML=`<b>${VSX.esc(n)}</b><span class="vsxRarityBadge ${(d.rarity||"common")}">${rarity}</span><div>${VSX.esc(dsc)}</div><div style="margin-top:6px;font-size:9px;color:${owned?'#73eeb8':'#ffbd76'}">${owned?(VSX.lang==='vi'?'SỞ HỮU':'OWNED'):(VSX.lang==='vi'?'KHÓA TRONG CỬA HÀNG':'SHOP LOCKED')}</div>`;list.appendChild(e)}};

/* Setup: hide locked premium survivors and surface rarity cleanly. */
const VSX_EXP_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){const grid=document.getElementById("vsxCharacterGrid");if(!grid)return;document.getElementById("vsxSetupTitle").textContent=t("chooseFighter");document.getElementById("vsxDiffTitle").textContent=t("chooseDifficulty");document.getElementById("vsxBeginBtn").textContent=t("begin");document.getElementById("vsxSetupBack").textContent=t("back");grid.innerHTML="";for(const [id,d] of Object.entries(CHARACTER_DEFINITIONS)){if(!isCharacterUnlocked(id))continue;const el=document.createElement("div");el.className="vsxPick"+(VSX.selectedCharacter===id?" selected":"");el.dataset.rarity=d.rarity||"common";const rarity=d.rarity&&["epic","legendary"].includes(d.rarity)?`<span class="vsxRarityBadge ${d.rarity}">${d.rarity.toUpperCase()}</span>`:"";el.innerHTML=`${rarity}<h3>${VSX.esc(d.name[VSX.lang])}</h3><p>${VSX.esc(d.desc[VSX.lang])}</p><p style="margin-top:7px;color:#8fd0ff"><b>${VSX.lang==="vi"?"Vũ khí":"Weapon"}:</b> ${VSX.esc(weaponName(d.weapon))}</p>`;el.onclick=()=>{VSX.selectedCharacter=id;VSX.renderSetup()};grid.appendChild(el)}const dg=document.getElementById("vsxDifficulty");dg.innerHTML="";for(const [id,d] of Object.entries(DIFFICULTY_DEFINITIONS)){const b=document.createElement("button");b.className=VSX.selectedDifficulty===id?"selected":"";b.textContent=d.name[VSX.lang];b.onclick=()=>{VSX.selectedDifficulty=id;VSX.renderSetup()};dg.appendChild(b)}};

/* Unlock free content on old saves, keep premium content locked. */
ensureArmorySave();
for(const id of VSX_NEW_FREE_SURVIVORS)VSX.save.meta.unlockedCharacters[id]=true;
for(const id of VSX_NEW_WEAPONS.filter(id=>!WEAPON_DEFINITIONS[id].shopLocked))VSX.save.meta.unlockedWeapons[id]=true;
vsxSave();

/* =========================================================
   ADMIN INTEGRATION / QA
   ========================================================= */
function vsxAdmL(en,vi){return VSX.lang==="vi"?vi:en}
function vsxAdminExpansionCard(){
 const grid=document.querySelector("#vsxAdminContent .vsxAdminGrid");
 if(!grid||document.getElementById("vsxAdminExpansionCard")||!["meta","loadout"].includes(VSX_ADMIN?.tab))return;
 const card=document.createElement("div");
 card.id="vsxAdminExpansionCard";card.className="vsxAdminCard vsxGold";
 card.innerHTML=`<h3>${vsxAdmL("SURVIVOR EXPANSION QA","QA NHÂN VẬT MỚI")}</h3><p>${vsxAdmL("Unlock, select and live-test every new survivor Ultimate without editing the save manually.","Mở khóa, chọn và test trực tiếp Tuyệt Kỹ của toàn bộ nhân vật mới mà không cần sửa save thủ công.")}</p><select id="admExpansionSurvivor">${[...VSX_NEW_FREE_SURVIVORS,...VSX_NEW_SHOP_SURVIVORS].map(id=>`<option value="${id}">${VSX.esc(CHARACTER_DEFINITIONS[id].name[VSX.lang])} · ${(CHARACTER_DEFINITIONS[id].rarity||'rare').toUpperCase()}</option>`).join('')}</select><div class="row"><button id="admExpansionUnlock">${vsxAdmL("UNLOCK SELECTED","MỞ KHÓA ĐÃ CHỌN")}</button><button id="admExpansionNext">${vsxAdmL("SET NEXT RUN","CHỌN CHO TRẬN SAU")}</button><button id="admExpansionUlt">${vsxAdmL("LIVE TEST ULT","TEST ULT NGAY")}</button></div><div class="row"><button id="admExpansionAll">${vsxAdmL("UNLOCK ALL 12 + WEAPONS","MỞ KHÓA CẢ 12 + VŨ KHÍ")}</button></div>`;
 grid.appendChild(card);
 const sel=card.querySelector("#admExpansionSurvivor");
 card.querySelector("#admExpansionUnlock").onclick=()=>{const id=sel.value,d=CHARACTER_DEFINITIONS[id];VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[d.weapon]=true;vsxDiscover("characters",id);vsxDiscover("weapons",d.weapon);vsxSave();VSX.announce("ADMIN",d.name[VSX.lang],"#73f5bd")};
 card.querySelector("#admExpansionNext").onclick=()=>{const id=sel.value;VSX.selectedCharacter=id;VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[CHARACTER_DEFINITIONS[id].weapon]=true;vsxSave();VSX.announce("ADMIN",vsxAdmL("NEXT RUN SURVIVOR SET","ĐÃ CHỌN NHÂN VẬT TRẬN SAU"),"#73dfff")};
 card.querySelector("#admExpansionUlt").onclick=()=>{if(!game.player){VSX.announce("ADMIN",vsxAdmL("START A RUN FIRST","HÃY VÀO TRẬN TRƯỚC"),"#ff9b71");return}const id=sel.value,d=CHARACTER_DEFINITIONS[id];game.characterId=id;VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[d.weapon]=true;if(!game.player.weapons.some(w=>w.id===d.weapon)&&game.player.weapons.length<game.player.weaponSlots)game.player.addWeapon(d.weapon);game.player.recalc();game.ultimateActive=false;game.vsxExpansionUlt=null;game.ultimateBuff=null;game.ultimateBuffTimer=0;game.ultimateCharge=100;game.useUltimate();game.updateHUD(true)};
 card.querySelector("#admExpansionAll").onclick=()=>{for(const id of [...VSX_NEW_FREE_SURVIVORS,...VSX_NEW_SHOP_SURVIVORS]){const d=CHARACTER_DEFINITIONS[id];VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[d.weapon]=true;vsxDiscover("characters",id);vsxDiscover("weapons",d.weapon)}vsxSave();VSX.announce("ADMIN",vsxAdmL("EXPANSION CONTENT UNLOCKED","ĐÃ MỞ KHÓA TOÀN BỘ NỘI DUNG MỚI"),"#ffd86a")}
}
/* Admin renderer lives inside the previous major-update closure, so integrate through the public DOM/API instead of reaching into its lexical scope. */
if(window.VSX_ADMIN){
 const oldOpen=VSX_ADMIN.openPanel;
 if(typeof oldOpen==="function")VSX_ADMIN.openPanel=function(){const r=oldOpen.apply(this,arguments);queueMicrotask(vsxAdminExpansionCard);return r};
 const content=document.getElementById("vsxAdminContent");
 if(content)new MutationObserver(()=>{if(VSX_ADMIN.open&&["meta","loadout"].includes(VSX_ADMIN.tab)&&!document.getElementById("vsxAdminExpansionCard"))queueMicrotask(vsxAdminExpansionCard)}).observe(content,{childList:true});
}

/* Main menu / language refresh picks up SHOP immediately. */
const VSX_EXP_LANG_BASE=vsxApplyLanguage;
vsxApplyLanguage=function(){const r=VSX_EXP_LANG_BASE();const a=document.getElementById("vsxArmoryBtn");if(a)a.textContent=t("armory");if(document.getElementById("vsxArmoryScreen")?.classList.contains("active"))renderArmory();if(document.getElementById("vsxSetupScreen")?.classList.contains("active"))VSX.renderSetup();return r};
vsxApplyLanguage();

})();
