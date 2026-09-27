(function(){
'use strict';
const TAG='[VSX ECHO+FRAGMENTS+MUTATION B01]';
const L=(en,vi)=>(typeof VSX!=='undefined'&&VSX.lang==='vi')?vi:en;

/* =========================================================
   ALLY FRAGMENT WINDOW — 30s hard timeout for collection stage
   ========================================================= */
const FRAG_WINDOW=30;
function fragSession(g){return g?.vsxFragmentSession||null}
function startFrag(g,id){g.vsxFragmentSession={id,started:g.time||0,deadline:(g.time||0)+FRAG_WINDOW};return g.vsxFragmentSession}
function fragRemain(g){const s=fragSession(g);return s?Math.max(0,Math.ceil(s.deadline-(g.time||0))):0}
function cleanupBastion(g,announce=true){
 g.recruitObjects=(g.recruitObjects||[]).filter(o=>o.type!=='omega_core');g.omegaCores=0;g.activeRecruitChallenge=null;g.allySpawned||={};g.allyNextTry||={};g.allySpawned.bastion=false;g.allyNextTry.bastion=(g.time||0)+80;g.vsxFragmentSession=null;
 if(announce)VSX.announce(t('recruitment'),L('OMEGA SIGNAL LOST — TRY AGAIN LATER','TÍN HIỆU OMEGA ĐÃ MẤT — HÃY THỬ LẠI SAU'),'#ff9b71')
}
const FRAG_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){const r=FRAG_INIT_BASE.apply(this,arguments);this.vsxFragmentSession=null;this.allySpawned||={};this.allyNextTry||={};this.allySpawned.bastion=false;this.allyNextTry.bastion=0;return r};

const FRAG_SPAWN_BASE=Game.prototype.spawnRecruitChallenge;
Game.prototype.spawnRecruitChallenge=function(id){const ok=FRAG_SPAWN_BASE.apply(this,arguments);if(!ok)return ok;if(id==='chrono'){this.chronoDeadline=this.time+FRAG_WINDOW;for(const o of this.recruitObjects||[])if(o.type==='chrono_fragment'&&!o.dead)o.life=Math.min(o.life,FRAG_WINDOW);startFrag(this,'chrono')}else if(id==='seraph'){for(const o of this.recruitObjects||[])if(o.type==='seraph_seal'&&!o.dead)o.life=Math.min(o.life,FRAG_WINDOW);startFrag(this,'seraph')}else if(id==='rook'){for(const o of this.recruitObjects||[])if(['war_module','rook_supply'].includes(o.type)&&!o.dead)o.life=Math.min(o.life,FRAG_WINDOW);startFrag(this,'rook')}return ok};

const FRAG_DIRECTOR_BASE=Game.prototype.updateRecruitDirector;
Game.prototype.updateRecruitDirector=function(dt){
 const r=FRAG_DIRECTOR_BASE.apply(this,arguments);if(!this.player||this.state!=='PLAYING')return r;
 // Bastion's original cores were passive drops. The first visible core now opens a proper 30s encounter slot.
 if(!this.storyAllyMap?.has('bastion')&&!this.vsxFragmentSession&&(this.omegaCores>0||(this.recruitObjects||[]).some(o=>!o.dead&&o.type==='omega_core'))){this.activeRecruitChallenge='bastion_fragments';this.allySpawned.bastion=true;startFrag(this,'bastion')}
 const s=this.vsxFragmentSession;if(!s)return r;
 const collecting=(s.id==='chrono'&&this.activeRecruitChallenge==='chrono'&&this.chronoCollected<3)||(s.id==='seraph'&&this.activeRecruitChallenge==='seraph'&&(this.seraphSeals||0)<3)||(s.id==='rook'&&this.activeRecruitChallenge==='rook'&&(this.rookModules||0)<3)||(s.id==='bastion'&&this.activeRecruitChallenge==='bastion_fragments'&&(this.omegaCores||0)<3);
 if(!collecting){this.vsxFragmentSession=null;return r}
 if(this.time>=s.deadline){
   if(s.id==='bastion')cleanupBastion(this,true);else{const id=s.id;this.vsxFragmentSession=null;this.failRecruitChallenge(id);VSX.announce(t('recruitment'),L('FRAGMENT SIGNAL EXPIRED — TRY AGAIN LATER','TÍN HIỆU MẢNH ĐÃ HẾT — HÃY THỬ LẠI SAU'),'#ff9b71')}
 }
 return r
};

// Bastion completion clears the claimed encounter slot/session.
const FRAG_RECRUIT_BASE=Game.prototype.recruitAlly;
Game.prototype.recruitAlly=function(id){const a=FRAG_RECRUIT_BASE.apply(this,arguments);if(id==='bastion'&&a){this.vsxFragmentSession=null;if(this.activeRecruitChallenge==='bastion_fragments')this.activeRecruitChallenge=null}return a};

// Make the objective line explicit and always show the fragment countdown while collecting.
const FRAG_OBJ_BASE=currentRecruitObjective;
currentRecruitObjective=function(g){
 const s=fragSession(g),rem=s?fragRemain(g):30;
 if(g.activeRecruitChallenge==='chrono')return `${L('COLLECT TIME SHARDS','NHẶT MẢNH THỜI GIAN')} ${g.chronoCollected||0}/3 • ${rem}s`;
 if(g.activeRecruitChallenge==='seraph'&&(g.seraphSeals||0)<3)return `${L('COLLECT RADIANT SEALS','NHẶT THÁNH ẤN')} ${g.seraphSeals||0}/3 • ${rem}s`;
 if(g.activeRecruitChallenge==='rook'&&(g.rookModules||0)<3)return `${L('COLLECT WAR MODULES','NHẶT MÔ-ĐUN CHIẾN TRẬN')} ${g.rookModules||0}/3 • ${rem}s`;
 if(g.activeRecruitChallenge==='bastion_fragments')return `${L('COLLECT OMEGA CORES','NHẶT LÕI OMEGA')} ${g.omegaCores||0}/3 • ${rem}s`;
 return FRAG_OBJ_BASE(g)
};

/* Mobile compact objective: old fragment allies use the same 30s authority. */
const FRAG_HUD_BASE=renderStoryAllyHud;
renderStoryAllyHud=function(g){const r=FRAG_HUD_BASE.apply(this,arguments),s=fragSession(g),m=document.getElementById('vsxNovelRecruitMobile');if(m&&s&&['chrono','seraph','rook','bastion'].includes(s.id)){m.textContent=currentRecruitObjective(g);m.classList.toggle('active',innerWidth<=760)}return r};

/* =========================================================
   MUTATION V2 — BATCH 01 / 10 CORE WEAPONS / 3 bespoke choices each
   ========================================================= */
const B01=['pulse_blaster','scatter_cannon','orbital_blades','flamethrower','lightning_arc','rocket_launcher','frost_shards','razor_boomerang','laser_beam','gravity_orb'];
const M={
 pulse_blaster:[
  {id:'pulse_blaster__overdrive_matrix',name:{en:'OVERDRIVE MATRIX',vi:'MA TRẬN QUÁ TỐC'},desc:{en:'Extreme fire cadence. Every 5th attack fans four extra pulse bolts around the locked target.',vi:'Nhịp bắn cực nhanh. Mỗi đòn thứ 5 tỏa thêm 4 tia xung quanh mục tiêu khóa.'},mods:{damageMul:1.18,cooldownMul:.62,speedMul:1.20,pierceAdd:1}},
  {id:'pulse_blaster__ion_lance',name:{en:'ION LANCE',vi:'THƯƠNG ION'},desc:{en:'Heavy piercing pulse core. Every 3rd attack launches an oversized ion lance through the line.',vi:'Lõi xung xuyên phá hạng nặng. Mỗi đòn thứ 3 phóng một Thương Ion cỡ lớn xuyên tuyến.'},mods:{damageMul:2.05,sizeMul:1.42,pierceAdd:4,cooldownMul:1.12}},
  {id:'pulse_blaster__nova_reactor',name:{en:'NOVA REACTOR',vi:'LÒ PHẢN ỨNG NOVA'},desc:{en:'High-output pulses. Every 4th attack detonates an 8-way radial pulse nova around the survivor.',vi:'Xung năng lượng công suất cao. Mỗi đòn thứ 4 bung Nova 8 hướng quanh người chơi.'},mods:{damageMul:1.48,cooldownMul:.82,speedMul:1.12}}
 ],
 scatter_cannon:[
  {id:'scatter_cannon__breach_slug',name:{en:'BREACH SLUG',vi:'ĐẠN PHÁ GIÁP'},desc:{en:'Tighter, heavier buckshot plus a central armor-breaking slug on every volley.',vi:'Chùm đạn hẹp và nặng hơn, kèm một viên phá giáp ở tâm mỗi loạt.'},mods:{damageMul:1.70,countAdd:-1,spreadMul:.68,pierceAdd:2,sizeMul:1.18}},
  {id:'scatter_cannon__pellet_storm',name:{en:'PELLET STORM',vi:'BÃO HẠT ĐẠN'},desc:{en:'Massive pellet count and faster cycling. Every 4th volley erupts in a 12-way 360° storm.',vi:'Tăng mạnh số hạt và tốc độ bắn. Mỗi loạt thứ 4 bùng 12 hướng 360°.'},mods:{damageMul:1.05,countAdd:5,cooldownMul:.72,spreadMul:1.18}},
  {id:'scatter_cannon__dragon_breath',name:{en:"DRAGON'S BREATH",vi:'HƠI THỞ RỒNG'},desc:{en:'Incendiary pellets ignite targets with a stronger burn while retaining close-range burst damage.',vi:'Hạt đạn cháy đốt mục tiêu bằng Burn mạnh hơn nhưng vẫn giữ burst cự ly gần.'},mods:{damageMul:1.32,cooldownMul:.88,speedMul:1.10}}
 ],
 orbital_blades:[
  {id:'orbital_blades__razor_halo',name:{en:'RAZOR HALO',vi:'HÀO QUANG LƯỠI CẮT'},desc:{en:'Six-blade high-speed halo. Periodically emits a cutting ring from the current orbit.',vi:'Hào quang nhiều lưỡi tốc độ cao. Định kỳ phóng vòng cắt từ quỹ đạo hiện tại.'},mods:{damageMul:1.45,countAdd:3,orbitSpeedMul:1.55,orbitRadiusMul:1.08}},
  {id:'orbital_blades__execution_ring',name:{en:'EXECUTION RING',vi:'VÒNG KẾT LIỄU'},desc:{en:'Fewer but enormous blades. Periodic execution pulses punish wounded enemies inside the ring.',vi:'Ít lưỡi hơn nhưng cực lớn. Xung kết liễu định kỳ trừng phạt địch đang yếu trong vòng.'},mods:{damageMul:1.75,countAdd:1,sizeMul:1.35,orbitSpeedMul:.92}},
  {id:'orbital_blades__vortex_crown',name:{en:'VORTEX CROWN',vi:'VƯƠNG MIỆN XOÁY'},desc:{en:'Expanded blade crown constantly drags nearby enemies inward and detonates a pull pulse every few seconds.',vi:'Vương miện lưỡi mở rộng kéo địch vào trong và định kỳ nổ xung hút.'},mods:{damageMul:1.35,countAdd:2,orbitRadiusMul:1.35,orbitSpeedMul:1.25}}
 ],
 flamethrower:[
  {id:'flamethrower__blue_inferno',name:{en:'BLUE INFERNO',vi:'HỎA NGỤC XANH'},desc:{en:'Blue flame deals much higher direct damage and applies a longer, stronger burn.',vi:'Lửa xanh tăng mạnh sát thương trực tiếp và gây Burn mạnh, lâu hơn.'},mods:{damageMul:1.65,cooldownMul:.78,durationMul:1.35}},
  {id:'flamethrower__napalm_sea',name:{en:'NAPALM SEA',vi:'BIỂN NAPALM'},desc:{en:'Wider flames. Every 8th burst leaves a persistent napalm pool under the densest enemy cluster.',vi:'Lửa phủ rộng hơn. Mỗi burst thứ 8 để lại vũng Napalm dưới cụm địch đông nhất.'},mods:{damageMul:1.40,spreadMul:1.25,durationMul:1.25,cooldownMul:.85}},
  {id:'flamethrower__backdraft',name:{en:'BACKDRAFT ENGINE',vi:'ĐỘNG CƠ PHẢN HỎA'},desc:{en:'High-pressure flame. Every 6th burst triggers a violent backdraft explosion in the target cluster.',vi:'Lửa áp suất cao. Mỗi burst thứ 6 kích nổ Backdraft dữ dội trong cụm mục tiêu.'},mods:{damageMul:1.55,cooldownMul:.92,speedMul:1.15}}
 ],
 lightning_arc:[
  {id:'lightning_arc__tesla_web',name:{en:'TESLA WEB',vi:'LƯỚI TESLA'},desc:{en:'Chains through far more targets. Every 3rd cast ends in an electric area discharge.',vi:'Sét chuyền qua nhiều mục tiêu hơn. Mỗi lần thứ 3 kết thúc bằng xả điện diện rộng.'},mods:{damageMul:1.45,chainAdd:5,cooldownMul:.78}},
  {id:'lightning_arc__thunder_crown',name:{en:'THUNDER CROWN',vi:'VƯƠNG MIỆN SẤM'},desc:{en:'Heavy chain damage. Every 4th cast calls five bonus strikes onto nearby priority targets.',vi:'Sát thương chuyền nặng. Mỗi lần thứ 4 gọi thêm 5 tia sét vào mục tiêu ưu tiên.'},mods:{damageMul:1.70,chainAdd:2,cooldownMul:.90}},
  {id:'lightning_arc__static_prison',name:{en:'STATIC PRISON',vi:'NHÀ TÙ TĨNH ĐIỆN'},desc:{en:'Fast chain lightning creates a brief control field that heavily slows enemies around the first target.',vi:'Sét chuyền nhanh tạo vùng tĩnh điện làm chậm mạnh địch quanh mục tiêu đầu.'},mods:{damageMul:1.35,chainAdd:3,cooldownMul:.82}}
 ],
 rocket_launcher:[
  {id:'rocket_launcher__mirv',name:{en:'MIRV SALVO',vi:'LOẠT MIRV'},desc:{en:'Every launch splits into a three-rocket fan for heavy overlapping explosions.',vi:'Mỗi lần phóng tách thành quạt 3 rocket tạo vùng nổ chồng lấp.'},mods:{damageMul:1.35,cooldownMul:.88,areaMul:1.20}},
  {id:'rocket_launcher__thermobaric',name:{en:'THERMOBARIC WARHEAD',vi:'ĐẦU ĐẠN NHIỆT ÁP'},desc:{en:'Slower colossal warheads with huge blast area. Every 3rd shot leaves a delayed secondary detonation.',vi:'Đầu đạn khổng lồ chậm hơn với vùng nổ rất lớn. Mỗi phát thứ 3 có vụ nổ thứ cấp trễ.'},mods:{damageMul:1.85,areaMul:1.55,sizeMul:1.25,cooldownMul:1.15}},
  {id:'rocket_launcher__hunter_killer',name:{en:'HUNTER-KILLER',vi:'SĂN-DIỆT'},desc:{en:'Fast homing rockets aggressively track targets and retarget when their victim dies.',vi:'Rocket tự dẫn tốc cao khóa mục tiêu mạnh và tự đổi mục tiêu khi nạn nhân chết.'},mods:{damageMul:1.55,cooldownMul:.82,speedMul:1.25}}
 ],
 frost_shards:[
  {id:'frost_shards__absolute_zero',name:{en:'ABSOLUTE ZERO',vi:'ĐỘ KHÔNG TUYỆT ĐỐI'},desc:{en:'Stronger piercing ice. Every 5th cast releases a freezing wave around the survivor.',vi:'Băng xuyên mạnh hơn. Mỗi lần thứ 5 phát sóng đóng băng quanh người chơi.'},mods:{damageMul:1.50,countAdd:1,pierceAdd:2,cooldownMul:.82}},
  {id:'frost_shards__splinterstorm',name:{en:'SPLINTERSTORM',vi:'BÃO MẢNH BĂNG'},desc:{en:'Large shard volleys. Every 4th cast explodes into ten radial splinters.',vi:'Loạt mảnh băng lớn. Mỗi lần thứ 4 nổ thành 10 mảnh tỏa tròn.'},mods:{damageMul:1.35,countAdd:3,cooldownMul:.75}},
  {id:'frost_shards__cryo_rail',name:{en:'CRYO RAIL',vi:'ĐƯỜNG BĂNG XUYÊN'},desc:{en:'Fewer but massive rail shards with extreme pierce and impact damage.',vi:'Ít mảnh hơn nhưng khổng lồ, xuyên cực mạnh và sát thương va chạm rất cao.'},mods:{damageMul:1.90,sizeMul:1.60,pierceAdd:5,cooldownMul:1.12}}
 ],
 razor_boomerang:[
  {id:'razor_boomerang__twin_return',name:{en:'TWIN RETURN',vi:'SONG HỒI'},desc:{en:'Multiple faster boomerangs overlap outbound and return paths for repeated cuts.',vi:'Nhiều boomerang nhanh chồng đường bay đi và về để cắt liên tục.'},mods:{damageMul:1.40,countAdd:2,cooldownMul:.82,durationMul:1.20}},
  {id:'razor_boomerang__guillotine',name:{en:'GUILLOTINE DISC',vi:'ĐĨA ĐOẠN ĐẦU'},desc:{en:'A gigantic high-pierce execution disc with extreme impact damage.',vi:'Đĩa kết liễu khổng lồ xuyên nhiều mục tiêu với sát thương va chạm cực cao.'},mods:{damageMul:2.00,sizeMul:1.65,pierceAdd:5,cooldownMul:1.15}},
  {id:'razor_boomerang__razor_echo',name:{en:'RAZOR ECHO',vi:'VỌNG ẢNH LƯỠI CẮT'},desc:{en:'Fast returning blades leave a delayed echo volley behind every attack.',vi:'Lưỡi hồi nhanh để lại một loạt vọng ảnh trễ sau mỗi đòn.'},mods:{damageMul:1.55,countAdd:1,cooldownMul:.78}}
 ],
 laser_beam:[
  {id:'laser_beam__prism_array',name:{en:'PRISM ARRAY',vi:'MẢNG LĂNG KÍNH'},desc:{en:'Main laser is flanked by two parallel prism beams that damage separate lanes.',vi:'Laser chính có thêm hai tia lăng kính song song gây sát thương ở ba lane.'},mods:{damageMul:1.50,cooldownMul:.72,rangeMul:1.20}},
  {id:'laser_beam__overheat_ray',name:{en:'OVERHEAT RAY',vi:'TIA QUÁ NHIỆT'},desc:{en:'High-energy beam builds heat; every 8th firing detonates a huge thermal burst on the target line.',vi:'Tia năng lượng cao tích nhiệt; mỗi lần bắn thứ 8 nổ burst nhiệt lớn trên tuyến mục tiêu.'},mods:{damageMul:1.65,cooldownMul:.82,rangeMul:1.12}},
  {id:'laser_beam__singularity_beam',name:{en:'SINGULARITY BEAM',vi:'TIA KỲ DỊ'},desc:{en:'Long beam drags enemies toward its axis while dealing extra gravity damage.',vi:'Tia dài kéo địch về trục beam đồng thời gây thêm sát thương trọng lực.'},mods:{damageMul:1.40,cooldownMul:.85,rangeMul:1.30}}
 ],
 gravity_orb:[
  {id:'gravity_orb__black_hole_core',name:{en:'BLACK-HOLE CORE',vi:'LÕI HỐ ĐEN'},desc:{en:'Massive long-lived gravity core with much stronger pull radius and collapse damage.',vi:'Lõi trọng lực lớn tồn tại lâu, vùng hút rộng và sát thương co sập mạnh hơn.'},mods:{damageMul:1.55,areaMul:1.55,durationMul:1.50,cooldownMul:.90}},
  {id:'gravity_orb__trinary_orbit',name:{en:'TRINARY ORBIT',vi:'QUỸ ĐẠO TAM THỂ'},desc:{en:'Each cast launches three smaller gravity cores in a fan to control multiple lanes.',vi:'Mỗi lần bắn phóng ba lõi trọng lực nhỏ theo hình quạt để khống chế nhiều lane.'},mods:{damageMul:1.35,areaMul:1.15,cooldownMul:.80}},
  {id:'gravity_orb__collapse_engine',name:{en:'COLLAPSE ENGINE',vi:'ĐỘNG CƠ CO SẬP'},desc:{en:'Extremely heavy gravity cores. Every 3rd cast schedules a devastating secondary collapse.',vi:'Lõi trọng lực cực nặng. Mỗi lần thứ 3 tạo một vụ co sập thứ cấp hủy diệt.'},mods:{damageMul:1.90,areaMul:1.30,cooldownMul:1.05,sizeMul:1.20}}
 ]
};
for(const id of B01)WEAPON_MUTATIONS[id]=M[id];

function nearest(range=720){return game.findCluster(game.player.x,game.player.y,range)||game.findNearest(game.player.x,game.player.y,range)}
function fireProj(w,s,a,damageMul=.7,opts={}){const sp=(opts.speed||s.speed)*(opts.speedMul||1);game.projectiles.push(new Projectile({x:game.player.x,y:game.player.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,radius:(opts.size||s.size),damage:s.damage*damageMul,life:opts.life||1.6,pierce:opts.pierce??s.pierce,color:opts.color||'#8beaff',weapon:w,knockback:opts.knockback??s.knockback,status:opts.status||null,behavior:opts.behavior,target:opts.target,homingStrength:opts.homingStrength,retargetOnKill:opts.retargetOnKill,retargets:opts.retargets,explosionRadius:opts.explosionRadius||0}))}
function radial(w,s,count,mul,color){for(let i=0;i<count;i++)fireProj(w,s,i*Math.PI*2/count,mul,{color,pierce:Math.max(0,s.pierce)})}
function aimAngle(range=720){const t=nearest(range);return t?Math.atan2(t.y-game.player.y,t.x-game.player.x):0}
function tick(w,key){w._vsxMutTick??={};return ++w._vsxMutTick[key]}

// Pulse Blaster
const B_SINGLE=ATTACK_BEHAVIORS.singleProjectile;
ATTACK_BEHAVIORS.singleProjectile=function(w,s){B_SINGLE(w,s);if(w.id!=='pulse_blaster')return;const id=w.mutationId,n=tick(w,'b01');const a=aimAngle();if(id==='pulse_blaster__overdrive_matrix'&&n%5===0){for(const off of [-.28,-.14,.14,.28])fireProj(w,s,a+off,.75,{color:'#72f2ff',pierce:s.pierce})}else if(id==='pulse_blaster__ion_lance'&&n%3===0)fireProj(w,s,a,1.35,{color:'#c9fbff',size:s.size*1.9,pierce:s.pierce+5,speedMul:1.18,knockback:s.knockback*1.6});else if(id==='pulse_blaster__nova_reactor'&&n%4===0)radial(w,s,8,.72,'#73d8ff')};

// Scatter Cannon
const B_SPREAD=ATTACK_BEHAVIORS.spread;
ATTACK_BEHAVIORS.spread=function(w,s){const before=game.projectiles.length;B_SPREAD(w,s);if(w.id!=='scatter_cannon')return;const id=w.mutationId,n=tick(w,'b01'),a=aimAngle(600);if(id==='scatter_cannon__breach_slug')fireProj(w,s,a,2.10,{color:'#fff0a0',size:s.size*1.5,pierce:s.pierce+4,speedMul:1.08,knockback:70});else if(id==='scatter_cannon__pellet_storm'&&n%4===0)radial(w,s,12,.55,'#ffd76d');else if(id==='scatter_cannon__dragon_breath'){for(let i=before;i<game.projectiles.length;i++){const p=game.projectiles[i];if(p.weapon===w){p.status={type:'burn',duration:3.4,strength:5.5};p.color='#ff7540'}}}};

// Orbital Blades
const B_ORBIT=WeaponInstance.prototype.updateOrbit;
WeaponInstance.prototype.updateOrbit=function(dt){B_ORBIT.call(this,dt);if(this.id!=='orbital_blades'||!this.mutationId)return;const s=this.getStats(),id=this.mutationId;this._b01OrbitCd=(this._b01OrbitCd||0)-dt;if(id==='orbital_blades__vortex_crown'){for(const e of game.grid.queryCircle(game.player.x,game.player.y,s.orbitRadius*1.55)){if(e.dead||e.isBoss)continue;const n=normalize(game.player.x-e.x,game.player.y-e.y);e.x+=n.x*34*dt;e.y+=n.y*34*dt}}if(this._b01OrbitCd<=0){this._b01OrbitCd=id==='orbital_blades__razor_halo'?1.6:id==='orbital_blades__execution_ring'?1.45:2.2;if(id==='orbital_blades__razor_halo')game.effects.push(new WaveEffect(game.player.x,game.player.y,s.orbitRadius*1.18,.42,s.damage*.68,20,this,'#dce9ff'));else if(id==='orbital_blades__execution_ring'){for(const e of game.grid.queryCircle(game.player.x,game.player.y,s.orbitRadius*1.25)){if(e.dead)continue;const missing=1-e.hp/Math.max(1,e.maxHp);game.damageEnemy(e,s.damage*(.55+missing*1.1),{source:this,canCrit:true,damageType:'physical'})}}else game.effects.push(new WaveEffect(game.player.x,game.player.y,s.orbitRadius*1.5,.52,s.damage*.55,-45,this,'#a8cfff'))}};

// Flamethrower
const B_FLAME=ATTACK_BEHAVIORS.flamethrower;
ATTACK_BEHAVIORS.flamethrower=function(w,s){const before=game.projectiles.length;B_FLAME(w,s);if(w.id!=='flamethrower')return;const id=w.mutationId,n=tick(w,'b01');if(id==='flamethrower__blue_inferno'){for(let i=before;i<game.projectiles.length;i++){const p=game.projectiles[i];if(p.weapon===w){p.color='#59bfff';p.status={type:'burn',duration:3.8,strength:6.2}}}}else if(id==='flamethrower__napalm_sea'&&n%8===0){const t=nearest(520);if(t)game.effects.push(new AreaEffect({x:t.x,y:t.y,radius:105*game.player.areaMultiplier,life:3.0,damage:s.damage*.58,tick:.35,color:'rgba(255,102,44,.26)',weapon:w,status:{type:'burn',duration:2.8,strength:4.8}}))}else if(id==='flamethrower__backdraft'&&n%6===0){const t=nearest(500);if(t)game.explosion(t.x,t.y,95*game.player.areaMultiplier,s.damage*1.45,'#ff7a35',70,w,false)}};

// Lightning Arc
const B_CHAIN=ATTACK_BEHAVIORS.chain;
ATTACK_BEHAVIORS.chain=function(w,s){B_CHAIN(w,s);if(w.id!=='lightning_arc')return;const id=w.mutationId,n=tick(w,'b01'),t=nearest(s.range);if(!t)return;if(id==='lightning_arc__tesla_web'&&n%3===0)game.explosion(t.x,t.y,105,s.damage*.85,'#fff17a',0,w,false);else if(id==='lightning_arc__thunder_crown'&&n%4===0){const list=game.nearestList(t.x,t.y,360,5);for(const e of list){game.lightning.push({pts:[{x:t.x,y:t.y},{x:e.x,y:e.y}],life:.13,max:.13,color:'#fff7a8'});game.damageEnemy(e,s.damage*.80,{source:w,canCrit:true,damageType:'electric'})}}else if(id==='lightning_arc__static_prison'){for(const e of game.grid.queryCircle(t.x,t.y,125))if(!e.dead)e.applyStatus('slow',1.25,.72,w)}};

// Rocket Launcher
const B_ROCKET=ATTACK_BEHAVIORS.explosiveProjectile;
ATTACK_BEHAVIORS.explosiveProjectile=function(w,s){const before=game.projectiles.length;B_ROCKET(w,s);if(w.id!=='rocket_launcher')return;const id=w.mutationId,n=tick(w,'b01'),a=aimAngle();if(id==='rocket_launcher__mirv'){for(const off of [-.18,.18])fireProj(w,s,a+off,.68,{color:'#ffad5c',explosionRadius:s.explosionRadius*.82,knockback:s.knockback*.75})}else if(id==='rocket_launcher__thermobaric'&&n%3===0){const t=nearest(700);if(t)game.vsxScheduleTask?.(.48,()=>{if(game.state==='PLAYING')game.explosion(t.x,t.y,s.explosionRadius*1.2,s.damage*1.45,'#ff7b42',s.knockback,w,false)},'mutation.thermobaric')}else if(id==='rocket_launcher__hunter_killer'){for(let i=before;i<game.projectiles.length;i++){const p=game.projectiles[i];if(p.weapon===w){const t=nearest(850);p.behavior='homing';p.homingStrength=2.6;p.target=t;p.retargetOnKill=true;p.retargets=2}}}};

// Frost Shards
const B_FROST=ATTACK_BEHAVIORS.frost;
ATTACK_BEHAVIORS.frost=function(w,s){const before=game.projectiles.length;B_FROST(w,s);if(w.id!=='frost_shards')return;const id=w.mutationId,n=tick(w,'b01'),a=aimAngle();if(id==='frost_shards__absolute_zero'){for(let i=before;i<game.projectiles.length;i++){const p=game.projectiles[i];if(p.weapon===w)p.status={type:'slow',duration:3.2,strength:.58}}if(n%5===0){for(const e of game.grid.queryCircle(game.player.x,game.player.y,220)){if(!e.dead)e.applyStatus('freeze',e.isBoss?.55:1.25,1,w)}game.effects.push(new WaveEffect(game.player.x,game.player.y,220,.55,s.damage*.40,0,w,'#9defff'))}}else if(id==='frost_shards__splinterstorm'&&n%4===0)radial(w,s,10,.52,'#a8efff');else if(id==='frost_shards__cryo_rail')fireProj(w,s,a,1.10,{color:'#d8faff',size:s.size*1.25,pierce:s.pierce+4,speedMul:1.12})};

// Razor Boomerang
const B_BOOM=ATTACK_BEHAVIORS.boomerang;
ATTACK_BEHAVIORS.boomerang=function(w,s){B_BOOM(w,s);if(w.id!=='razor_boomerang')return;const id=w.mutationId,n=tick(w,'b01'),a=aimAngle();if(id==='razor_boomerang__guillotine')game.projectiles.push(new Projectile({x:game.player.x,y:game.player.y,vx:Math.cos(a)*s.speed*.86,vy:Math.sin(a)*s.speed*.86,radius:s.size*1.25,damage:s.damage*1.25,life:s.duration*1.15,maxLife:s.duration*1.15,color:'#ffffff',weapon:w,pierce:s.pierce+4,behavior:'boomerang',returnPulse:true}));else if(id==='razor_boomerang__razor_echo'){game.vsxScheduleTask?.(.26,()=>{if(game.state!=='PLAYING')return;for(const off of [-.12,.12])game.projectiles.push(new Projectile({x:game.player.x,y:game.player.y,vx:Math.cos(a+off)*s.speed,vy:Math.sin(a+off)*s.speed,radius:s.size*.82,damage:s.damage*.55,life:s.duration,maxLife:s.duration,color:'#b9dfff',weapon:w,pierce:s.pierce,behavior:'boomerang'}))},'mutation.razorEcho')}};

// Laser Beam helpers
function beamDamage(w,s,ox,oy,angle,mul,color,width){const p={x:game.player.x+ox,y:game.player.y+oy},end={x:p.x+Math.cos(angle)*s.range,y:p.y+Math.sin(angle)*s.range};game.beams.push({x1:p.x,y1:p.y,x2:end.x,y2:end.y,life:.10,color,width});for(const e of game.grid.queryCircle((p.x+end.x)/2,(p.y+end.y)/2,s.range*.55+50)){if(e.dead)continue;if(pointSegDist(e.x,e.y,p.x,p.y,end.x,end.y)<e.size+s.size)game.damageEnemy(e,s.damage*mul,{source:w,canCrit:true,damageType:'arcane'})}}
const B_BEAM=ATTACK_BEHAVIORS.beam;
ATTACK_BEHAVIORS.beam=function(w,s){B_BEAM(w,s);if(w.id!=='laser_beam')return;const id=w.mutationId,n=tick(w,'b01'),t=nearest(s.range);if(!t)return;const a=Math.atan2(t.y-game.player.y,t.x-game.player.x);if(id==='laser_beam__prism_array'){const nx=-Math.sin(a),ny=Math.cos(a);beamDamage(w,s,nx*18,ny*18,a,.55,'#8feaff',2.5);beamDamage(w,s,-nx*18,-ny*18,a,.55,'#d5a8ff',2.5)}else if(id==='laser_beam__overheat_ray'&&n%8===0)game.explosion(t.x,t.y,92,s.damage*2.20,'#ff6bd6',35,w,false);else if(id==='laser_beam__singularity_beam'){for(const e of game.grid.queryCircle((game.player.x+t.x)/2,(game.player.y+t.y)/2,s.range*.60)){if(e.dead||e.isBoss)continue;if(pointSegDist(e.x,e.y,game.player.x,game.player.y,game.player.x+Math.cos(a)*s.range,game.player.y+Math.sin(a)*s.range)<95){const to=normalize(game.player.x-e.x,game.player.y-e.y);e.x+=to.x*12;e.y+=to.y*12;game.damageEnemy(e,s.damage*.28,{source:w,canCrit:false,damageType:'arcane',silent:true})}}}};

// Gravity Orb
const B_GRAV=ATTACK_BEHAVIORS.gravityOrb;
ATTACK_BEHAVIORS.gravityOrb=function(w,s){B_GRAV(w,s);if(w.id!=='gravity_orb')return;const id=w.mutationId,n=tick(w,'b01'),a=aimAngle();if(id==='gravity_orb__trinary_orbit'){for(const off of [-.24,.24])fireProj(w,s,a+off,.72,{color:'#af7cff',size:s.size*.82,life:s.duration*.88,behavior:'gravity',explosionRadius:s.explosionRadius*.78,knockback:s.knockback,pierce:0})}else if(id==='gravity_orb__collapse_engine'&&n%3===0){const t=nearest(700);if(t)game.vsxScheduleTask?.(.62,()=>{if(game.state==='PLAYING')game.explosion(t.x,t.y,s.area*1.15,s.damage*1.85,'#a06bff',-70,w,false)},'mutation.gravityCollapse')}};

// Make Collection/Admin explicitly expose Batch 01 status.
const MUT_CX_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){return MUT_CX_BASE.call(this,cat)};
function selfTest(){const detail={};for(const id of B01)detail[id]={choices:(WEAPON_MUTATIONS[id]||[]).length,ids:(WEAPON_MUTATIONS[id]||[]).map(x=>x.id)};return{batch:'01',weapons:B01.length,allThree:B01.every(id=>(WEAPON_MUTATIONS[id]||[]).length===3),detail,fragmentWindow:FRAG_WINDOW,fragmentSession:game?.vsxFragmentSession||null,echoRelay:'simplified pink->cyan relay'}}
/* Mutation V3 is the sole Admin + Collection authority. Batch-01 keeps only gameplay/self-test definitions. */
window.VSX_MUTATION_BATCH01={ids:B01,selfTest,fragmentState:()=>game?.vsxFragmentSession||null};
})();
