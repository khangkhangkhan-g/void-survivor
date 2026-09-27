(function(){
"use strict";

const E10_IDS=["void_leech","shard_sniper","bulwark_pair","phase_stalker","grave_carrier","xp_devourer","mirror_husk","chrono_mine_layer","swarm_mother","void_auditor"];
const E10_META={
 void_leech:{name:{en:"Void Leech",vi:"Đỉa Hư Không"},wave:3,desc:{en:"Latches onto the survivor, slows movement and drains Ultimate charge. Dash tears it loose.",vi:"Bám vào người chơi, làm chậm di chuyển và hút Tuyệt Kỹ. Dash sẽ hất nó ra."}},
 shard_sniper:{name:{en:"Shard Sniper",vi:"Xạ Thủ Mảnh Vỡ"},wave:4,desc:{en:"Keeps long range, paints a laser line, then fires a very fast piercing shard.",vi:"Giữ khoảng cách xa, khóa đường ngắm laser rồi bắn mảnh vỡ tốc độ rất cao."}},
 bulwark_pair:{name:{en:"Bulwark Pair",vi:"Song Khiên"},wave:5,desc:{en:"Spawns in linked pairs. Their barrier line protects nearby enemies from projectile damage; crossing the line disables it briefly.",vi:"Xuất hiện theo cặp nối bằng khiên năng lượng. Địch gần đường khiên giảm sát thương projectile; chạy xuyên qua sẽ vô hiệu hóa khiên tạm thời."}},
 phase_stalker:{name:{en:"Phase Stalker",vi:"Kẻ Rình Pha"},wave:6,desc:{en:"Alternates between solid and phased states. Projectiles barely affect it while phased before it rematerializes near you.",vi:"Luân phiên trạng thái hữu hình và xuyên pha. Projectile gần như vô dụng lúc xuyên pha trước khi nó tái hiện gần người chơi."}},
 grave_carrier:{name:{en:"Grave Carrier",vi:"Kẻ Khiêng Mộ"},wave:7,desc:{en:"Harvests nearby fallen enemies. Five corpses create a destructible Bone Totem that accelerates the surrounding horde.",vi:"Thu gom xác địch gần đó. Đủ 5 xác sẽ dựng Cốt Trụ có thể phá, tăng tốc bầy địch xung quanh."}},
 xp_devourer:{name:{en:"XP Devourer",vi:"Kẻ Nuốt Kinh Nghiệm"},wave:8,desc:{en:"Ignores the survivor to eat loose XP. It grows tougher with every gem and returns most stolen XP when killed.",vi:"Bỏ qua người chơi để săn XP rơi trên sân. Càng ăn càng lớn và cứng; khi chết hoàn lại phần lớn XP đã nuốt."}},
 mirror_husk:{name:{en:"Mirror Husk",vi:"Vỏ Gương"},wave:10,desc:{en:"Adapts to repeated damage from the same source. Switching weapons resets its resistance and grants a brief opening.",vi:"Thích nghi với sát thương lặp lại từ cùng một nguồn. Đổi vũ khí sẽ reset kháng và mở một nhịp gây sát thương tốt hơn."}},
 chrono_mine_layer:{name:{en:"Chrono Mine Layer",vi:"Kẻ Rải Mìn Thời Gian"},wave:11,desc:{en:"Orbits the fight and drops Chrono Mines. Blue arming fields slow enemies; once armed, red fields slow the survivor and friendly projectiles.",vi:"Đi vòng ngoài và rải Mìn Thời Gian. Pha xanh làm chậm địch; khi kích hoạt, vùng đỏ làm chậm người chơi và projectile đồng minh."}},
 swarm_mother:{name:{en:"Swarm Mother",vi:"Mẫu Thể Bầy Đàn"},wave:12,desc:{en:"A durable breeder that continuously births larvae. Killing the Mother sends surviving larvae into a short frenzy before they decay.",vi:"Mẫu thể nhiều máu liên tục sinh ấu trùng. Hạ Mẫu Thể khiến ấu trùng còn sống cuồng hóa ngắn rồi tự tiêu biến."}},
 void_auditor:{name:{en:"Void Auditor",vi:"Kiểm Toán Hư Không"},wave:13,desc:{en:"Audits your highest damage source and grants nearby enemies resistance to that source until the Auditor is destroyed.",vi:"Quét nguồn sát thương cao nhất của bạn và cho địch quanh nó kháng nguồn đó cho đến khi Auditor bị hạ."}}
};

Object.assign(ENEMY_DEFINITIONS,{
 void_leech:{name:"Void Leech",hp:38,speed:118,damage:5,size:10,xp:5,color:"#8f5cff",shape:"circle",behavior:"enemy10",spawnWeight:1.15,minimumTime:120,knockbackResistance:.05},
 shard_sniper:{name:"Shard Sniper",hp:46,speed:54,damage:17,size:14,xp:8,color:"#ed72ff",shape:"diamond",behavior:"enemy10",spawnWeight:.86,minimumTime:180,knockbackResistance:.12},
 bulwark_pair:{name:"Bulwark Pair",hp:78,speed:46,damage:14,size:19,xp:8,color:"#5f86ff",shape:"square",behavior:"enemy10",spawnWeight:.58,minimumTime:240,knockbackResistance:.48},
 phase_stalker:{name:"Phase Stalker",hp:58,speed:82,damage:16,size:15,xp:9,color:"#876dff",shape:"diamond",behavior:"enemy10",spawnWeight:.72,minimumTime:300,knockbackResistance:.18},
 grave_carrier:{name:"Grave Carrier",hp:92,speed:48,damage:15,size:20,xp:11,color:"#a9bd76",shape:"hex",behavior:"enemy10",spawnWeight:.52,minimumTime:360,knockbackResistance:.42},
 xp_devourer:{name:"XP Devourer",hp:72,speed:74,damage:10,size:16,xp:12,color:"#4eea9b",shape:"circle",behavior:"enemy10",spawnWeight:.40,minimumTime:420,knockbackResistance:.24},
 mirror_husk:{name:"Mirror Husk",hp:105,speed:55,damage:16,size:19,xp:13,color:"#d7e8ff",shape:"hex",behavior:"enemy10",spawnWeight:.50,minimumTime:540,knockbackResistance:.36},
 chrono_mine_layer:{name:"Chrono Mine Layer",hp:82,speed:65,damage:13,size:17,xp:13,color:"#5ed1e8",shape:"diamond",behavior:"enemy10",spawnWeight:.42,minimumTime:600,knockbackResistance:.24},
 swarm_mother:{name:"Swarm Mother",hp:185,speed:34,damage:20,size:27,xp:20,color:"#d55a9e",shape:"hex",behavior:"enemy10",spawnWeight:.31,minimumTime:660,knockbackResistance:.67},
 void_auditor:{name:"Void Auditor",hp:125,speed:44,damage:14,size:21,xp:18,color:"#e5c46c",shape:"square",behavior:"enemy10",spawnWeight:.25,minimumTime:720,knockbackResistance:.52}
});

function e10Name(id){const m=E10_META[id];return m?m.name[VSX.lang]:ENEMY_DEFINITIONS[id]?.name||id}
function e10SrcId(o){return o?.source?.id||game?._damageAttribution||o?.damageType||"environment"}
function e10IsProjectile(o){return !!o?.source?.def?.tags?.includes("projectile")}
function e10Alive(id){return (game.enemies||[]).filter(e=>!e.dead&&e.type===id)}
function e10MoveToward(e,x,y,speed,dt){const n=normalize(x-e.x,y-e.y);e.x+=n.x*speed*dt;e.y+=n.y*speed*dt}
function e10Contact(e,p){if(e.dead||e.vsxAttached)return;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<e.size+p.radius){p.takeDamage(e.damage,{fromX:e.x,fromY:e.y,enemy:e,physical:true});const n=normalize(e.x-p.x,e.y-p.y);e.x+=n.x*12;e.y+=n.y*12}}
function e10Pre(e,dt){e.flash=Math.max(0,e.flash-dt);if(e.regen)e.hp=Math.min(e.maxHp,e.hp+e.regen*dt);let sm=e.updateStatus(dt);if(e.dead)return 0;if(game.timeDilation>0)sm*=.38;return sm}
function e10NearestGem(e,max=650){let best=null,bd=max;for(const g of game.gems||[]){if(g.dead)continue;const d=Math.hypot(g.x-e.x,g.y-e.y);if(d<bd){bd=d;best=g}}return best}
function e10Pair(e){return e.vsxPairId?(game.enemies||[]).find(q=>!q.dead&&q.id===e.vsxPairId):null}
function e10EnsurePair(e){if(e.vsxPairEver)return e10Pair(e);const other=(game.enemies||[]).find(q=>q!==e&&!q.dead&&q.type==="bulwark_pair"&&!q.vsxPairEver);if(other){e.vsxPairEver=other.vsxPairEver=true;e.vsxPairId=other.id;other.vsxPairId=e.id;return other}if(game.enemies.length<GAME_CONFIG.maxEnemies){const a=Math.atan2(e.y-game.player.y,e.x-game.player.x)+Math.PI/2;const mate=vsxApplyDifficulty(new Enemy("bulwark_pair",e.x+Math.cos(a)*170,e.y+Math.sin(a)*170,game.difficulty,null));e.vsxPairEver=mate.vsxPairEver=true;e.vsxPairId=mate.id;mate.vsxPairId=e.id;game.enemies.push(mate);return mate}e.vsxPairEver=true;return null}
function e10LinkActive(e,pair){return pair&&!pair.dead&&Math.max(e.vsxLinkDisabledUntil||0,pair.vsxLinkDisabledUntil||0)<=game.time}
function e10SourceLabel(id){if(!id||id==="environment")return VSX.lang==="vi"?"MÔI TRƯỜNG":"ENVIRONMENT";try{return WEAPON_DEFINITIONS[id]?weaponName(id):String(id).replaceAll("_"," ").toUpperCase()}catch(_){return String(id).replaceAll("_"," ").toUpperCase()}}

class E10BoneTotem{
 constructor(x,y){this.kind="bone_totem";this.x=x;this.y=y;this.radius=28;this.aura=225;this.hp=110;this.maxHp=110;this.life=18;this.dead=false;this.hit=new Set()}
 update(dt){this.life-=dt;if(this.life<=0){this.dead=true;return}for(const p of game.projectiles||[]){if(p.dead||p.owner==="enemy"||this.hit.has(p.id))continue;if(Math.hypot(p.x-this.x,p.y-this.y)<this.radius+(p.radius||4)){this.hit.add(p.id);this.hp-=Math.max(1,p.damage||5);game.spark(this.x,this.y,"#bed58b",3);if((p.pierce||0)<=0)p.dead=true;if(this.hp<=0){this.dead=true;game.spark(this.x,this.y,"#dbe9aa",16);game.texts.push(new FloatingText(this.x,this.y-36,VSX.lang==="vi"?"CỐT TRỤ BỊ PHÁ":"BONE TOTEM BROKEN","#dbe9aa",13));break}}}}
 render(g){g.save();g.globalAlpha=.09;g.fillStyle="#a7c46d";g.beginPath();g.arc(this.x,this.y,this.aura,0,Math.PI*2);g.fill();g.globalAlpha=1;g.translate(this.x,this.y);g.shadowBlur=12;g.shadowColor="#b8cf7b";g.strokeStyle="#d4e5a1";g.lineWidth=4;g.beginPath();g.moveTo(0,22);g.lineTo(0,-24);g.moveTo(-14,-5);g.lineTo(14,-5);g.moveTo(-10,15);g.lineTo(10,-15);g.stroke();g.fillStyle="#8fa960";g.beginPath();g.arc(0,-25,8,0,Math.PI*2);g.fill();g.restore();const w=46;g.fillStyle="#27301e";g.fillRect(this.x-w/2,this.y-41,w,4);g.fillStyle="#b9d77b";g.fillRect(this.x-w/2,this.y-41,w*clamp(this.hp/this.maxHp,0,1),4)}
}
class E10ChronoMine{
 constructor(x,y){this.kind="chrono_mine";this.x=x;this.y=y;this.radius=88;this.body=13;this.arm=2.6;this.life=8.6;this.hp=50;this.maxHp=50;this.dead=false;this.hit=new Set()}
 get hostile(){return this.arm<=0}
 update(dt){this.life-=dt;this.arm-=dt;if(this.life<=0){this.dead=true;return}for(const p of game.projectiles||[]){if(p.dead||p.owner==="enemy"||this.hit.has(p.id))continue;if(Math.hypot(p.x-this.x,p.y-this.y)<this.body+(p.radius||4)){this.hit.add(p.id);this.hp-=Math.max(1,p.damage||5);if((p.pierce||0)<=0)p.dead=true;if(this.hp<=0){this.dead=true;game.spark(this.x,this.y,"#7ceaff",12);break}}}}
 render(g){g.save();g.globalAlpha=.08+(this.hostile?.06:0);g.fillStyle=this.hostile?"#ff668c":"#65dff2";g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.fill();g.globalAlpha=.78;g.strokeStyle=this.hostile?"#ff668c":"#65dff2";g.lineWidth=2;g.setLineDash([8,7]);g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.stroke();g.setLineDash([]);g.globalAlpha=1;g.translate(this.x,this.y);g.fillStyle=this.hostile?"#ff668c":"#65dff2";g.beginPath();g.arc(0,0,this.body,0,Math.PI*2);g.fill();g.strokeStyle="#07111b";g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(0,-8);g.moveTo(0,0);g.lineTo(6,3);g.stroke();g.restore()}
}
function e10Mines(){return (game.vsxEnemy10Objects||[]).filter(o=>!o.dead&&o.kind==="chrono_mine")}
function e10EnemyTimeFactor(e){for(const m of e10Mines())if(!m.hostile&&Math.hypot(e.x-m.x,e.y-m.y)<m.radius+e.size)return .58;return 1}
function e10PlayerMineSlow(){const p=game?.player;if(!p)return 1;for(const m of e10Mines())if(m.hostile&&Math.hypot(p.x-m.x,p.y-m.y)<m.radius+p.radius)return .70;return 1}
function e10ProjectileTimeFactor(p){for(const m of e10Mines()){const d=Math.hypot(p.x-m.x,p.y-m.y);if(d<m.radius+(p.radius||4)){if(!m.hostile&&p.owner==="enemy")return .56;if(m.hostile&&p.owner!=="enemy")return .72}}return 1}
function e10TotemNear(e){return (game.vsxEnemy10Objects||[]).find(o=>!o.dead&&o.kind==="bone_totem"&&Math.hypot(e.x-o.x,e.y-o.y)<o.aura+e.size)}

const E10_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){E10_INIT_BASE.call(this);this.vsxEnemy10Objects=[];this.vsxEnemy10Corpses=[]};

const E10_RECALC_BASE=Player.prototype.recalc;
Player.prototype.recalc=function(){const r=E10_RECALC_BASE.call(this);if(game?.enemies){const attached=game.enemies.filter(e=>!e.dead&&e.type==="void_leech"&&e.vsxAttached).length;if(attached)this.moveSpeed*=Math.max(.64,1-.14*attached)}this.moveSpeed*=e10PlayerMineSlow();return r};

const E10_PROJECTILE_BASE=Projectile.prototype.update;
Projectile.prototype.update=function(dt){return E10_PROJECTILE_BASE.call(this,dt*e10ProjectileTimeFactor(this))};

const E10_ENEMY_UPDATE_BASE=Enemy.prototype.update;
Enemy.prototype.update=function(dt){
 const special=E10_META[this.type];
 if(!special){const factor=e10EnemyTimeFactor(this);const r=E10_ENEMY_UPDATE_BASE.call(this,dt*factor);if(!this.dead&&!this.isBoss&&!this.isMiniBoss){const t=e10TotemNear(this);if(t){const p=game.player,n=normalize(p.x-this.x,p.y-this.y);this.x+=n.x*this.speed*.16*dt;this.y+=n.y*this.speed*.16*dt;if(this.shotTimer!=null)this.shotTimer-=dt*.28}if(this.vsxLarva){if(this.vsxFrenzyUntil>game.time){const p=game.player,n=normalize(p.x-this.x,p.y-this.y);this.x+=n.x*this.speed*.55*dt;this.y+=n.y*this.speed*.55*dt}if(this.vsxDecayAt&&game.time>=this.vsxDecayAt){this.dead=true;game.spark(this.x,this.y,"#d55a9e",4)}}}return r}
 const factor=e10EnemyTimeFactor(this),edt=dt*factor,sm=e10Pre(this,edt);if(this.dead||sm===0)return;const p=game.player,dx=p.x-this.x,dy=p.y-this.y,d=Math.hypot(dx,dy)||1;let nx=dx/d,ny=dy/d;if(this.statuses?.has("confuse")){nx=-nx;ny=-ny}this.vsxT=(this.vsxT||0)+edt;
 if(this.type==="void_leech"){
   this.vsxAttachCooldown=Math.max(0,(this.vsxAttachCooldown||0)-edt);
   if(this.vsxAttached){if(game.dashTimer>0){this.vsxAttached=false;this.vsxAttachCooldown=.9;const n=normalize(this.x-p.x,this.y-p.y);this.x=p.x+n.x*85;this.y=p.y+n.y*85;game.texts.push(new FloatingText(p.x,p.y-34,VSX.lang==="vi"?"HẤT ĐỈA":"LEECH EJECTED","#a98cff",11));p.recalc?.()}else{const a=(this.vsxAttachAngle||0)+Math.sin(game.time*5)*.18;this.x=p.x+Math.cos(a)*(p.radius+this.size-2);this.y=p.y+Math.sin(a)*(p.radius+this.size-2);game.ultimateCharge=Math.max(0,(game.ultimateCharge||0)-4.2*edt)}return}
   this.x+=nx*this.speed*sm*edt;this.y+=ny*this.speed*sm*edt;if(d<this.size+p.radius+3&&this.vsxAttachCooldown<=0){this.vsxAttached=true;this.vsxAttachAngle=Math.atan2(this.y-p.y,this.x-p.x);game.texts.push(new FloatingText(p.x,p.y-35,VSX.lang==="vi"?"ĐỈA BÁM!":"LEECH ATTACHED!","#aa80ff",12));p.recalc?.()}return
 }
 if(this.type==="shard_sniper"){
   this.vsxShot=(this.vsxShot??rand(2.1,.8))-edt;if(d<330){this.x-=nx*this.speed*sm*edt;this.y-=ny*this.speed*sm*edt}else if(d>580){this.x+=nx*this.speed*sm*edt;this.y+=ny*this.speed*sm*edt}else{this.x+=-ny*this.speed*.28*edt;this.y+=nx*this.speed*.28*edt}if(this.vsxShot<=0){this.vsxShot=3.15;const sx=this.x,sy=this.y,tx=p.x,ty=p.y,self=this;game.telegraphs.push(new VSX_Telegraph({type:"line",x:sx,y:sy,x2:tx,y2:ty,life:1.15,color:"#f06dff",callback:()=>{if(self.dead)return;const n=normalize(tx-self.x,ty-self.y);game.enemyProjectiles.push(new Projectile({x:self.x,y:self.y,vx:n.x*760,vy:n.y*760,radius:5,damage:self.damage*1.22,life:2.2,pierce:1,color:"#f486ff",owner:"enemy",critAllowed:false}))}}))}e10Contact(this,p);return
 }
 if(this.type==="bulwark_pair"){
   const pair=e10EnsurePair(this);if(pair&&!pair.dead){const pd=Math.hypot(pair.x-this.x,pair.y-this.y)||1;if(pd>220){this.x+=(pair.x-this.x)/pd*this.speed*.24*edt;this.y+=(pair.y-this.y)/pd*this.speed*.24*edt}else if(pd<145){this.x-=(pair.x-this.x)/pd*this.speed*.20*edt;this.y-=(pair.y-this.y)/pd*this.speed*.20*edt}if(e10LinkActive(this,pair)&&pointSegDist(p.x,p.y,this.x,this.y,pair.x,pair.y)<p.radius+10){this.vsxLinkDisabledUntil=pair.vsxLinkDisabledUntil=game.time+2.4;game.texts.push(new FloatingText(p.x,p.y-30,VSX.lang==="vi"?"PHÁ ĐƯỜNG KHIÊN":"BARRIER BREACHED","#8cb4ff",11))}}this.x+=nx*this.speed*.62*sm*edt;this.y+=ny*this.speed*.62*sm*edt;e10Contact(this,p);return
 }
 if(this.type==="phase_stalker"){
   this.vsxPhaseTimer=(this.vsxPhaseTimer??rand(3.6,2.4))-edt;if(this.vsxPhased){this.x+=(-ny*.65+nx*.18)*this.speed*sm*edt;this.y+=(nx*.65+ny*.18)*this.speed*sm*edt;if(this.vsxPhaseTimer<=0){this.vsxPhased=false;this.vsxPhaseTimer=3.6;const a=Math.atan2(p.y-this.y,p.x-this.x)+rand(.65,-.65),rr=rand(155,105);this.x=p.x-Math.cos(a)*rr;this.y=p.y-Math.sin(a)*rr;game.effects.push(new WaveEffect(this.x,this.y,48,.28,0,0,null,"#9578ff"));this.aiTimer=.25}}else{this.x+=nx*this.speed*sm*edt;this.y+=ny*this.speed*sm*edt;if(this.vsxPhaseTimer<=0){this.vsxPhased=true;this.vsxPhaseTimer=1.75;game.texts.push(new FloatingText(this.x,this.y-this.size-10,VSX.lang==="vi"?"XUYÊN PHA":"PHASE","#aa92ff",10))}e10Contact(this,p)}return
 }
 if(this.type==="grave_carrier"){
   this.x+=nx*this.speed*.72*sm*edt;this.y+=ny*this.speed*.72*sm*edt;this.vsxCollect=(this.vsxCollect??.15)-edt;if(this.vsxCollect<=0){this.vsxCollect=.22;for(const c of game.vsxEnemy10Corpses||[]){if(c.claimed||c.life<=0)continue;if(Math.hypot(c.x-this.x,c.y-this.y)<125){c.claimed=true;this.vsxCorpses=(this.vsxCorpses||0)+1;game.spark(c.x,c.y,"#b5cc7a",4);if(this.vsxCorpses>=5){this.vsxCorpses=0;game.vsxEnemy10Objects.push(new E10BoneTotem(this.x,this.y));game.texts.push(new FloatingText(this.x,this.y-34,VSX.lang==="vi"?"DỰNG CỐT TRỤ":"BONE TOTEM","#c5dc8a",12));break}}}}e10Contact(this,p);return
 }
 if(this.type==="xp_devourer"){
   const gem=e10NearestGem(this,900);if(gem){e10MoveToward(this,gem.x,gem.y,this.speed*sm,edt);if(Math.hypot(gem.x-this.x,gem.y-this.y)<this.size+gem.r+5){gem.dead=true;const v=Math.max(1,gem.value||1);this.vsxEatenXp=(this.vsxEatenXp||0)+v;const grow=Math.min(1.05,this.vsxEatenXp/100);this.size=Math.min(30,this.def.size+grow*13);const add=v*1.1;this.maxHp+=add;this.hp=Math.min(this.maxHp,this.hp+add);if(this.vsxEatenXp>=80&&!this.vsxGlutton){this.vsxGlutton=true;game.texts.push(new FloatingText(this.x,this.y-32,"VOID GLUTTON","#65f2ad",12))}else if(this.vsxEatenXp>=35&&!this.vsxBloated){this.vsxBloated=true;game.texts.push(new FloatingText(this.x,this.y-30,"BLOATED","#65f2ad",11))}}}else{const a=(this.id*.71)%6.28;this.x+=Math.cos(a)*this.speed*.35*edt;this.y+=Math.sin(a)*this.speed*.35*edt}e10Contact(this,p);return
 }
 if(this.type==="mirror_husk"){
   this.x+=nx*this.speed*.78*sm*edt;this.y+=ny*this.speed*.78*sm*edt;e10Contact(this,p);return
 }
 if(this.type==="chrono_mine_layer"){
   this.vsxMine=(this.vsxMine??1.1)-edt;const desired=400;if(d<desired-65){this.x-=nx*this.speed*sm*edt;this.y-=ny*this.speed*sm*edt}else if(d>desired+65){this.x+=nx*this.speed*sm*edt;this.y+=ny*this.speed*sm*edt}else{this.x+=-ny*this.speed*.75*edt;this.y+=nx*this.speed*.75*edt}if(this.vsxMine<=0){this.vsxMine=3.25;game.vsxEnemy10Objects.push(new E10ChronoMine(this.x,this.y));game.texts.push(new FloatingText(this.x,this.y-28,VSX.lang==="vi"?"MÌN THỜI GIAN":"CHRONO MINE","#69dce9",10))}e10Contact(this,p);return
 }
 if(this.type==="swarm_mother"){
   this.vsxBrood=(this.vsxBrood??1.6)-edt;this.x+=nx*this.speed*.62*sm*edt;this.y+=ny*this.speed*.62*sm*edt;if(this.vsxBrood<=0&&game.enemies.length<GAME_CONFIG.maxEnemies-3){this.vsxBrood=4.2;for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.random()*.35,e=vsxApplyDifficulty(new Enemy("swarmer",this.x+Math.cos(a)*36,this.y+Math.sin(a)*36,Math.max(.8,game.difficulty*.86),null));e.vsxLarva=true;e.vsxMotherId=this.id;e.size=Math.max(6,e.size*.78);e.maxHp*=.72;e.hp=e.maxHp;e.speed*=1.12;game.enemies.push(e)}game.spark(this.x,this.y,"#df73ad",8)}e10Contact(this,p);return
 }
 if(this.type==="void_auditor"){
   this.vsxAudit=(this.vsxAudit??.2)-edt;if(this.vsxAudit<=0){this.vsxAudit=2.2;const rows=Object.entries(game.stats?.damageBy||{}).filter(([id,v])=>v>0&&!String(id).startsWith("enemy10_")&&id!=="environment"&&id!=="admin").sort((a,b)=>b[1]-a[1]);this.vsxAuditSource=rows[0]?.[0]||null;if(this.vsxAuditSource&&this.vsxAuditShown!==this.vsxAuditSource){this.vsxAuditShown=this.vsxAuditSource;game.texts.push(new FloatingText(this.x,this.y-36,`AUDIT: ${e10SourceLabel(this.vsxAuditSource)}`,"#ead17a",10))}}if(d<260){this.x-=nx*this.speed*sm*edt;this.y-=ny*this.speed*sm*edt}else if(d>390){this.x+=nx*this.speed*sm*edt;this.y+=ny*this.speed*sm*edt}else{this.x+=-ny*this.speed*.35*edt;this.y+=nx*this.speed*.35*edt}e10Contact(this,p);return
 }
};

const E10_DAMAGE_BASE=Game.prototype.damageEnemy;
Game.prototype.damageEnemy=function(e,a,o={}){
 if(!e||e.dead)return E10_DAMAGE_BASE.call(this,e,a,o);
 const sid=e10SrcId(o);
 if(e.type==="phase_stalker"&&e.vsxPhased&&e10IsProjectile(o)){a*=.08;if(!o.silent&&Math.random()<.18)this.texts.push(new FloatingText(e.x,e.y-e.size-8,VSX.lang==="vi"?"XUYÊN PHA":"PHASED","#aa92ff",9))}
 if(e.type==="mirror_husk"&&sid&&sid!=="environment"){
   if(e.vsxMirrorSource===sid){const stacks=Math.min(6,(e.vsxMirrorStacks||0)+1);e.vsxMirrorStacks=stacks;a*=Math.max(.38,1-stacks*.10)}else{e.vsxMirrorSource=sid;e.vsxMirrorStacks=0;a*=1.12;if(!o.silent)this.texts.push(new FloatingText(e.x,e.y-e.size-10,VSX.lang==="vi"?"GƯƠNG VỠ NHỊP":"MIRROR OPEN","#d9efff",9))}
 }
 if(e10IsProjectile(o)&&e.type!=="bulwark_pair"){
   for(const b of e10Alive("bulwark_pair")){const pair=e10Pair(b);if(!pair||b.id>pair.id||!e10LinkActive(b,pair))continue;if(pointSegDist(e.x,e.y,b.x,b.y,pair.x,pair.y)<e.size+55){a*=.45;if(!o.silent&&Math.random()<.09)this.texts.push(new FloatingText(e.x,e.y-e.size-8,VSX.lang==="vi"?"KHIÊN LIÊN KẾT":"LINK GUARD","#86a9ff",9));break}}
 }
 if(sid&&sid!=="environment"){
   for(const au of e10Alive("void_auditor")){if(!au.vsxAuditSource||au.vsxAuditSource!==sid)continue;if(Math.hypot(e.x-au.x,e.y-au.y)<225+e.size){a*=.64;if(!o.silent&&Math.random()<.08)this.texts.push(new FloatingText(e.x,e.y-e.size-8,VSX.lang==="vi"?"ĐÃ KIỂM TOÁN":"AUDITED","#e7cb73",9));break}}
 }
 return E10_DAMAGE_BASE.call(this,e,a,o)
};

const E10_DIE_BASE=Enemy.prototype.die;
Enemy.prototype.die=function(drop=true){if(this.dead)return;const type=this.type,x=this.x,y=this.y,eaten=this.vsxEatenXp||0,motherId=this.id;E10_DIE_BASE.call(this,drop);if(type==="void_leech")game.player?.recalc?.();if(type!=="xp_devourer"&&type!=="swarm_mother"&&!this.isBoss&&!this.isMiniBoss&&!this.specialId){game.vsxEnemy10Corpses||=[];game.vsxEnemy10Corpses.push({x,y,type,life:8,claimed:false})}if(type==="xp_devourer"&&eaten>0){let remain=Math.max(1,Math.round(eaten*.88));while(remain>0){const v=Math.min(20,remain);remain-=v;game.gems.push(new XPGem(x+rand(38,-38),y+rand(38,-38),v))}game.texts.push(new FloatingText(x,y-36,`${VSX.lang==="vi"?"XP HOÀN LẠI":"XP RETURN"} ${Math.round(eaten*.88)}`,"#66f3a8",12))}if(type==="swarm_mother"){for(const q of game.enemies||[])if(!q.dead&&q.vsxLarva&&q.vsxMotherId===motherId){q.vsxFrenzyUntil=game.time+4.5;q.vsxDecayAt=game.time+6;q.speed*=1.32;q.damage*=1.28;game.spark(q.x,q.y,"#ff6eb2",3)}}};

const E10_RENDER_BASE=Enemy.prototype.render;
Enemy.prototype.render=function(g){const phase=this.type==="phase_stalker"&&this.vsxPhased;g.save();if(phase)g.globalAlpha=.24;E10_RENDER_BASE.call(this,g);g.restore();if(!E10_META[this.type]||this.dead)return;g.save();
 if(this.type==="void_leech"&&this.vsxAttached){g.strokeStyle="rgba(164,116,255,.7)";g.lineWidth=2;g.beginPath();g.moveTo(this.x,this.y);g.lineTo(game.player.x,game.player.y);g.stroke()}
 else if(this.type==="shard_sniper"){g.strokeStyle="#f5a1ff";g.lineWidth=1.5;g.beginPath();g.arc(this.x,this.y,this.size+6,0,Math.PI*2);g.stroke();g.beginPath();g.moveTo(this.x-7,this.y);g.lineTo(this.x+7,this.y);g.moveTo(this.x,this.y-7);g.lineTo(this.x,this.y+7);g.stroke()}
 else if(this.type==="bulwark_pair"){const pair=e10Pair(this);if(pair&&this.id<pair.id){const active=e10LinkActive(this,pair);g.strokeStyle=active?"rgba(104,146,255,.78)":"rgba(104,146,255,.22)";g.lineWidth=active?7:2;if(!active)g.setLineDash([8,8]);g.beginPath();g.moveTo(this.x,this.y);g.lineTo(pair.x,pair.y);g.stroke();g.setLineDash([])}}
 else if(this.type==="grave_carrier"){g.fillStyle="#d9e8a6";g.font="900 9px Arial";g.textAlign="center";g.fillText(`${this.vsxCorpses||0}/5`,this.x,this.y-this.size-9)}
 else if(this.type==="xp_devourer"){g.fillStyle="#8ff5c1";g.font="900 9px Arial";g.textAlign="center";g.fillText(`XP ${Math.round(this.vsxEatenXp||0)}`,this.x,this.y-this.size-9)}
 else if(this.type==="mirror_husk"){g.strokeStyle="rgba(218,239,255,.65)";g.lineWidth=2;g.beginPath();g.arc(this.x,this.y,this.size+7,0,Math.PI*2);g.stroke();if(this.vsxMirrorStacks){g.fillStyle="#e6f4ff";g.font="900 9px Arial";g.textAlign="center";g.fillText(`RES ${this.vsxMirrorStacks}`,this.x,this.y-this.size-10)}}
 else if(this.type==="chrono_mine_layer"){g.strokeStyle="rgba(95,220,235,.62)";g.lineWidth=2;g.beginPath();g.arc(this.x,this.y,this.size+6,0,Math.PI*2);g.stroke()}
 else if(this.type==="swarm_mother"){g.strokeStyle="rgba(238,105,172,.55)";g.lineWidth=3;g.beginPath();g.arc(this.x,this.y,this.size+8+Math.sin(game.time*4)*2,0,Math.PI*2);g.stroke()}
 else if(this.type==="void_auditor"){g.globalAlpha=.08;g.fillStyle="#e4ca76";g.beginPath();g.arc(this.x,this.y,225,0,Math.PI*2);g.fill();g.globalAlpha=1;if(this.vsxAuditSource){g.fillStyle="#f4dd8a";g.font="900 8px Arial";g.textAlign="center";g.fillText(`AUDIT: ${e10SourceLabel(this.vsxAuditSource).slice(0,18)}`,this.x,this.y-this.size-10)}}
 g.restore()};

const E10_GAME_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){const r=E10_GAME_UPDATE_BASE.call(this,dt);if(this.state!=="PLAYING"||!this.player)return r;const edt=dt*(typeof VSX_ADMIN!=="undefined"?(VSX_ADMIN.speed||1):1);this.vsxEnemy10Objects||=[];this.vsxEnemy10Corpses||=[];for(const c of this.vsxEnemy10Corpses)c.life-=edt;this.vsxEnemy10Corpses=this.vsxEnemy10Corpses.filter(c=>c.life>0&&!c.claimed);for(const o of this.vsxEnemy10Objects)if(!o.dead)o.update(edt);this.vsxEnemy10Objects=this.vsxEnemy10Objects.filter(o=>!o.dead);return r};
const E10_GAME_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){const r=E10_GAME_RENDER_BASE.call(this);if(!this.player||this.state==="TITLE")return r;ctx.save();ctx.translate(-this.camera.x,-this.camera.y);for(const o of this.vsxEnemy10Objects||[])if(!o.dead)o.render(ctx);ctx.restore();return r};

const E10_SPAWN_BASE=SpawnManager.prototype.spawnOne;
SpawnManager.prototype.spawnOne=function(forceElite=false){const before=game.enemies.length;const r=E10_SPAWN_BASE.call(this,forceElite);for(let i=before;i<game.enemies.length;i++){const e=game.enemies[i];if(!e||e.dead)continue;if(e.type==="void_auditor"&&e10Alive("void_auditor").length>2)e.dead=true;if(e.type==="swarm_mother"&&e10Alive("swarm_mother").length>2)e.dead=true}return r};

const E10_CODEX_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){const rows=E10_CODEX_BASE.call(VSX,cat);if(cat!=="enemies")return rows;return rows.map(row=>{const m=E10_META[row[0]];if(!m)return row;const wave=m.wave;return[row[0],m.name[VSX.lang],`${m.desc[VSX.lang]} • ${VSX.lang==="vi"?"Xuất hiện từ Wave":"Appears from Wave"} ${wave}.`]})};

function e10AdminSpawn(id,count=1){if(!game.player||!ENEMY_DEFINITIONS[id])return false;for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,r=rand(520,240),e=vsxApplyDifficulty(new Enemy(id,game.player.x+Math.cos(a)*r,game.player.y+Math.sin(a)*r,game.difficulty,null));game.enemies.push(e)}return true}
function e10AdminL(en,vi){return VSX.lang==="vi"?vi:en}
function e10EnhanceAdminSpawn(){
 const admin=window.VSX_ADMIN;if(!admin||admin.tab!=="spawn")return;if(document.getElementById("vsxUnifiedEnemySpawner"))return;
 const sel=document.getElementById("admEnemy");if(sel)for(const o of sel.options){if(E10_META[o.value])o.textContent=e10Name(o.value)}
 const root=document.querySelector("#vsxAdminContent .vsxAdminGrid");if(!root||document.getElementById("vsxEnemy10AdminCard"))return;
 const card=document.createElement("div");card.className="vsxAdminCard";card.id="vsxEnemy10AdminCard";
 card.innerHTML=`<h3>${e10AdminL("NEW ENEMY QA","QA ENEMY MỚI")}</h3><div class="vsxEnemy10AdminGrid">${E10_IDS.map(id=>`<button data-e10-spawn="${id}">${VSX.esc(e10Name(id))} · W${E10_META[id].wave}</button>`).join("")}</div><div class="row" style="margin-top:8px"><button data-e10-all="1">${e10AdminL("SPAWN ALL 10","SPAWN CẢ 10")}</button></div><p class="vsxEnemy10SpawnMeta">${e10AdminL("Each button spawns a clean non-Elite specimen for mechanic/conflict testing.","Mỗi nút spawn một mẫu non-Elite sạch để test mechanic/conflict.")}</p>`;
 root.appendChild(card);card.querySelectorAll("[data-e10-spawn]").forEach(b=>b.onclick=()=>e10AdminSpawn(b.dataset.e10Spawn,1));const all=card.querySelector("[data-e10-all]");if(all)all.onclick=()=>E10_IDS.forEach(id=>e10AdminSpawn(id,1));
}
document.addEventListener("click",e=>{const t=e.target;if(t?.dataset?.adminTab==="spawn"||t?.id==="vsxAdminBtn"||t?.id==="vsxLangBtn"||(window.VSX_ADMIN?.open&&window.VSX_ADMIN?.tab==="spawn"))setTimeout(e10EnhanceAdminSpawn,0)});
document.addEventListener("keydown",e=>{if(e.code==="F10")setTimeout(e10EnhanceAdminSpawn,0)});

window.VSX_ENEMY10={ids:E10_IDS,meta:E10_META,spawn:e10AdminSpawn,objects:()=>game.vsxEnemy10Objects||[],selfTest:function(){const out={definitions:E10_IDS.every(id=>!!ENEMY_DEFINITIONS[id]),codex:E10_IDS.every(id=>VSX.codexEntries("enemies").some(r=>r[0]===id)),admin:!!window.VSX_ADMIN};return out}};
})();
