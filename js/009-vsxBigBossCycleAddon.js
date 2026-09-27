/* =========================================================
   BIG BOSS WAVE CYCLE + MB9 DURABILITY UPDATE
   Wave 5, then every other wave (5, 7, 9...). Ascended cycle from Wave 25.
   ========================================================= */
Object.assign(I18N.en,{
 bigBoss:"BIG BOSS",ascendedBoss:"ASCENDED BIG BOSS",bossWave:"BOSS WAVE",
 nullArchitect:"NULL ARCHITECT",abyssalLeviathan:"ABYSSAL LEVIATHAN",chronoEmperor:"CHRONO EMPEROR",
 hiveMother:"THE HIVE MOTHER",voidJudge:"THE VOID JUDGE",eclipseSeraph:"ECLIPSE SERAPH",
 omegaColossus:"OMEGA COLOSSUS",worldEater:"THE WORLD EATER",mirrorGod:"MIRROR GOD"
});
Object.assign(I18N.vi,{
 bigBoss:"ĐẠI BOSS",ascendedBoss:"ĐẠI BOSS THĂNG HOA",bossWave:"ĐỢT BOSS",
 nullArchitect:"KIẾN TRÚC SƯ HƯ VÔ",abyssalLeviathan:"LEVIATHAN VỰC THẲM",chronoEmperor:"HOÀNG ĐẾ THỜI GIAN",
 hiveMother:"MẪU THỂ BẦY ĐÀN",voidJudge:"PHÁN QUAN HƯ KHÔNG",eclipseSeraph:"ĐẠI THIÊN SỨ NHẬT THỰC",
 omegaColossus:"CỰ THẦN OMEGA",worldEater:"KẺ NUỐT THẾ GIỚI",mirrorGod:"THẦN PHẢN CHIẾU"
});

const BIG_BOSS_DEFINITIONS={
 8:{id:"crimson_titan",name:{en:"CRIMSON TITAN",vi:"TITAN ĐỎ THẪM"},cls:null,color:"#d51e47",hp:1.0},
 10:{id:"null_architect",name:{en:"NULL ARCHITECT",vi:"KIẾN TRÚC SƯ HƯ VÔ"},color:"#59c8ff",hp:1.12},
 12:{id:"abyssal_leviathan",name:{en:"ABYSSAL LEVIATHAN",vi:"LEVIATHAN VỰC THẲM"},color:"#4e7dff",hp:1.18},
 14:{id:"chrono_emperor",name:{en:"CHRONO EMPEROR",vi:"HOÀNG ĐẾ THỜI GIAN"},color:"#a779ff",hp:1.20},
 16:{id:"hive_mother",name:{en:"THE HIVE MOTHER",vi:"MẪU THỂ BẦY ĐÀN"},color:"#78cf67",hp:1.28},
 18:{id:"void_judge",name:{en:"THE VOID JUDGE",vi:"PHÁN QUAN HƯ KHÔNG"},color:"#e1b25b",hp:1.30},
 20:{id:"eclipse_seraph",name:{en:"ECLIPSE SERAPH",vi:"ĐẠI THIÊN SỨ NHẬT THỰC"},color:"#f3df92",hp:1.36},
 22:{id:"omega_colossus",name:{en:"OMEGA COLOSSUS",vi:"CỰ THẦN OMEGA"},color:"#70e5f0",hp:1.52},
 24:{id:"world_eater",name:{en:"THE WORLD EATER",vi:"KẺ NUỐT THẾ GIỚI"},color:"#b854d8",hp:1.58},
 26:{id:"mirror_god",name:{en:"MIRROR GOD",vi:"THẦN PHẢN CHIẾU"},color:"#e7efff",hp:1.62}
};
const BIG_BOSS_ORDER=[8,10,12,14,16,18,20,22,24,26];
const BIG_BOSS_WAVE_SCHEDULE=[5,7,9,11,13,15,17,19,21,23];

function bbName(b){return b?.localizedName?.[VSX.lang]||b?.name||"BIG BOSS"}
function bbAnnounce(b,wave,asc=false){
 VSX.announce(asc?t("ascendedBoss"):t("bigBoss"),`${bbName(b)} • ${t("wave")} ${wave}`,b.def?.color||"#ff6179");
 game.texts.push(new FloatingText(game.player.x,game.player.y-88,`${asc?"ASCENDED ":""}BIG BOSS — ${bbName(b)}`,b.def?.color||"#ff6179",24));
 game.shake(14,.42);game.audio.beep(76,.46,"sawtooth",.055)
}
function bbRing(x,y,count,speed,damage,color,offset=0){
 for(let i=0;i<count;i++){const a=offset+i*Math.PI*2/count;game.enemyProjectiles.push(new Projectile({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,radius:6,damage,life:4.5,color,owner:"enemy",critAllowed:false}))}
}
function bbAim(x,y,speed,damage,color,count=1,spread=.12){
 const base=Math.atan2(game.player.y-y,game.player.x-x);for(let i=0;i<count;i++){const a=base+(i-(count-1)/2)*spread;game.enemyProjectiles.push(new Projectile({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,radius:7,damage,life:4,color,owner:"enemy",critAllowed:false}))}
}
function bbAreaDamage(x,y,r,damage,color="#ff5c75"){
 const p=game.player,d=Math.hypot(p.x-x,p.y-y);if(d<=r+p.radius)p.takeDamage(damage,{boss:true,fromX:x,fromY:y});
 const mb=game.mbappeAlly;if(mb&&!mb.dead&&Math.hypot(mb.x-x,mb.y-y)<=r+mb.radius)mb.takeDamage(damage*.42,{boss:true});
 game.spark(x,y,color,20);game.shake(Math.min(12,r/18),.18)
}
function bbContact(b,mul=1){
 const p=game.player,d=Math.hypot(p.x-b.x,p.y-b.y);if(d<b.size+p.radius)p.takeDamage(b.damage*mul,{boss:true,enemy:b,fromX:b.x,fromY:b.y});
 const mb=game.mbappeAlly;if(mb&&!mb.dead&&Math.hypot(mb.x-b.x,mb.y-b.y)<b.size+mb.radius)mb.takeDamage(b.damage*.30*mul,{boss:true})
}
function bbMove(b,dt,speedMul=1){const sm=b.updateStatus(dt),p=game.player,n=normalize(p.x-b.x,p.y-b.y);b.x+=n.x*b.speed*speedMul*sm*dt;b.y+=n.y*b.speed*speedMul*sm*dt;b.flash=Math.max(0,b.flash-dt)}
function bbTelegraphBlast(x,y,r,delay,damage,color="#ff5368"){
 game.telegraphs.push(new VSX_Telegraph({x,y,r,life:delay,color,callback:()=>bbAreaDamage(x,y,r,damage,color)}))
}
function bbScaleForWave(wave){return 1+Math.max(0,wave-5)*.075}
function bbSetCommon(b,def,wave){
 b.bigBoss=true;b.bigBossId=def.id;b.localizedName=def.name;b.name=def.name.en;b.def={...b.def,color:def.color,shape:b.def.shape||"hex"};b.knockbackResistance=1;b.waveSpawned=wave;b.bigBossInvulnerable=false;
 const s=bbScaleForWave(wave),base=1700*def.hp*s;b.maxHp=base;b.hp=base;b.damage=(24+wave*1.25);b.xp=160+wave*5;b.size=Math.max(46,b.size||46);b.ascended=false;b.ascendedModifier=null;b.abilityTimer=3.2;b.contactTimer=0
}

class VSX_NullArchitect extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[10],wave);this.size=50;this.speed=44;this.cycle=0;this.wallLife=0;this.wallAngle=0}
 update(dt){bbMove(this,dt,.78);this.abilityTimer-=dt;this.wallLife=Math.max(0,this.wallLife-dt);if(this.wallLife>0){const p=game.player,a=this.wallAngle,cx=this.x,cy=this.y,len=600;for(const proj of game.projectiles){if(proj.dead)continue;const x1=cx-Math.cos(a)*len,y1=cy-Math.sin(a)*len,x2=cx+Math.cos(a)*len,y2=cy+Math.sin(a)*len;if(pointSegDist(proj.x,proj.y,x1,y1,x2,y2)<proj.radius+7)proj.dead=true}const side=(p.x-cx)*(-Math.sin(a))+(p.y-cy)*Math.cos(a);if(Math.abs(side)<17&&Math.hypot(p.x-cx,p.y-cy)<len){const n={x:-Math.sin(a),y:Math.cos(a)},sgn=side>=0?1:-1;p.x+=n.x*sgn*95*dt;p.y+=n.y*sgn*95*dt}}
 if(this.abilityTimer<=0){this.cycle=(this.cycle+1)%3;this.abilityTimer=this.ascended?3.3:4.2;if(this.cycle===0){this.wallLife=3.4;this.wallAngle=Math.atan2(game.player.y-this.y,game.player.x-this.x)+Math.PI/2;VSX.announce(bbName(this),VSX.lang==="vi"?"GIAO THỨC TƯỜNG":"WALL PROTOCOL",this.def.color)}else if(this.cycle===1){const p=game.player;for(let ix=-1;ix<=1;ix++)for(let iy=-1;iy<=1;iy++)if((ix+iy)&1)bbTelegraphBlast(p.x+ix*115,p.y+iy*115,54,.9,this.damage*.72,"#65d8ff");VSX.announce(bbName(this),"GRID COLLAPSE",this.def.color)}else{this.recompile=2.4;this.recompileHp=this.hp;VSX.announce(bbName(this),"RECOMPILE — BREAK THE SHIELD",this.def.color)}}
 if(this.recompile>0){this.recompile-=dt;if(this.hp<this.recompileHp-this.maxHp*.07){this.recompile=0;game.texts.push(new FloatingText(this.x,this.y-65,"RECOMPILE INTERRUPTED","#8ff7ff",15))}else if(this.recompile<=0){this.hp=Math.min(this.maxHp,this.hp+this.maxHp*.10);game.texts.push(new FloatingText(this.x,this.y-65,"ARMOR REBUILT","#8ff7ff",15))}}
 bbContact(this,.9)}
 render(g){super.render(g);if(this.wallLife>0){g.save();g.strokeStyle="#75e3ff";g.lineWidth=10;g.globalAlpha=.65;const len=600,a=this.wallAngle;g.beginPath();g.moveTo(this.x-Math.cos(a)*len,this.y-Math.sin(a)*len);g.lineTo(this.x+Math.cos(a)*len,this.y+Math.sin(a)*len);g.stroke();g.restore()}}
}

class VSX_AbyssalLeviathan extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[12],wave);this.size=58;this.speed=62;this.mode="hunt";this.dive=0;this.pull=0;this.devoured=0}
 update(dt){this.flash=Math.max(0,this.flash-dt);this.abilityTimer-=dt;if(this.dive>0){this.dive-=dt;this.bigBossInvulnerable=true;if(this.dive<=0){this.bigBossInvulnerable=false;this.x=this.diveX;this.y=this.diveY;bbAreaDamage(this.x,this.y,115,this.damage*1.15,"#5278ff");bbRing(this.x,this.y,12,235,this.damage*.45,"#5e83ff")};return}
 bbMove(this,dt,.95);if(this.pull>0){this.pull-=dt;const p=game.player,n=normalize(this.x-p.x,this.y-p.y),strength=125;p.x+=n.x*strength*dt;p.y+=n.y*strength*dt;if(Math.random()<dt*3)bbTelegraphBlast(p.x+rand(110,-110),p.y+rand(110,-110),42,.65,this.damage*.45,"#6b5cff")}
 if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.7:4.8;const r=Math.random();if(r<.36){this.dive=1.45;const p=game.player;this.diveX=p.x+(game.lastMoveDir?.x||0)*115;this.diveY=p.y+(game.lastMoveDir?.y||0)*115;VSX.announce(bbName(this),VSX.lang==="vi"?"LẶN XUỐNG VỰC":"VOID DIVE",this.def.color)}else if(r<.7){this.pull=2.7;VSX.announce(bbName(this),VSX.lang==="vi"?"XÚC TU TRỌNG LỰC":"GRAVITY TENTACLES",this.def.color)}else{let eaten=0;for(const arr of [game.gems,game.pickups])for(const q of arr){if(q.dead||Math.hypot(q.x-this.x,q.y-this.y)>430)continue;q.dead=true;eaten++;if(eaten>=12)break}this.devoured+=eaten;this.hp=Math.min(this.maxHp,this.hp+eaten*this.maxHp*.006);bbRing(this.x,this.y,10+Math.min(10,eaten),210+eaten*5,this.damage*.42,"#8c70ff",Math.random());VSX.announce(bbName(this),`${VSX.lang==="vi"?"NUỐT":"DEVOUR"} ${eaten}`,this.def.color)}}bbContact(this,1.0)}
}

class VSX_ChronoEmperor extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[14],wave);this.size=50;this.speed=48;this.history=[];this.stopTimer=0;this.rewindCd=8}
 update(dt){this.history.push({t:game.time,x:game.player.x,y:game.player.y});while(this.history.length&&game.time-this.history[0].t>5.5)this.history.shift();bbMove(this,dt,.75);this.abilityTimer-=dt;this.rewindCd-=dt;if(this.rewindCd<=0){this.rewindCd=this.ascended?7:9.5;const q=this.history.find(h=>game.time-h.t>=2.8);if(q){game.player.x=q.x;game.player.y=q.y;game.spark(q.x,q.y,"#b795ff",22);VSX.announce(bbName(this),VSX.lang==="vi"?"HỒI QUY THỜI GIAN":"TEMPORAL RECALL",this.def.color)}}if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.7:5.0;const p=game.player;if(Math.random()<.55){VSX.announce(bbName(this),"TIME FRACTURE 3…2…1",this.def.color);const ox=this.x,oy=this.y,dam=this.damage;game.effects.push(new PulseDelayEffect(1.25,()=>{bbRing(ox,oy,24,300,dam*.48,"#b794ff",Math.random());bbRing(ox,oy,12,190,dam*.58,"#7fe7ff",Math.random())}))}else{for(let i=0;i<5;i++)bbTelegraphBlast(p.x+rand(180,-180),p.y+rand(180,-180),46,.9+i*.12,this.damage*.55,"#9c7cff")}}bbContact(this,.95)}
}

class VSX_HiveEgg extends Enemy{
 constructor(x,y,scale){super("grunt",x,y,scale,null);this.def={...this.def,color:"#9fd36a",shape:"circle"};this.size=20;this.maxHp=160*scale;this.hp=this.maxHp;this.hatch=8;this.isHiveEgg=true;this.xp=0;this.damage=0;this.speed=0}
 update(dt){this.flash=Math.max(0,this.flash-dt);this.hatch-=dt;if(this.hatch<=0&&!this.dead){this.dead=true;for(let i=0;i<3;i++){const e=vsxApplyDifficulty(new Enemy("swarmer",this.x+rand(35,-35),this.y+rand(35,-35),game.difficulty,"Frenzied"));game.enemies.push(e)}game.spark(this.x,this.y,"#93d46b",18)}}
 die(){if(this.dead)return;this.dead=true;game.spark(this.x,this.y,"#b6e58c",14)}
}
class VSX_HiveMother extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[16],wave);this.size=62;this.speed=34;this.organStage=0;this.scream=7}
 update(dt){bbMove(this,dt,.55);this.abilityTimer-=dt;this.scream-=dt;if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.6:4.8;for(let i=0;i<(this.hp<this.maxHp*.5?4:3);i++){const a=Math.random()*Math.PI*2,rr=rand(230,90);game.enemies.push(new VSX_HiveEgg(this.x+Math.cos(a)*rr,this.y+Math.sin(a)*rr,1+game.wave*.035))}VSX.announce(bbName(this),VSX.lang==="vi"?"Ổ TRỨNG ĐANG NỞ":"HATCHERY",this.def.color)}if(this.scream<=0){this.scream=10;VSX.announce(bbName(this),VSX.lang==="vi"?"TIẾNG GÀO BẦY ĐÀN":"HIVE SCREAM",this.def.color);for(const a of game.storyAllies||[]){const n=normalize(a.x-this.x,a.y-this.y);a.x+=n.x*160;a.y+=n.y*160}if(game.mbappeAlly&&!game.mbappeAlly.dead){const a=game.mbappeAlly,n=normalize(a.x-this.x,a.y-this.y);a.x+=n.x*160;a.y+=n.y*160}bbRing(this.x,this.y,18,210,this.damage*.38,"#9edb77")}
 const ratio=this.hp/this.maxHp,stage=ratio<.25?3:ratio<.5?2:ratio<.75?1:0;if(stage>this.organStage){this.organStage=stage;const names=["","SPAWNING SAC RUPTURED","ARMOR GLAND RUPTURED","VENOM GLAND RUPTURED"];game.texts.push(new FloatingText(this.x,this.y-78,names[stage],"#b7ec91",15));if(stage===2)this.speed+=14;if(stage===3)for(let i=0;i<10;i++)bbTelegraphBlast(game.player.x+rand(220,-220),game.player.y+rand(220,-220),38,.7+i*.08,this.damage*.36,"#78c968")}
 bbContact(this,1.05)}
}

class VSX_VoidJudge extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[18],wave);this.size=53;this.speed=52;this.verdict="";this.guilt=0}
 buildVerdict(){const p=game.player,weps=p.weapons||[],ally=game.countActiveAllies(),def=weps.filter(w=>w.def.tags?.includes("defensive")).length,proj=weps.filter(w=>w.def.tags?.includes("projectile")).length;if(ally>=3)return"allies";if(def>=3)return"defense";if(proj>=Math.max(4,weps.length*.55))return"projectile";return"aggression"}
 update(dt){bbMove(this,dt,.8);this.abilityTimer-=dt;if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.5:4.7;this.verdict=this.buildVerdict();const label={projectile:"PROJECTILE DEPENDENCE",allies:"OVERRELIANCE ON ALLIES",defense:"COWARDICE",aggression:"RECKLESS AGGRESSION"}[this.verdict];VSX.announce(bbName(this),`VERDICT: ${label}`,this.def.color);if(this.verdict==="projectile"){this.reflect=2.2;bbRing(this.x,this.y,14,250,this.damage*.35,"#e4bd6c")}else if(this.verdict==="allies"){for(const a of game.storyAllies||[])a.attackTimer=(a.attackTimer||0)+2.0;if(game.contractAlly)game.contractAlly.cool+=2;bbRing(this.x,this.y,12,185,this.damage*.42,"#d8a95b")}else if(this.verdict==="defense"){const p=game.player;bbTelegraphBlast(p.x,p.y,75,.8,this.damage*1.05,"#ffcc69")}else{for(let i=0;i<4;i++)bbAim(this.x,this.y,350,this.damage*.52,"#ffc55d",3,.16)}}if(this.reflect>0)this.reflect-=dt;bbContact(this,1)}
}

class VSX_EclipseSeraph extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[20],wave);this.size=55;this.speed=44;this.cover=[];this.eclipse=false}
 update(dt){bbMove(this,dt,.7);this.abilityTimer-=dt;if(!this.eclipse&&this.hp<this.maxHp*.5){this.eclipse=true;VSX.announce(bbName(this),"ECLIPSE",this.def.color)}if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.8:5.2;if(!this.cover.length||Math.random()<.45){this.cover=[];for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2,rr=rand(300,130);this.cover.push({x:game.player.x+Math.cos(a)*rr,y:game.player.y+Math.sin(a)*rr,life:8})}VSX.announce(bbName(this),VSX.lang==="vi"?"LÔNG KIẾM RƠI XUỐNG":"FALLEN FEATHERS",this.def.color)}else{VSX.announce(bbName(this),VSX.lang==="vi"?"PHÁN XÉT THÁI DƯƠNG":"SOLAR JUDGMENT",this.def.color);const p=game.player,ox=this.x,oy=this.y,dam=this.damage,cover=this.cover.slice();game.effects.push(new PulseDelayEffect(1.1,()=>{let blocked=false;for(const c of cover)if(pointSegDist(c.x,c.y,ox,oy,p.x,p.y)<28&&Math.hypot(c.x-ox,c.y-oy)<Math.hypot(p.x-ox,p.y-oy)){blocked=true;break}if(!blocked)p.takeDamage(dam*1.28,{boss:true,fromX:ox,fromY:oy});else game.texts.push(new FloatingText(p.x,p.y-45,"COVERED!","#fff1a8",16));game.beams.push({x1:ox,y1:oy,x2:p.x,y2:p.y,width:18,color:"#fff0a8",life:.18})}))}}for(const c of this.cover)c.life-=dt;this.cover=this.cover.filter(c=>c.life>0);bbContact(this,.9)}
 render(g){super.render(g);for(const c of this.cover){g.save();g.translate(c.x,c.y);g.rotate(-.35);g.fillStyle="#fff0af";g.shadowBlur=13;g.shadowColor="#fff3ba";g.fillRect(-9,-35,18,70);g.restore()}}
}

class VSX_OmegaColossus extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[22],wave);this.size=74;this.speed=27;this.part=0;this.partNames=["LEFT ARM","RIGHT ARM","SHOULDER CANNON","REACTOR","OMEGA CORE"];this.lastPartRatio=1}
 update(dt){bbMove(this,dt,.42);this.abilityTimer-=dt;const ratio=this.hp/this.maxHp,part=Math.min(4,Math.floor((1-ratio)*5));if(part>this.part){this.part=part;VSX.announce(bbName(this),`${this.partNames[part-1]||"SHELL"} DESTROYED`,this.def.color);game.shake(16,.35)}if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.0:4.1;if(this.part<=0){bbTelegraphBlast(game.player.x,game.player.y,105,.85,this.damage*.95,"#73e9f1");game.enemyWaves.push({wave:new WaveEffect(this.x,this.y,330,1.0,this.damage*.55,0,null,"#70e5f0")})}else if(this.part===1){const p=game.player;bbTelegraphBlast(p.x,p.y,78,.75,this.damage*.85,"#70e5f0");bbRing(this.x,this.y,14,210,this.damage*.35,"#75eff6")}else if(this.part===2){for(let i=0;i<7;i++)bbAim(this.x,this.y,300,this.damage*.45,"#7feeff",1,0);bbRing(this.x,this.y,18,185,this.damage*.32,"#6bdce8",Math.random())}else if(this.part===3){this.overheat=1.6;VSX.announce(bbName(this),"REACTOR OVERHEAT — HIT THE VENTS",this.def.color)}else{bbAim(this.x,this.y,430,this.damage*.55,"#b9ffff",5,.13);bbRing(this.x,this.y,20,260,this.damage*.40,"#7ff7ff",Math.random())}}
 if(this.overheat>0){this.overheat-=dt}bbContact(this,this.part>=4?1.2:1)}
}

class VSX_WorldEater extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[24],wave);this.size=68;this.speed=36;this.arenaX=game.player.x;this.arenaY=game.player.y;this.arenaR=660;this.bites=[]}
 update(dt){bbMove(this,dt,.58);this.abilityTimer-=dt;this.arenaR=Math.max(285,this.arenaR-dt*5.2);const p=game.player,d=Math.hypot(p.x-this.arenaX,p.y-this.arenaY);if(d>this.arenaR){const n=normalize(this.arenaX-p.x,this.arenaY-p.y);p.x+=n.x*170*dt;p.y+=n.y*170*dt;this.arenaTick=(this.arenaTick||0)-dt;if(this.arenaTick<=0){this.arenaTick=.55;p.takeDamage(this.damage*.28,{boss:true})}}if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.5:4.8;if(Math.random()<.55){const p=game.player,x=p.x+rand(180,-180),y=p.y+rand(180,-180),r=105;this.bites.push({x,y,r,life:12});bbTelegraphBlast(x,y,r,.9,this.damage*.95,"#c25be2");VSX.announce(bbName(this),VSX.lang==="vi"?"CẮN THỰC TẠI":"REALITY BITE",this.def.color)}else{const n=normalize(this.x-p.x,this.y-p.y);p.x+=n.x*90;p.y+=n.y*90;let eaten=0;for(const e of game.enemies){if(e===this||e.dead||e.isBoss||Math.hypot(e.x-this.x,e.y-this.y)>160)continue;e.hp=0;e.die(false);eaten++;if(eaten>=4)break}if(eaten){this.hp-=this.maxHp*.025*eaten;game.texts.push(new FloatingText(this.x,this.y-80,`INTERNAL DAMAGE x${eaten}`,"#ff8fff",15))}bbRing(this.x,this.y,16,220,this.damage*.38,"#c86be8")}}for(const b of this.bites)b.life-=dt;this.bites=this.bites.filter(b=>b.life>0);bbContact(this,1.05)}
 render(g){super.render(g);g.save();g.strokeStyle="#b65bd9";g.globalAlpha=.55;g.lineWidth=5;g.beginPath();g.arc(this.arenaX,this.arenaY,this.arenaR,0,Math.PI*2);g.stroke();for(const b of this.bites){g.globalAlpha=.18;g.fillStyle="#8a2cad";g.beginPath();g.arc(b.x,b.y,b.r,0,Math.PI*2);g.fill()}g.restore()}
}

class VSX_MirrorGod extends Boss{
 constructor(x,y,wave){super(x,y,1);bbSetCommon(this,BIG_BOSS_DEFINITIONS[26],wave);this.size=54;this.speed=57;this.history=[];this.copyIndex=0;this.shadowCd=4}
 mimicWeapon(){const list=(game.player.weapons||[]).filter(w=>!w.def.rewardOnly&&!w.def.legendaryRelic&&w.id!=="mirror_clone");if(!list.length){bbRing(this.x,this.y,14,250,this.damage*.4,"#dfe8ff");return}const w=list[this.copyIndex++%Math.min(3,list.length)],tags=w.def.tags||[];VSX.announce(bbName(this),`MIRROR: ${w.name}`,this.def.color);if(tags.includes("explosive")||tags.includes("area")){for(let i=0;i<5;i++)bbTelegraphBlast(game.player.x+rand(150,-150),game.player.y+rand(150,-150),55,.75+i*.08,this.damage*.52,"#e8efff")}else if(tags.includes("rapid")){for(let i=0;i<4;i++)bbAim(this.x,this.y,390,this.damage*.30,"#eef5ff",5,.09)}else if(tags.includes("chain")||tags.includes("electric")){bbRing(this.x,this.y,18,275,this.damage*.40,"#cfe5ff",Math.random())}else bbAim(this.x,this.y,330,this.damage*.48,"#eef5ff",7,.14)}
 update(dt){this.history.push({t:game.time,x:game.player.x,y:game.player.y});while(this.history.length&&game.time-this.history[0].t>5)this.history.shift();bbMove(this,dt,.9);this.abilityTimer-=dt;this.shadowCd-=dt;if(this.abilityTimer<=0){this.abilityTimer=this.ascended?3.2:4.4;this.mimicWeapon()}if(this.shadowCd<=0){this.shadowCd=5.6;const h=this.history.find(q=>game.time-q.t>=3.6);if(h){bbTelegraphBlast(h.x,h.y,68,.75,this.damage*.72,"#f1f6ff");game.texts.push(new FloatingText(h.x,h.y-38,"SHADOW PLAYER","#eef4ff",13))}}bbContact(this,1.05)}
}

function createBigBossForWave(wave){
 const rawIndex=Math.max(0,Math.floor((wave-5)/2)),asc=wave>=25,key=BIG_BOSS_ORDER[rawIndex%BIG_BOSS_ORDER.length];
 const def=BIG_BOSS_DEFINITIONS[key]||BIG_BOSS_DEFINITIONS[8],a=Math.random()*Math.PI*2,rr=Math.hypot(innerWidth,innerHeight)*.53+150,x=game.player.x+Math.cos(a)*rr,y=game.player.y+Math.sin(a)*rr;let b;
 if(key===8){b=new Boss(x,y,1);bbSetCommon(b,def,wave);b.vsxPhase=1;b.vsxAbilityTimer=4}
 else if(key===10)b=new VSX_NullArchitect(x,y,wave);
 else if(key===12)b=new VSX_AbyssalLeviathan(x,y,wave);
 else if(key===14)b=new VSX_ChronoEmperor(x,y,wave);
 else if(key===16)b=new VSX_HiveMother(x,y,wave);
 else if(key===18)b=new VSX_VoidJudge(x,y,wave);
 else if(key===20)b=new VSX_EclipseSeraph(x,y,wave);
 else if(key===22)b=new VSX_OmegaColossus(x,y,wave);
 else if(key===24)b=new VSX_WorldEater(x,y,wave);
 else b=new VSX_MirrorGod(x,y,wave);
 if(asc){b.ascended=true;b.maxHp*=1.42;b.hp=b.maxHp;b.damage*=1.20;b.speed*=1.08;const mods=["FRENZIED","CORRUPTED","TEMPORAL","RELENTLESS"];b.ascendedModifier=mods[Math.floor((wave-25)/2)%mods.length];b.abilityTimer*=.78}
 vsxApplyDifficulty(b);return b
}

Game.prototype.spawnBigBossForWave=function(wave){
 if(this.boss||this.state!=="PLAYING"){this.pendingBigBossWave=wave;return false}
 const b=createBigBossForWave(wave);this.boss=b;this.enemies.push(b);this.pendingBigBossWave=null;this.lastMajorEncounterTime=this.time;vsxDiscover("bosses",b.bigBossId);bbAnnounce(b,wave,b.ascended);return true
};

// Final spawn director: ordinary enemies remain continuous, old 180-second boss timer is removed.
SpawnManager.prototype.update=function(dt){
 this.timer-=dt;this.specialTimer-=dt;const mode=DIFFICULTY_DEFINITIONS[game.difficultyMode||"normal"],w=game.wave||1,phase=w<=1?.74:w===2?.81:w===3?.86:w===4?.90:w===5?.93:.94;const near=game.grid?.queryCircle(game.player.x,game.player.y,620)?.filter(e=>!e.dead).length||0,density=near>145?.52:near>105?.68:near>75?.82:1,pressure=(mode.spawn||.9)*phase*density*(game.boss?.bigBoss?.82:1);if(this.timer<=0&&game.enemies.length<GAME_CONFIG.maxEnemies){const intensity=1+game.time/112,batchBase=Math.min(6,1+Math.floor(game.time/105)),batch=Math.max(1,Math.round(batchBase*Math.min(1,pressure)));for(let i=0;i<batch;i++)this.spawnOne();const old=Math.max(GAME_CONFIG.minSpawnInterval,GAME_CONFIG.spawnBaseInterval/Math.sqrt(intensity));this.timer=old/Math.max(.45,pressure)}if(this.specialTimer<=0){this.specialTimer=GAME_CONFIG.specialSpawnCheckInterval;if(!game.boss?.bigBoss)this.trySpecialSpawns()}
};

const BIGBOSS_GAME_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
 const prevWave=this.wave||1;BIGBOSS_GAME_UPDATE_BASE.call(this,dt);if(this.state!=="PLAYING"||!this.player)return;const w=this.wave||1;
 if(w!==prevWave&&w>=5&&w%2===1&&!this.bigBossWavesSpawned?.has?.(w)){this.bigBossWavesSpawned||=new Set();this.bigBossWavesSpawned.add(w);this.pendingBigBossWave=w}
 if(this.pendingBigBossWave&&!this.boss)this.spawnBigBossForWave(this.pendingBigBossWave);
 if(this.boss?.bigBoss&&this.boss.ascendedModifier==="CORRUPTED"){this._corruptTick=(this._corruptTick||0)-dt;if(this._corruptTick<=0){this._corruptTick=2.8;bbRing(this.boss.x,this.boss.y,10,200,this.boss.damage*.25,"#d570ff",Math.random())}}
};

const BIGBOSS_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){BIGBOSS_INIT_BASE.call(this);this.bigBossWavesSpawned=new Set();this.pendingBigBossWave=null;this._corruptTick=0};

// Big bosses temporarily own the battlefield: no new event/mini-boss starts while active.
const BIGBOSS_EVENT_BASE=Game.prototype.startWorldEvent;
Game.prototype.startWorldEvent=function(){if(this.boss?.bigBoss)return;return BIGBOSS_EVENT_BASE.call(this)};
const BIGBOSS_MINI_BASE=Game.prototype.spawnMiniBoss;
Game.prototype.spawnMiniBoss=function(){if(this.boss?.bigBoss)return;return BIGBOSS_MINI_BASE.call(this)};

// Invulnerability phases (Leviathan dive / Omega overheat / Architect recompile).
const BIGBOSS_DAMAGE_BASE=Game.prototype.damageEnemy;
Game.prototype.damageEnemy=function(e,amount,o={}){
 if(e?.bigBossInvulnerable){if(!o.silent&&Math.random()<.18)this.texts.push(new FloatingText(e.x,e.y-e.size-8,VSX.lang==="vi"?"BẤT KHẢ XÂM PHẠM":"IMMUNE","#9fe8ff",11));return{killed:false,crit:false}}
 if(e?.bigBossId==="null_architect"&&e.recompile>0)amount*=.38;
 if(e?.bigBossId==="omega_colossus"&&e.overheat>0)amount*=1.75;
 if(e?.bigBossId==="void_judge"&&e.reflect>0&&o.source?.def?.tags?.includes("projectile")){amount*=.42;if(Math.random()<.08)bbAim(e.x,e.y,330,e.damage*.35,"#e5bd70",1,0)}
 return BIGBOSS_DAMAGE_BASE.call(this,e,amount,o)
};

// Dynamic Big Boss HUD title.
const BIGBOSS_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force=false){const r=BIGBOSS_HUD_BASE.call(this,force);if(this.boss&&!this.boss.dead){bossWrap.style.display="block";bossName.textContent=`${this.boss.ascended?`${t("ascendedBoss")} • `:""}${bbName(this.boss)}${this.boss.ascendedModifier?` • ${this.boss.ascendedModifier}`:""}`;bossFill.style.width=`${100*this.boss.hp/this.boss.maxHp}%`}return r};

// Collection/Codex: expose all Big Bosses.
const BIGBOSS_CODEX_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){if(cat!=="bosses")return BIGBOSS_CODEX_BASE(cat);return BIG_BOSS_ORDER.map((key,i)=>{const d=BIG_BOSS_DEFINITIONS[key],w=BIG_BOSS_WAVE_SCHEDULE[i];return[d.id,d.name[VSX.lang],VSX.lang==="vi"?`Đại Boss xuất hiện từ Đợt ${w}.`:`Big Boss first appearing at Wave ${w}.`]})};

// ---------- MB9 durability rebalance ----------
MbappeAlly.prototype.syncHealth=function(initial=false){
 const sv=game.player.passiveLevel("shared_vitality"),next=Math.max(1,Math.round(game.player.maxHp*1.20*(1+.12*sv)));if(initial){this.maxHp=next;this.hp=next;this.lastDamageAt=game.time||0;this.survivalRun=0;return}if(next!==this.maxHp){const ratio=this.maxHp>0?this.hp/this.maxHp:1;this.maxHp=next;this.hp=clamp(this.maxHp*ratio,1,this.maxHp)}
};
MbappeAlly.prototype.takeDamage=function(amount,info={}){
 if(this.dead||this.invuln>0)return;const sv=game.player.passiveLevel("shared_vitality");if(sv>0){const redirected=amount*Math.min(.30,.06*sv);amount-=redirected;game.player.takeDamage(redirected,{sharedVitality:true})}amount*=.70;if(info?.boss)amount*=.85;amount=Math.max(1,amount);this.hp-=amount;this.invuln=.55;this.lastDamageAt=game.time;game.texts.push(new FloatingText(this.x,this.y-26,`-${Math.round(amount)}`,"#ff9aa5",13));if(this.hp/this.maxHp<.25)this.survivalRun=Math.max(this.survivalRun||0,3.5);if(this.hp<=0){this.hp=0;this.dead=true;game.texts.push(new FloatingText(this.x,this.y-44,"MBAPPÉ DOWN!","#ffd84d",20));game.spark(this.x,this.y,"#ffffff",24)}
};
MbappeAlly.prototype.update=function(dt){
 if(this.dead)return;this.syncHealth();this.invuln=Math.max(0,this.invuln-dt);this.cool-=dt;this.survivalRun=Math.max(0,(this.survivalRun||0)-dt);if(game.time-(this.lastDamageAt||0)>5&&this.hp<this.maxHp*.75)this.hp=Math.min(this.maxHp*.75,this.hp+this.maxHp*.008*dt);
 if(this.survivalRun>0){const dx=game.player.x-this.x,dy=game.player.y-this.y,d=Math.hypot(dx,dy)||1;if(d>100){this.x+=dx/d*500*dt;this.y+=dy/d*500*dt}return}
 if(!this.target||this.target.dead||this.target.isCaptive||Math.hypot(this.target.x-this.x,this.target.y-this.y)>1250)this.target=game.findNearest(this.x,this.y,1150);if(this.target?.isCaptive)this.target=null;if(this.target){const dx=this.target.x-this.x,dy=this.target.y-this.y,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;const pace=Math.sin(game.time*9.5)*82;const speed=d>190?545:455;this.x+=(nx*speed-ny*pace)*dt;this.y+=(ny*speed+nx*pace)*dt;if(d<this.target.size+this.radius+15&&this.cool<=0){this.cool=.16/game.allyAttackSpeedMultiplier();game.damageEnemy(this.target,34*game.player.damageMultiplier*game.allyDamageMultiplier(),{source:null,canCrit:false,knockback:82,fromX:this.x,fromY:this.y});game.spark(this.target.x,this.target.y,"#ffd84d",6)}}else{const dx=game.player.x-this.x,dy=game.player.y-this.y,d=Math.hypot(dx,dy)||1;if(d>190){this.x+=dx/d*410*dt;this.y+=dy/d*410*dt}}
 const near=game.grid.queryCircle(this.x,this.y,this.radius+38);for(const e of near){if(e.dead||e.isCaptive)continue;if(Math.hypot(e.x-this.x,e.y-this.y)<this.radius+e.size){const ready=this.contactTimes.get(e.id)||0;if(ready<=game.time){this.contactTimes.set(e.id,game.time+.85);this.takeDamage(e.damage*.38,{boss:!!(e.isBoss||e.isMiniBoss)})}}}
};
