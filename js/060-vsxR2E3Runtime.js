(function(){
'use strict';
const DATA=window.VSX_R2E3_DATA;if(!DATA)return;
const IDS=DATA.ids,SET=new Set(IDS),ULT=DATA.ultimates,CORE=DATA.cores;
const L=(en,vi)=>window.VSX?.lang==='vi'?vi:en;
const esc=v=>window.VSX?.esc?VSX.esc(v):String(v??'');
const isMe=(g=game)=>!!g&&SET.has(g.characterId);
const ch=()=>CHARACTER_DEFINITIONS[game.characterId];
const weapon=()=>game.player?.weapons?.find(w=>w.id===ch()?.weapon)||null;
function newState(){return{core:0,surge:null,ult:null,probes:[],notes:[],counter:'',creases:[],foldPoints:[],cranes:0,history:[],mirages:[],deception:0,swapReady:false,applause:0,hitPositions:[],depth:0,depthLabel:'SURFACE',bell:null,lastHurt:-99,pressureMarks:new Map(),tick:0,renderTick:0,stormScanCd:0,stormPairCount:0}}
function st(g=game){if(!g)return null;g.vsxR2E3 ||= newState();return g.vsxR2E3}
function src(id,tags=[]){return{id,def:{tags}}}
function target(range=760){return game.findCluster?.(game.player.x,game.player.y,range)||game.findNearest?.(game.player.x,game.player.y,range)||null}
function addCore(n){const s=st();if(!isMe()||s.surge||game.characterId==='hadal_diver')return;s.core=Math.min(100,(s.core||0)+Math.max(0,n||0))}
function hostileNear(x,y,r){return (game.grid?.queryCircle?.(x,y,r)||[]).filter(e=>!e.dead&&!e.isCaptive)}
function strongest(n=5){const a=(game.enemies||[]).filter(e=>!e.dead&&!e.isCaptive);a.sort((a,b)=>(Number(b.isBoss)-Number(a.isBoss))*1e7+(Number(b.isMiniBoss)-Number(a.isMiniBoss))*1e6+(Number(b.elite)-Number(a.elite))*1e5+(b.maxHp||b.hp||0)-(a.maxHp||a.hp||0));return a.slice(0,n)}
function lineHit(x1,y1,x2,y2,damage,color='#dff5ff',knock=28,source=src('r2e3_line',['beam'])){game.beams.push({x1,y1,x2,y2,life:.17,color,width:3});const cx=(x1+x2)/2,cy=(y1+y2)/2,rad=Math.hypot(x2-x1,y2-y1)/2+28;for(const e of hostileNear(cx,cy,rad)){if(typeof pointSegDist==='function'&&pointSegDist(e.x,e.y,x1,y1,x2,y2)>(e.size||10)+10)continue;game.damageEnemy(e,damage,{source,canCrit:true,knockback:knock,fromX:cx,fromY:cy})}}
function pulse(x,y,r,damage,color,knock=55,source=src('r2e3_pulse',['area'])){try{game.effects.push(new WaveEffect(x,y,r,.42,damage,knock,source,color))}catch{game.explosion?.(x,y,r,damage,color,knock,source,false)}}
function pushHistory(){const s=st(),p=game.player;if(!p)return;s.history.push({x:p.x,y:p.y,t:game.time});while(s.history.length&&game.time-s.history[0].t>2.8)s.history.shift();if(s.history.length>24)s.history.shift()}
function historyAtAgo(sec){const s=st(),want=game.time-sec;let best=s.history[0]||{x:game.player.x,y:game.player.y};for(const h of s.history){if(Math.abs(h.t-want)<Math.abs(best.t-want))best=h}return{x:best.x,y:best.y}}
function segmentIntersection(a,b,c,d){const den=(a.x-b.x)*(c.y-d.y)-(a.y-b.y)*(c.x-d.x);if(Math.abs(den)<.001)return null;const x=((a.x*a.y?0:0));const t=((a.x-c.x)*(c.y-d.y)-(a.y-c.y)*(c.x-d.x))/den;const u=-((a.x-b.x)*(a.y-c.y)-(a.y-b.y)*(a.x-c.x))/den;if(t<=.06||t>=.94||u<=.06||u>=.94)return null;return{x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)}}

class StormProbeShot{
 constructor(x,y,tx,ty,w,s){this.x=x;this.y=y;const n=normalize(tx-x,ty-y);this.vx=n.x*s.speed;this.vy=n.y*s.speed;this.life=1.45;this.dead=false;this.w=w;this.s=s;this.r=5}
 update(dt){this.life-=dt;const ox=this.x,oy=this.y;this.x+=this.vx*dt;this.y+=this.vy*dt;let hit=null;for(const e of hostileNear(this.x,this.y,32)){if(Math.hypot(e.x-this.x,e.y-this.y)<(e.size||10)+this.r){hit=e;break}}if(hit){game.damageEnemy(hit,this.s.damage,{source:this.w,canCrit:true,knockback:this.s.knockback,fromX:ox,fromY:oy});this.drop(hit.x,hit.y);return}if(this.life<=0)this.drop(this.x,this.y)}
 drop(x,y){if(this.dead)return;this.dead=true;const s=st();const p={x,y,life:Math.max(5,this.s.duration||8),max:Math.max(5,this.s.duration||8),id:Math.random()};s.probes.push(p);while(s.probes.length>3)s.probes.shift();addCore(15);pulse(x,y,48,this.s.damage*.42,'rgba(111,221,255,.28)',25,this.w);rebuildFoldless()}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(game.time*5);g.fillStyle='#baf3ff';g.strokeStyle='#4cc9ff';g.lineWidth=2;g.beginPath();g.moveTo(8,0);g.lineTo(-5,5);g.lineTo(-5,-5);g.closePath();g.fill();g.stroke();g.restore()}
}
function rebuildFoldless(){}
class PaperBladeFx{
 constructor(x,y,a,w,s){this.x=x;this.y=y;this.sx=x;this.sy=y;this.vx=Math.cos(a)*s.speed;this.vy=Math.sin(a)*s.speed;this.life=1.35;this.dead=false;this.w=w;this.s=s;this.hit=new Set();this.teleported=new Set();this.r=Math.max(7,s.size||8)}
 update(dt){this.life-=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;const s=st();for(let i=0;i<s.foldPoints.length;i++){const f=s.foldPoints[i];if(this.teleported.has(i))continue;if(Math.hypot(this.x-f.x,this.y-f.y)<18&&s.foldPoints.length>1){const j=(i+1)%s.foldPoints.length,q=s.foldPoints[j];this.x=q.x;this.y=q.y;this.teleported.add(i);this.teleported.add(j);if(s.ult?.id==='thousand_cranes')s.cranes++;game.spark?.(q.x,q.y,'#fff4df',5);break}}for(const e of hostileNear(this.x,this.y,30)){if(this.hit.has(e.id)||Math.hypot(e.x-this.x,e.y-this.y)>(e.size||10)+this.r)continue;this.hit.add(e.id);game.damageEnemy(e,this.s.damage,{source:this.w,canCrit:true,knockback:this.s.knockback,fromX:this.sx,fromY:this.sy});if(this.hit.size>(this.s.pierce||2)){this.finish();return}}if(this.life<=0)this.finish()}
 finish(){if(this.dead)return;this.dead=true;addCrease({x:this.sx,y:this.sy},{x:this.x,y:this.y},this.w)}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(Math.atan2(this.vy,this.vx)+game.time*5);g.fillStyle='#fff4df';g.strokeStyle='#d9c7ae';g.lineWidth=1.5;g.beginPath();g.moveTo(10,0);g.lineTo(-8,6);g.lineTo(-4,0);g.lineTo(-8,-6);g.closePath();g.fill();g.stroke();g.restore()}
}
class MirageCardFx{
 constructor(x,y,a,w,s){this.x=x;this.y=y;this.vx=Math.cos(a)*s.speed;this.vy=Math.sin(a)*s.speed;this.life=1.2;this.dead=false;this.w=w;this.s=s;this.hit=new Set()}
 update(dt){this.life-=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;for(const e of hostileNear(this.x,this.y,30)){if(this.hit.has(e.id)||Math.hypot(e.x-this.x,e.y-this.y)>(e.size||10)+7)continue;this.hit.add(e.id);game.damageEnemy(e,this.s.damage,{source:this.w,canCrit:true,knockback:18,fromX:this.x-this.vx*.05,fromY:this.y-this.vy*.05});const h=historyAtAgo(1);spawnMirage(h.x,h.y,4.2,false);this.dead=true;return}if(this.life<=0){const h=historyAtAgo(1);spawnMirage(h.x,h.y,3.6,false);this.dead=true}}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(Math.atan2(this.vy,this.vx)+game.time*3);g.fillStyle='rgba(224,181,255,.82)';g.strokeStyle='#ffffff';g.lineWidth=1;g.fillRect(-7,-5,14,10);g.strokeRect(-7,-5,14,10);g.restore()}
}
class MirageFx{
 constructor(x,y,life=4,ult=false){this.x=x;this.y=y;this.life=this.max=life;this.dead=false;this.ult=ult;this.triggered=false}
 update(dt){this.life-=dt;for(const e of hostileNear(this.x,this.y,145)){if(e.isBoss||e.isMiniBoss)continue;const dx=this.x-e.x,dy=this.y-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*30*dt;e.y+=dy/d*30*dt;if(!this.triggered&&d<(e.size||12)+25){this.triggered=true;const s=st();s.deception=Math.min(4,(s.deception||0)+1);s.core=s.deception*25;if(s.deception>=4)s.swapReady=true;if(s.ult?.id==='grand_vanish'){s.applause++;s.hitPositions.push({x:this.x,y:this.y})}game.spark?.(this.x,this.y,'#d9a4ff',7);this.dead=true;break}}if(this.life<=0)this.dead=true}
 render(g){const a=Math.max(0,this.life/this.max);g.save();g.globalAlpha=.20+.34*a;g.translate(this.x,this.y);g.strokeStyle='#e3b8ff';g.fillStyle='rgba(155,98,213,.10)';g.lineWidth=2;g.beginPath();g.arc(0,0,game.player?.radius||13,0,Math.PI*2);g.fill();g.stroke();g.beginPath();g.moveTo(-8,0);g.lineTo(8,0);g.moveTo(0,-8);g.lineTo(0,8);g.stroke();g.restore()}
}
function spawnMirage(x,y,life=4,ult=false){const m=new MirageFx(x,y,life,ult);game.effects.push(m);st().mirages.push(m);return m}

function classify(e){if(!e)return'SWARM';if(e.isBoss)return'BOSS';if(e.isMiniBoss||e.elite)return'ELITE';const t=String(e.type||e.kind||e.name||'').toLowerCase();if(e.armor>1||e.maxHp>220||/tank|brute|golem|armou?r/.test(t))return'ARMORED';if(e.shootCool!==undefined||e.projectileSpeed||/shooter|ranged|gun|mage|sniper/.test(t))return'RANGED';return'SWARM'}
function addNote(cat){const s=st();if(s.notes.includes(cat))return;s.notes.push(cat);if(s.notes.length>3)s.notes.shift();s.core=Math.min(100,s.notes.length*34);if(s.notes.length>=3){s.core=100;startSurge('archivist')}}
function counterPage(){const s=st(),set=new Set(s.notes);if((set.has('ARMORED')||set.has('ELITE'))&&(set.has('BOSS')||set.has('ELITE')))return'BREACH';if(set.has('RANGED')&&set.has('SWARM'))return'SUPPRESSION';if(set.has('BOSS')&&set.has('SWARM'))return'CONTROL';if(set.has('RANGED'))return'SUPPRESSION';if(set.has('ARMORED')||set.has('ELITE')||set.has('BOSS'))return'BREACH';return'CONTROL'}
function doCounter(page,scale=1){const p=game.player,s=st();s.counter=page;if(page==='SUPPRESSION'){for(const q of game.enemyProjectiles||[])if(!q.dead&&Math.hypot(q.x-p.x,q.y-p.y)<320)q.dead=true;pulse(p.x,p.y,175,12*p.damageMultiplier*scale,'rgba(108,213,255,.26)',95,src('archivist_suppression',['area','control']))}else if(page==='BREACH'){for(const e of strongest(2)){game.damageEnemy(e,34*p.damageMultiplier*scale,{source:src('archivist_breach',['precision']),canCrit:true,knockback:20});e.applyStatus?.('vulnerable',1.5,.08,src('archivist_breach'))}}else{const t=target(650);if(t){pulse(t.x,t.y,110,20*p.damageMultiplier*scale,'rgba(226,199,143,.26)',115,src('archivist_control',['area','control']));for(const e of hostileNear(t.x,t.y,120))e.applyStatus?.('slow',.8,.35,src('archivist_control'))}}}

function addCrease(a,b,w){const s=st();const c={a:{...a},b:{...b},life:9,max:9};s.creases.push(c);while(s.creases.length>4)s.creases.shift();const pts=[];for(let i=0;i<s.creases.length;i++)for(let j=i+1;j<s.creases.length;j++){const x=segmentIntersection(s.creases[i].a,s.creases[i].b,s.creases[j].a,s.creases[j].b);if(x&&!pts.some(p=>Math.hypot(p.x-x.x,p.y-x.y)<18))pts.push(x)}s.foldPoints=pts.slice(0,4);s.core=Math.min(100,s.creases.length*20+s.foldPoints.length*20);if(s.core>=100)startSurge('origami_master')}
function unfold(){const p=game.player,s=st();for(const c of s.creases)lineHit(c.a.x,c.a.y,c.b.x,c.b.y,24*p.damageMultiplier,'#fff4df',65,src('origami_unfold',['beam','arcane']));pulse(p.x,p.y,125,12*p.damageMultiplier,'rgba(255,246,222,.20)',60,src('origami_unfold',['area']))}
function hadalPull(cx,cy,r,force){for(const e of hostileNear(cx,cy,r)){if(e.isBoss||e.isMiniBoss)continue;const dx=cx-e.x,dy=cy-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*force;e.y+=dy/d*force}}
function depthName(d){return d>=6000?'HADAL':d>=3000?'MIDNIGHT':d>=1500?'TWILIGHT':'SURFACE'}
function implodeAt(x,y,scale=1){const p=game.player;hadalPull(x,y,150,35*scale);pulse(x,y,130,28*p.damageMultiplier*scale,'rgba(74,166,216,.30)',-75,src('hadal_implosion',['area','water']))}

ATTACK_BEHAVIORS.r2e3TempestProbe=function(w,s){const t=target(720);if(!t)return;game.effects.push(new StormProbeShot(game.player.x,game.player.y,t.x,t.y,w,s))};
ATTACK_BEHAVIORS.r2e3IndexBolts=function(w,s){const t=target(s.range||820);if(!t)return;const a=Math.atan2(t.y-game.player.y,t.x-game.player.x);game.projectiles.push(new Projectile({x:game.player.x,y:game.player.y,vx:Math.cos(a)*s.speed,vy:Math.sin(a)*s.speed,radius:s.size,damage:s.damage,life:1.4,color:'#efd999',weapon:w,pierce:s.pierce,knockback:s.knockback}))};
ATTACK_BEHAVIORS.r2e3FoldedEdge=function(w,s){const t=target(s.range||760),a=t?Math.atan2(t.y-game.player.y,t.x-game.player.x):Math.atan2(game.lastMoveDir?.y||0,game.lastMoveDir?.x||1);game.effects.push(new PaperBladeFx(game.player.x,game.player.y,a,w,s))};
ATTACK_BEHAVIORS.r2e3MirageDeck=function(w,s){const t=target(s.range||760),a=t?Math.atan2(t.y-game.player.y,t.x-game.player.x):Math.atan2(game.lastMoveDir?.y||0,game.lastMoveDir?.x||1);game.effects.push(new MirageCardFx(game.player.x,game.player.y,a,w,s))};
ATTACK_BEHAVIORS.r2e3PressureLance=function(w,s){const t=target(s.range||800);if(!t)return;const a=Math.atan2(t.y-game.player.y,t.x-game.player.x),s0=st(),depth=s0.ult?.id==='hadal_descent'?Math.max(s0.depth,1000):s0.depth;game.projectiles.push(new Projectile({x:game.player.x,y:game.player.y,vx:Math.cos(a)*s.speed*(depth<1500?1.15:1),vy:Math.sin(a)*s.speed*(depth<1500?1.15:1),radius:s.size*(depth>=6000?1.25:1),damage:s.damage,life:1.45,color:depth>=6000?'#5ac4ff':'#a8e8ff',weapon:w,pierce:s.pierce+(depth>=3000?1:0),knockback:s.knockback}))};

function startSurge(id=game.characterId){const s=st();if(s.surge||!SET.has(id))return;s.core=id==='hadal_diver'?s.core:0;s.surge={id,time:id==='illusionist'?999:6,max:id==='illusionist'?999:6,tick:0};game.texts.push(new FloatingText(game.player.x,game.player.y-44,L('CORE SURGE','BÙNG NỔ CORE'),CORE[id].color,13));if(id==='archivist'){doCounter(counterPage(),1.15);s.notes=[];s.core=0;s.surge.time=1.1}else if(id==='origami_master'){unfold();s.surge.time=1.0}else if(id==='illusionist'){s.swapReady=true;s.surge.time=999}else if(id==='storm_chaser'){s.surge.tick=.1}}
function beginUlt(id){const u=ULT[id],s=st();game.ultimateCharge=0;game.ultimateActive=true;game.stats&&(game.stats.ultimates=(game.stats.ultimates||0)+1);s.ult={id,time:u.duration,max:u.duration,tick:0,phase:-1,stored:0,landfallDone:false,finished:false};game.vsxUltDurationTimer={id,mode:'timed',total:u.duration,remaining:u.duration,bound:null,synthetic:true};VSX.announce?.(L('Ultimate','Tuyệt Kỹ'),u.name[VSX.lang],'#8edfff');if(id==='thousand_cranes')s.cranes=0;if(id==='grand_vanish'){s.applause=0;s.hitPositions=[];for(let i=0;i<5;i++){const a=i*Math.PI*2/5;spawnMirage(game.player.x+Math.cos(a)*90,game.player.y+Math.sin(a)*90,u.duration,true)}}if(id==='hadal_descent'){if(!s.bell)s.bell={x:game.player.x-100,y:game.player.y};s.depth=Math.max(1000,s.depth)}}
function finishUlt(){const s=st(),u=s.ult;if(!u)return;if(u.id==='thousand_cranes'){const n=Math.min(30,Math.max(6,s.cranes));const list=strongest(6);for(let i=0;i<n;i++){const e=list[i%Math.max(1,list.length)];if(!e)break;const delay=i*.055;try{game.effects.push(new PulseDelayEffect(delay,()=>{if(!e.dead){game.damageEnemy(e,12*game.player.damageMultiplier,{source:src('thousand_cranes',['ultimate','arcane']),canCrit:true,knockback:14});game.spark(e.x,e.y,'#fff4df',4)}}))}catch{game.damageEnemy(e,12*game.player.damageMultiplier,{source:src('thousand_cranes',['ultimate','arcane']),canCrit:true})}}}else if(u.id==='grand_vanish'){const pts=[...s.hitPositions];for(const m of s.mirages)if(m&&!m.dead)pts.push({x:m.x,y:m.y});for(const q of pts.slice(0,16))pulse(q.x,q.y,72,(12+s.applause*1.2)*game.player.damageMultiplier,'rgba(215,156,255,.30)',55,src('curtain_call',['ultimate','area']))}else if(u.id==='hadal_descent'){const marked=[];for(const [eid,m] of s.pressureMarks){const e=(game.enemies||[]).find(x=>x.id===eid&&!x.dead);if(e)marked.push(e)}marked.sort((a,b)=>Math.hypot(a.x-game.player.x,a.y-game.player.y)-Math.hypot(b.x-game.player.x,b.y-game.player.y));for(const e of marked.slice(0,24))implodeAt(e.x,e.y,1.25);s.pressureMarks.clear();s.depth=2500}u.finished=true;game.ultimateActive=false;if(game.vsxUltDurationTimer?.id===u.id)game.vsxUltDurationTimer=null;s.ult=null;game.updateHUD?.(true)}

const ULT_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){const id=CHARACTER_DEFINITIONS[this.characterId]?.ultimate;if(!ULT[id])return ULT_BASE.apply(this,arguments);if(this.state!=='PLAYING'||this.ultimateCharge<100||this.ultimateActive)return;beginUlt(id)};

const DMG_BASE=Game.prototype.damageEnemy;
Game.prototype.damageEnemy=function(e,a,o={}){const id=this.characterId,sourceId=o?.source?.id||o?.source?.weapon?.id||o?.source?.def?.id;const r=DMG_BASE.call(this,e,a,o);if(!SET.has(id)||!e)return r;if(id==='storm_chaser'&&sourceId==='tempest_probe'){e.vsxStormChargedUntil=this.time+2.4;addCore(3)}if(id==='archivist'&&sourceId==='index_bolts'){addNote(classify(e));addCore(2)}if(id==='hadal_diver'&&sourceId==='pressure_lance'){const s=st(this),d=s.ult?.id==='hadal_descent'?Math.max(s.depth,1000):s.depth;if(d>=1500){const dx=this.player.x-e.x,dy=this.player.y-e.y,len=Math.hypot(dx,dy)||1;if(!e.isBoss&&!e.isMiniBoss){e.x+=dx/len*(d>=6000?28:14);e.y+=dy/len*(d>=6000?28:14)}}if(d>=3000){s.pressureMarks.set(e.id,{until:this.time+4});e.vsxPressureMarkUntil=this.time+4}if(d>=6000)implodeAt(e.x,e.y,.55)}return r};

const HURT_BASE=Player.prototype.takeDamage;
Player.prototype.takeDamage=function(amount,info){if(game?.characterId==='hadal_diver')st(game).lastHurt=game.time||0;return HURT_BASE.apply(this,arguments)};

const DASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){const routed=window.VSX_ARCH?.runHandled?.('dash.before',{game:this,args:[...arguments]});if(routed?.handled)return routed.value;const id=this.characterId,s=st(this),before=this.stats?.dashes||0;if(id==='illusionist'&&s.swapReady){const live=s.mirages.filter(m=>m&&!m.dead);if(live.length){live.sort((a,b)=>Math.hypot(a.x-this.player.x,a.y-this.player.y)-Math.hypot(b.x-this.player.x,b.y-this.player.y));const m=live[0],old={x:this.player.x,y:this.player.y};const r=DASH_BASE.apply(this,arguments);if((this.stats?.dashes||0)>before){const nx=this.player.x,ny=this.player.y;this.player.x=m.x;this.player.y=m.y;m.x=nx;m.y=ny;s.deception=0;s.core=0;s.swapReady=false;s.surge=null;this.spark?.(old.x,old.y,'#d9a4ff',8);this.spark?.(this.player.x,this.player.y,'#ffffff',8);if(s.ult?.id==='grand_vanish'){for(const mm of live){const a=Math.random()*Math.PI*2,rn=70+Math.random()*55;mm.x=this.player.x+Math.cos(a)*rn;mm.y=this.player.y+Math.sin(a)*rn}}}return r}}const r=DASH_BASE.apply(this,arguments);if(id==='illusionist'&&s.ult?.id==='grand_vanish'&&(this.stats?.dashes||0)>before){for(const m of s.mirages.filter(x=>x&&!x.dead)){const a=Math.random()*Math.PI*2,rn=70+Math.random()*55;m.x=this.player.x+Math.cos(a)*rn;m.y=this.player.y+Math.sin(a)*rn}}return r};

function updateStorm(dt){
 const s=st();
 for(const p of s.probes)p.life-=dt;
 s.probes=s.probes.filter(p=>p.life>0);
 // Surge lifetime must not depend on having three probes alive; otherwise it can become permanent.
 if(s.surge?.id==='storm_chaser'){
   s.surge.time-=dt;
   if(s.surge.time<=0)s.surge=null;
 }
 // Storm-front collision scans are throttled. Continuous full-grid scans were a major frame-time spike.
 s.stormScanCd=(s.stormScanCd||0)-dt;
 if(s.probes.length>=2 && s.stormScanCd<=0){
   s.stormScanCd=.10;
   let pairs=0;
   for(let i=0;i<s.probes.length;i++)for(let j=i+1;j<s.probes.length;j++){
     const a=s.probes[i],b=s.probes[j],dist=Math.hypot(a.x-b.x,a.y-b.y);
     // Extremely long links are decorative only; skip expensive collision scans across most of the arena.
     if(dist>560)continue;
     pairs++;
     const cx=(a.x+b.x)/2,cy=(a.y+b.y)/2,rad=dist/2+30;
     for(const e of hostileNear(cx,cy,rad)){
       if(e.vsxStormChargedUntil>game.time&&typeof pointSegDist==='function'&&pointSegDist(e.x,e.y,a.x,a.y,b.x,b.y)<(e.size||10)+10){
         if(!e.vsxStormFrontHit||e.vsxStormFrontHit<game.time){
           e.vsxStormFrontHit=game.time+.5;
           game.damageEnemy(e,5*game.player.damageMultiplier,{source:src('storm_front',['electric','control']),canCrit:false});
           e.applyStatus?.('slow',.4,.18,src('storm_front'));
         }
       }
     }
   }
   s.stormPairCount=pairs;
 }
 if(s.probes.length>=3){
   addCore(dt*8);
   if(s.surge?.id==='storm_chaser'){
     s.surge.tick-=dt;
     if(s.surge.tick<=0){
       s.surge.tick=.52;
       const a=s.probes[0],b=s.probes[1],c=s.probes[2],cx=(a.x+b.x+c.x)/3,cy=(a.y+b.y+c.y)/3,e=game.findNearest(cx,cy,220);
       if(e){
         game.lightning.push({pts:[{x:cx,y:cy},{x:e.x,y:e.y}],life:.18,max:.18,color:'#baf4ff'});
         game.damageEnemy(e,18*game.player.damageMultiplier,{source:src('pressure_cell',['electric','area']),canCrit:true});
       }
     }
   }
 }
 if(!s.surge&&s.core>=100)startSurge('storm_chaser');
}
function updateArchivist(dt){const s=st();if(s.surge){s.surge.time-=dt;if(s.surge.time<=0)s.surge=null}if(s.ult?.id==='open_archive'){s.ult.tick-=dt;if(s.ult.tick<=0){s.ult.tick=.72;const e=strongest(1)[0],cat=classify(e);const page=cat==='RANGED'?'SUPPRESSION':(['ARMORED','ELITE','BOSS'].includes(cat)?'BREACH':'CONTROL');doCounter(page,1.0)}}}
function updateOrigami(dt){const s=st();for(const c of s.creases)c.life-=dt;s.creases=s.creases.filter(c=>c.life>0);if(s.surge){s.surge.time-=dt;if(s.surge.time<=0)s.surge=null}}
function updateIllusion(dt){const s=st();s.mirages=s.mirages.filter(m=>m&&!m.dead);if(s.swapReady&&s.mirages.length===0&&!s.ult){s.swapReady=false;s.surge=null;s.deception=Math.min(3,s.deception);s.core=s.deception*25}else if(s.swapReady)s.core=100;else s.core=s.deception*25}
function updateHadal(dt){const s=st(),p=game.player;if(!s.bell)s.bell={x:p.x-100,y:p.y};const near=hostileNear(p.x,p.y,220).length;const bellD=Math.hypot(p.x-s.bell.x,p.y-s.bell.y);if(s.ult?.id!=='hadal_descent'){if(near>0&&game.time-s.lastHurt>1.0&&bellD<340)s.depth=Math.min(6000,s.depth+dt*(near>=5?640:420));else s.depth=Math.max(0,s.depth-dt*(bellD>360?900:260));s.bell.x+=(p.x-s.bell.x)*dt*.22;s.bell.y+=(p.y-s.bell.y)*dt*.22}else{const prog=1-Math.max(0,s.ult.time)/s.ult.max;s.depth=1000+8000*prog;if(s.ult.time<1.4){p.x+=(s.bell.x-p.x)*dt*.85;p.y+=(s.bell.y-p.y)*dt*.85}}s.depthLabel=depthName(s.depth);s.core=Math.min(100,s.depth/60);for(const [id,m] of [...s.pressureMarks])if(m.until<game.time)s.pressureMarks.delete(id)}
function updateUlt(dt){
 const s=st(),u=s.ult;if(!u||u.finished)return;
 u.time-=dt;
 if(game.vsxUltDurationTimer)game.vsxUltDurationTimer.remaining=Math.max(0,u.time);
 if(u.id==='eye_of_the_storm'){
   u.tick-=dt;
   if(u.tick<=0){
     u.tick=.28;
     const p=game.player,r=150,phase=(u.max-u.time)*1.5;
     for(let i=0;i<3;i++){
       const a=phase+i*Math.PI*2/3,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r,e=game.findNearest(x,y,110);
       if(e){
         game.lightning.push({pts:[{x,y},{x:e.x,y:e.y}],life:.15,max:.15,color:'#bff7ff'});
         game.damageEnemy(e,12*p.damageMultiplier,{source:src('eye_of_storm',['ultimate','electric']),canCrit:true});
       }
     }
     for(const e of hostileNear(p.x,p.y,135)){
       if(e.isBoss||e.isMiniBoss)continue;
       const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*2.5;e.y+=dy/d*2.5;
     }
   }
   if(u.time<=.25&&!u.landfallDone){
     u.landfallDone=true;
     pulse(game.player.x,game.player.y,190,38*game.player.damageMultiplier,'rgba(121,222,255,.34)',-95,src('landfall',['ultimate','area']));
   }
 }
 if(u.time<=0)finishUlt();
}

const UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){const r=UPDATE_BASE.apply(this,arguments);if(!isMe(this)||!this.player)return r;pushHistory();if(this.characterId==='storm_chaser')updateStorm(dt);else if(this.characterId==='archivist')updateArchivist(dt);else if(this.characterId==='origami_master')updateOrigami(dt);else if(this.characterId==='illusionist')updateIllusion(dt);else if(this.characterId==='hadal_diver')updateHadal(dt);updateUlt(dt);return r};

const INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){const r=INIT_BASE.apply(this,arguments);this.vsxR2E3=newState();if(this.player){const s=st(this);s.lastHurt=-99;s.bell={x:this.player.x-105,y:this.player.y}}return r};

const RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){const r=RENDER_BASE.apply(this,arguments);if(!isMe(this)||!this.player||this.state==='TITLE')return r;const s=st(this),g=(typeof ctx!=='undefined'?ctx:window.ctx);if(!g)return r;g.save();g.translate(-this.camera.x,-this.camera.y);if(this.characterId==='storm_chaser'){g.lineWidth=2;for(let i=0;i<s.probes.length;i++){const p=s.probes[i];g.save();g.translate(p.x,p.y);g.globalAlpha=.72;g.fillStyle='#7ee8ff';g.shadowBlur=12;g.shadowColor='#59d7ff';g.beginPath();g.arc(0,0,6,0,Math.PI*2);g.fill();g.restore();for(let j=i+1;j<s.probes.length;j++){const q=s.probes[j];g.globalAlpha=.25;g.strokeStyle='#8eeaff';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}}if(s.probes.length===3){const [a,b,c]=s.probes;g.globalAlpha=(s.surge?.id==='storm_chaser')?.13:.05;g.fillStyle='#67d9ff';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.lineTo(c.x,c.y);g.closePath();g.fill()}}else if(this.characterId==='origami_master'){for(const c of s.creases){g.globalAlpha=.28*Math.max(0,c.life/c.max);g.strokeStyle='#fff4df';g.lineWidth=2;g.beginPath();g.moveTo(c.a.x,c.a.y);g.lineTo(c.b.x,c.b.y);g.stroke()}for(const p of s.foldPoints){g.globalAlpha=.70;g.fillStyle='#fff6e3';g.beginPath();g.arc(p.x,p.y,5,0,Math.PI*2);g.fill()}}else if(this.characterId==='hadal_diver'&&s.bell){g.globalAlpha=.30;g.strokeStyle='#75c7e8';g.setLineDash([6,7]);g.beginPath();g.moveTo(this.player.x,this.player.y);g.lineTo(s.bell.x,s.bell.y);g.stroke();g.setLineDash([]);g.globalAlpha=.55;g.fillStyle='#4d8197';g.beginPath();g.arc(s.bell.x,s.bell.y,9,0,Math.PI*2);g.fill()}g.restore();return r};

function ensureHud(){const a=document.getElementById('vsxActionHud');if(!a)return null;let h=document.getElementById('vsxR2E3Hud');if(!h){h=document.createElement('div');h.id='vsxR2E3Hud';h.innerHTML='<div class="scHead"><span id="r2e3CoreName">CORE</span><b id="r2e3CoreValue">0%</b></div><div class="scMeta"><span id="r2e3CoreType">—</span><span id="r2e3CoreState">—</span><span id="r2e3CoreDetail">—</span></div><div class="scBar"><i id="r2e3CoreFill"></i></div>';a.appendChild(h)}return h}
function renderHud(){const h=ensureHud();if(!h)return;if(!isMe()||game.state!=='PLAYING'){h.classList.remove('active','surge','link');return}const s=st(),id=game.characterId,c=CORE[id],u=ULT[ch().ultimate],pct=id==='hadal_diver'?Math.round(Math.min(100,s.depth/60)):Math.round(s.core||0);const surge=!!s.surge,ultOn=!!s.ult,link=ultOn&&!surge;let detail='—';if(id==='storm_chaser')detail=s.probes.length>=3?L('PRESSURE CELL READY','ÁP SUẤT SẴN'):`${L('PROBES','TRỤ')} ${s.probes.length}/3`;if(id==='archivist')detail=s.notes.length?`${L('NOTES','GHI CHÉP')} ${s.notes.length}/3 · ${s.notes.join(' / ')}`:`${L('NOTES','GHI CHÉP')} 0/3`;if(id==='origami_master')detail=`${L('CREASE','NẾP')} ${s.creases.length}/4 · ${L('FOLD','GẤP')} ${s.foldPoints.length}`;if(id==='illusionist')detail=s.swapReady?L('SWAP READY','HOÁN VỊ SẴN'):`${L('DECEPTION','ĐÁNH LỪA')} ${s.deception}/4`;if(id==='hadal_diver')detail=`${Math.round(s.depth)}m · ${s.depthLabel}`;const state=surge?L('CORE SURGE','BÙNG NỔ LÕI'):ultOn?`${esc(u.name[VSX.lang])} · ${Math.max(0,s.ult.time).toFixed(1)}s`:(pct>=100?L('READY','SẴN SÀNG'):L('CHARGING','ĐANG TÍCH'));h.classList.add('active');h.classList.toggle('surge',surge);h.classList.toggle('link',!surge&&link);h.style.setProperty('--sc',c.color);const nm=h.querySelector('#r2e3CoreName'),val=h.querySelector('#r2e3CoreValue'),ty=h.querySelector('#r2e3CoreType'),stt=h.querySelector('#r2e3CoreState'),dt=h.querySelector('#r2e3CoreDetail'),fill=h.querySelector('#r2e3CoreFill');if(nm)nm.textContent=esc(c.name[VSX.lang]);if(val)val.textContent=surge?L('SURGE','BÙNG NỔ'):ultOn?`${Math.max(0,s.ult.time).toFixed(1)}s`:`${pct}%`;if(ty)ty.textContent=`${ch().rarity.toUpperCase()} · ${esc(c.tag[VSX.lang])}`;if(stt)stt.textContent=state;if(dt)dt.textContent=detail;if(fill)fill.style.width=`${surge?100:pct}%`}
const HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(){const r=HUD_BASE.apply(this,arguments);renderHud();return r};

function decorateShop(){for(const id of IDS){const card=document.querySelector(`#vsxUnifiedSurvivorShop [data-store-character="${id}"]`);if(!card)continue;const c=CORE[id],u=ULT[CHARACTER_DEFINITIONS[id].ultimate];let n=card.querySelector('.r2e3ShopInfo');if(!n){n=document.createElement('div');n.className='r2e3ShopInfo';const desc=card.querySelector('.vsxUnifiedSurvivorDesc');(desc||card).insertAdjacentElement(desc?'afterend':'beforeend',n)}n.style.setProperty('--core',c.color);n.innerHTML=`<b>${esc(L('SIGNATURE CORE','LÕI ĐẶC TRƯNG'))} · ${esc(c.name[VSX.lang])}</b><span>${esc(c.tag[VSX.lang])}</span><small>${esc(L('ULTIMATE','TUYỆT KỸ'))} · ${esc(u.name[VSX.lang])}</small>`}}
function decorateSetup(){for(const card of document.querySelectorAll('#vsxCharacterGrid .vsxPick')){const id=card.dataset.characterId;if(!SET.has(id))continue;card.querySelectorAll(':scope > .r2e3PickInfo').forEach(x=>x.remove());const c=CORE[id],u=ULT[CHARACTER_DEFINITIONS[id].ultimate],n=document.createElement('div');n.className='r2e3PickInfo';n.innerHTML=`<b>${esc(c.name[VSX.lang])}</b><span>${esc(c.tag[VSX.lang])}</span><small>${esc(L('ULT','ULT'))}: ${esc(u.name[VSX.lang])}</small>`;card.appendChild(n)}}
function decorateCodex(){const list=document.getElementById('vsxCodexList');if(!list)return;for(const id of IDS){const name=CHARACTER_DEFINITIONS[id].name[VSX.lang];let card=list.querySelector(`.vsxCharacterCodexCard[data-codex-id="${id}"]`);if(!card)card=[...list.querySelectorAll('.vsxCodexItem')].find(x=>(x.querySelector('b')?.textContent||'')===name);if(!card)continue;let n=card.querySelector('.r2e3Codex');if(!n){n=document.createElement('div');n.className='r2e3Codex';card.appendChild(n)}const c=CORE[id],u=ULT[CHARACTER_DEFINITIONS[id].ultimate];n.innerHTML=`<b>${esc(L('SIGNATURE CORE','LÕI ĐẶC TRƯNG'))} · ${esc(c.name[VSX.lang])}</b><div class="r2e3CodexGrid"><span><strong>${esc(L('BUILD','TÍCH'))}</strong>${esc(c.charge[VSX.lang])}</span><span><strong>${esc(L('SURGE','BÙNG NỔ'))}</strong>${esc(c.surge[VSX.lang])}</span><span><strong>${esc(L('ULT LINK','LIÊN KẾT ULT'))}</strong>${esc(c.link[VSX.lang])}</span></div><small><b>${esc(u.name[VSX.lang])}</b> — ${esc(u.how[VSX.lang])}</small>`}}

const ARM_BASE=window.renderArmory;if(typeof ARM_BASE==='function')window.renderArmory=function(){const r=ARM_BASE.apply(this,arguments);queueMicrotask(()=>{decorateShop();polishArmory();polishSkins()});return r};
const SETUP_BASE=VSX.renderSetup;VSX.renderSetup=function(){const r=SETUP_BASE.apply(this,arguments);queueMicrotask(()=>{decorateSetup();polishPicker();window.VSX_CHARACTER_PICK_FILTER?.apply?.()});return r};
const CODEX_BASE=VSX.renderCodex;VSX.renderCodex=function(cat){const r=CODEX_BASE.apply(this,arguments);if(cat==='characters')queueMicrotask(decorateCodex);return r};

function unlock(id){VSX.save.meta||={};VSX.save.meta.unlockedCharacters||={};VSX.save.meta.unlockedWeapons||={};VSX.save.meta.survivorStoreOwned||={};VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[CHARACTER_DEFINITIONS[id].weapon]=true;VSX.save.meta.survivorStoreOwned[id]=true;try{vsxDiscover?.('characters',id);vsxDiscover?.('weapons',CHARACTER_DEFINITIONS[id].weapon);vsxSave?.()}catch{}}
function closeAdmin(){if(VSX_ADMIN?.closePanel)VSX_ADMIN.closePanel();else document.getElementById('vsxAdminScreen')?.classList.remove('active')}
function injectAdmin(){const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||!VSX_ADMIN?.open||!['run','player','loadout','meta','collection'].includes(VSX_ADMIN.tab)||document.getElementById('vsxAdminR2E3Card'))return;const c=document.createElement('div');c.id='vsxAdminR2E3Card';c.className='vsxAdminCard';c.innerHTML=`<h3>${L('2 RARE + 3 EPIC · QA','2 RARE + 3 EPIC · QA')}</h3><p>${L('Storm Chaser · Archivist · Origami Master · Illusionist · Hadal Diver','Kẻ Săn Bão · Người Lưu Trữ · Bậc Thầy Origami · Ảo Thuật Gia · Thợ Lặn Vực Sâu')}</p><select id="admR2E3Select">${IDS.map(id=>`<option value="${id}">${esc(CHARACTER_DEFINITIONS[id].name[VSX.lang])} · ${CHARACTER_DEFINITIONS[id].rarity.toUpperCase()}</option>`).join('')}</select><div class="r2e3AdminBtns"><button id="admR2E3Unlock">${L('UNLOCK + NEXT','MỞ KHÓA + TRẬN SAU')}</button><button id="admR2E3All">${L('UNLOCK ALL 5','MỞ KHÓA CẢ 5')}</button><button id="admR2E3Weapon">${L('ADD WEAPON','THÊM VŨ KHÍ')}</button><button id="admR2E3Core">${L('MAX CORE','MAX CORE')}</button><button id="admR2E3Ult">${L('LIVE TEST ULT','TEST ULT NGAY')}</button><button id="admR2E3QA">${L('RUN QA','CHẠY QA')}</button></div><pre id="admR2E3Out"></pre>`;grid.appendChild(c);const sel=()=>c.querySelector('#admR2E3Select').value,out=c.querySelector('#admR2E3Out');c.querySelector('#admR2E3Unlock').onclick=()=>{const id=sel();unlock(id);VSX.selectedCharacter=id;out.textContent=L('Unlocked + selected.','Đã mở khóa + chọn trận sau.');VSX.renderSetup?.()};c.querySelector('#admR2E3All').onclick=()=>{IDS.forEach(unlock);out.textContent='5 / 5 UNLOCKED';VSX.renderSetup?.()};c.querySelector('#admR2E3Weapon').onclick=()=>{if(!game.player)return out.textContent=L('Start a run first.','Hãy vào trận trước.');const id=sel(),wid=CHARACTER_DEFINITIONS[id].weapon;game.characterId=id;unlock(id);if(!game.player.weapons.some(w=>w.id===wid)){if(game.player.weapons.length>=game.player.weaponSlots)game.player.weapons.shift();game.player.addWeapon(wid)}out.textContent=weaponName(wid);game.updateHUD?.(true)};c.querySelector('#admR2E3Core').onclick=()=>{if(!game.player)return out.textContent=L('Start a run first.','Hãy vào trận trước.');const id=sel();game.characterId=id;unlock(id);game.vsxR2E3=newState();const s=st();if(id==='hadal_diver'){s.depth=6000;s.core=100}else if(id==='illusionist'){s.deception=4;s.core=100;startSurge(id)}else{s.core=100;startSurge(id)}out.textContent='CORE 100%';game.updateHUD?.(true)};c.querySelector('#admR2E3Ult').onclick=()=>{if(!game.player)return out.textContent=L('Start a run first.','Hãy vào trận trước.');const id=sel(),wid=CHARACTER_DEFINITIONS[id].weapon;unlock(id);closeAdmin();setTimeout(()=>{game.characterId=id;VSX.selectedCharacter=id;if(!game.player.weapons.some(w=>w.id===wid)){if(game.player.weapons.length>=game.player.weaponSlots)game.player.weapons.shift();game.player.addWeapon(wid)}game.vsxR2E3=newState();game.ultimateActive=false;game.ultimateCharge=100;game.useUltimate();game.updateHUD?.(true)},0)};c.querySelector('#admR2E3QA').onclick=()=>{out.textContent=JSON.stringify(window.VSX_R2E3.selfTest(),null,2)}}
if(window.VSX_ADMIN){const OP=VSX_ADMIN.openPanel;if(typeof OP==='function')VSX_ADMIN.openPanel=function(){const r=OP.apply(this,arguments);queueMicrotask(injectAdmin);return r};const host=document.getElementById('vsxAdminContent');if(host)new MutationObserver(()=>{if(VSX_ADMIN.open)queueMicrotask(injectAdmin)}).observe(host,{childList:true,subtree:false})}

/* Bundle effects: default OFF after acquisition. Manual toggles still work afterward. */
const BUNDLE_IDS=['football_legends_vol1','dc_crisis_protocol','goat_rivals_cr7_m10','n10_last_samba_bundle','rm_royal_three_bundle'];
function keepNewBundleFxOff(){VSX.save.meta||={};VSX.save.meta.packageEffects||={};for(const id of BUNDLE_IDS)if(VSX.save.meta.packageEffects[id]===undefined)VSX.save.meta.packageEffects[id]=false;try{vsxSave?.()}catch{}}
keepNewBundleFxOff();
let pkgBefore={};document.addEventListener('pointerdown',()=>{pkgBefore={...(VSX.save?.meta?.packages||{})}},{capture:true});document.addEventListener('click',e=>{const el=e.target.closest?.('button');if(!el)return;setTimeout(()=>{const packs=VSX.save?.meta?.packages||{},fx=VSX.save?.meta?.packageEffects||{};let changed=false;for(const [id,val] of Object.entries(packs)){if(val&&!pkgBefore[id]&&fx[id]!==false){fx[id]=false;changed=true}}if(changed)vsxSave?.()},0)},{capture:true});

function skinLine(id,d){const vi=VSX.lang==='vi',name=d.name?.[VSX.lang]||id,e=String(d.effect||'').toLowerCase();if(id==='r9_brazil_2002')return vi?'Áo Brazil 2002 vàng–xanh, số 9 nổi bật, kéo theo vệt tăng tốc vàng-xanh như một pha bứt phá của R9.':'Brazil 2002 yellow-and-green No.9 kit with a gold-green acceleration trail built around R9’s explosive runs.';if(id==='pele_brazil_1970')return vi?'Áo Brazil 1970 vàng–xanh cổ điển, hoàn thiện bằng quầng vương miện vàng tinh gọn quanh Pelé.':'Classic Brazil 1970 yellow-green kit finished with a restrained golden crown aura around Pelé.';if(id==='r10_barcelona_10')return vi?'Bộ Barcelona số 10 xanh-đỏ đậm, kèm neon Samba cong mềm theo những pha đảo hướng của Ronaldinho.':'Deep blue-and-red Barcelona No.10 look with a curved Samba-neon accent that follows Ronaldinho’s changes of direction.';if(id==='cr7_portugal_7')return vi?'Áo Bồ Đào Nha đỏ-vàng số 7, viền sáng sắc và trail dứt khoát để CR7 trông như đang lao vào pha kết thúc.':'Portugal red-and-gold No.7 kit with crisp highlights and a decisive finishing trail.';if(id==='m10_argentina_10')return vi?'Áo Argentina xanh trời–trắng số 10, quầng xanh lam-trắng mềm và sạch để tôn các đường bóng cong của Messi.':'Argentina sky-blue-and-white No.10 kit with a clean blue-white halo tuned to Messi’s curved-ball visuals.';if(e.includes('samba')||e.includes('brazil'))return vi?`${name}: phối xanh lá–vàng–xanh dương kiểu Brazil, glow mềm và trail gọn để vẫn rõ chiến trường.`:`${name}: Brazil-inspired green-gold-blue treatment with soft glow and a compact combat-readable trail.`;if(e.includes('royal')||e.includes('bernabeu'))return vi?`${name}: nền trắng ngọc trai kiểu hoàng gia, điểm màu đội tuyển và viền sân vận động rất nhẹ.`:`${name}: pearl-white royal base, national accent detailing and a restrained stadium-light edge.`;if(e.includes('dc')||d.packageId==='dc_crisis_protocol')return vi?`${name}: silhouette siêu anh hùng đậm hơn, phối hai tông đặc trưng và glow nhận diện theo nhân vật.`:`${name}: stronger superhero silhouette with character-specific two-tone detailing and signature glow.`;const tier=String(d.tier||'standard');return vi?`${name}: phối màu nhận diện rõ hơn, silhouette ${tier} sắc nét và một lớp glow nhỏ bám theo chuyển động.`:`${name}: clearer signature palette, sharper ${tier} silhouette and a small movement-linked glow.`}
function polishSkins(){const grid=document.getElementById('vsxSkinGrid');if(!grid)return;const ids=Object.keys(SKIN_DEFINITIONS);[...grid.children].forEach((card,i)=>{const d=SKIN_DEFINITIONS[ids[i]],p=card.querySelector(':scope > p');if(d&&p)p.textContent=skinLine(ids[i],d)})}
function polishPicker(){const tools=document.getElementById('vsxCharacterPickTools'),sel=document.getElementById('vsxCharacterPickRarity');if(sel){const current=sel.value,counts={all:0};document.querySelectorAll('#vsxCharacterGrid .vsxPick').forEach(c=>{const r=c.dataset.rarity||'common';counts.all++;counts[r]=(counts[r]||0)+1});[...sel.options].forEach(o=>{const k=o.value,base=k==='all'?L('ALL RARITIES','TẤT CẢ ĐỘ HIẾM'):k.toUpperCase();o.textContent=`${base} · ${counts[k]||0}`});sel.value=current}if(tools&&!document.getElementById('vsxPickStartHint')){const h=document.createElement('span');h.id='vsxPickStartHint';h.textContent=L('ENTER = START','ENTER = VÀO TRẬN');tools.appendChild(h)}}
function polishArmory(){const panel=document.querySelector('#vsxArmoryScreen .panel');if(panel)panel.classList.add('r2e3ArmoryCompact')}

/* Reliable Setup hotkey: SETUP is represented by the active screen, not game.state. */
document.addEventListener('keydown',e=>{const setup=document.getElementById('vsxSetupScreen');if(!setup?.classList.contains('active'))return;if(e.key==='Enter'){e.preventDefault();e.stopPropagation();document.getElementById('vsxBeginBtn')?.click();return}if(e.code==='Space'&&!['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName)){e.preventDefault();e.stopPropagation();document.getElementById('vsxBeginBtn')?.click()}},{capture:true});

function uiSelfTest(){const errs=[];for(const id of IDS){const d=CHARACTER_DEFINITIONS[id];if(!d)errs.push(`${id}:character`);if(!WEAPON_DEFINITIONS[d?.weapon])errs.push(`${id}:weapon`);if(!ULT[d?.ultimate])errs.push(`${id}:ultimate`);if(typeof ATTACK_BEHAVIORS[WEAPON_DEFINITIONS[d?.weapon]?.behavior]!=='function')errs.push(`${id}:behavior`)}const setup=document.getElementById('vsxSetupScreen'),tools=document.getElementById('vsxCharacterPickTools');return{ok:!errs.length,errors:errs,characters:IDS.length,shopCards:IDS.filter(id=>document.querySelector(`[data-store-character="${id}"]`)).length,pickCards:IDS.filter(id=>document.querySelector(`#vsxCharacterGrid [data-character-id="${id}"]`)).length,rarityDropdown:!!document.getElementById('vsxCharacterPickRarity'),beginButton:!!document.getElementById('vsxBeginBtn'),backButton:!!document.getElementById('vsxSetupBack'),tools:!!tools,setupActive:!!setup?.classList.contains('active')}}
window.VSX_R2E3={ids:[...IDS],ultimates:ULT,cores:CORE,state:()=>st(),unlock,unlockAll:()=>IDS.forEach(unlock),selfTest:uiSelfTest,refresh(){decorateShop();decorateSetup();decorateCodex();polishPicker();polishArmory();polishSkins();renderHud()}};
for(const id of IDS){try{window.VSX_ULT_DURATION_API?.register?.(CHARACTER_DEFINITIONS[id].ultimate,{seconds:ULT[CHARACTER_DEFINITIONS[id].ultimate].duration})}catch{}}
queueMicrotask(()=>window.VSX_R2E3.refresh());
})();
