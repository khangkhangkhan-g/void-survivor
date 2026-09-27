(function(){
"use strict";

/* =========================================================
   21 SPECIALIST ENEMIES + THREAT DIRECTOR
   ========================================================= */
const E31_IDS=[
 "echo_charger","boomerang_reaper","burrow_maw","tripwire_weaver","orbit_reaper","hex_archer","meteor_caller",
 "prism_lancer","pulse_shepherd","pain_banker","phantom_duelist","wall_mason","harpoon_knight","weapon_mimic",
 "fission_horror","rift_bomber","rhythm_executioner","siphon_priest","border_hunter","reality_splitter","apex_pursuer"
];
const E31_META={
 echo_charger:{wave:4,name:{en:"Echo Charger",vi:"Kỵ Binh Vọng Ảnh"},desc:{en:"Records your recent movement, previews the path with an echo, then charges along that past trajectory.",vi:"Ghi lại hướng di chuyển gần nhất, cho bóng vọng chạy thử rồi lao theo chính quỹ đạo quá khứ đó."}},
 boomerang_reaper:{wave:5,name:{en:"Boomerang Reaper",vi:"Đao Thủ Hồi Hoàn"},desc:{en:"Throws a hostile reaper blade whose returning route is recalculated from the Reaper's new position.",vi:"Ném lưỡi hái đi rồi hồi về theo đường được tính lại từ vị trí mới của Đao Thủ."}},
 burrow_maw:{wave:5,name:{en:"Burrow Maw",vi:"Hàm Sâu Địa Tầng"},desc:{en:"Burrows underground, marks an eruption point beneath you, then leaves a slowing sinkhole after surfacing.",vi:"Chui xuống đất, đánh dấu điểm trồi dưới người chơi rồi để lại hố sụt làm chậm sau khi bật lên."}},
 tripwire_weaver:{wave:6,name:{en:"Tripwire Weaver",vi:"Kẻ Giăng Tử Tuyến"},desc:{en:"Builds a shrinking triangular laser trap. Crossing a wire causes a burst hit; destroying the Weaver removes its active trap.",vi:"Giăng tam giác laser co dần. Cắt qua dây sẽ chịu sát thương; hạ Weaver sẽ xóa bẫy đang hoạt động."}},
 orbit_reaper:{wave:6,name:{en:"Orbit Reaper",vi:"Kẻ Gặt Quỹ Đạo"},desc:{en:"Orbits instead of chasing, then performs tangent slashes that punish predictable circular movement.",vi:"Bay vòng quanh thay vì đuổi thẳng rồi chém theo tiếp tuyến, trừng phạt lối chạy vòng tròn quen thuộc."}},
 hex_archer:{wave:7,name:{en:"Hex Archer",vi:"Cung Thủ Ấn Chú"},desc:{en:"Hex arrows build three marks. The third mark detonates a delayed radial curse around the survivor; Dash clears one stack.",vi:"Mũi tên tích ba Ấn Chú. Ấn thứ ba kích nổ lời nguyền vòng tròn có trễ; Dash xóa một tầng Ấn."}},
 meteor_caller:{wave:7,name:{en:"Meteor Caller",vi:"Kẻ Gọi Thiên Thạch"},desc:{en:"Paints a numbered sequence of impact circles. Meteors land in that exact order, rewarding route reading instead of panic movement.",vi:"Đánh dấu chuỗi điểm rơi có thứ tự. Thiên thạch rơi đúng tuần tự, buộc người chơi đọc đường né thay vì chạy loạn."}},
 prism_lancer:{wave:8,name:{en:"Prism Lancer",vi:"Kỵ Sĩ Lăng Kính"},desc:{en:"Telegraphs a long lance beam that reflects once from the visible battlefield edge.",vi:"Khóa tia thương dài có telegraph rồi phản xạ một lần từ biên màn hình nhìn thấy."}},
 pulse_shepherd:{wave:8,name:{en:"Pulse Shepherd",vi:"Kẻ Chăn Bầy Xung Kích"},desc:{en:"Commands nearby ordinary enemies into synchronized charge formations. Kill the Shepherd to cancel pending orders.",vi:"Điều khiển địch thường gần đó thành đội hình lao đồng bộ. Hạ Shepherd sẽ hủy lệnh charge đang chờ."}},
 pain_banker:{wave:9,name:{en:"Pain Banker",vi:"Kẻ Gửi Nợ Đau Đớn"},desc:{en:"Banks part of damage it receives into Pain Reserve, then cashes that reserve out as a telegraphed projectile burst.",vi:"Ghi một phần sát thương nhận vào Kho Đau Đớn rồi hoàn trả thành loạt projectile có telegraph."}},
 phantom_duelist:{wave:9,name:{en:"Phantom Duelist",vi:"Kiếm Sĩ Ảo Ảnh"},desc:{en:"Shows three slash telegraphs but only one is real. The true line is subtly brighter and strikes after a short feint window.",vi:"Hiện ba đường chém giả nhưng chỉ một đường thật. Đường thật sáng hơn nhẹ và chém sau nhịp nhử ngắn."}},
 wall_mason:{wave:10,name:{en:"Wall Mason",vi:"Thợ Xây Hư Không"},desc:{en:"Erects temporary walls that reroute enemies and block hostile shots. Dash can cross them.",vi:"Dựng tường tạm ép đổi đường, đồng thời chặn đạn địch. Dash có thể xuyên tường."}},
 harpoon_knight:{wave:10,name:{en:"Harpoon Knight",vi:"Kỵ Sĩ Lao Móc"},desc:{en:"Hooks the survivor from range. Running away builds tension until the cable snaps and stuns the Knight; Dash breaks it instantly.",vi:"Móc người chơi từ xa. Chạy ngược dây tăng lực căng đến khi dây đứt và làm choáng Kỵ Sĩ; Dash phá dây ngay."}},
 weapon_mimic:{wave:11,name:{en:"Weapon Mimic",vi:"Kẻ Nhái Vũ Khí"},desc:{en:"Scans one non-relic weapon in your loadout and fires a hostile interpretation of its attack pattern.",vi:"Quét một vũ khí thường trong loadout và sử dụng phiên bản hostile của pattern tấn công đó."}},
 fission_horror:{wave:11,name:{en:"Fission Horror",vi:"Dị Thể Phân Hạch"},desc:{en:"Taking a large burst in a short window causes it to split while still alive into two faster fragments. Fragments cannot split again.",vi:"Nhận burst lớn trong thời gian ngắn sẽ tự phân hạch khi còn sống thành hai mảnh nhanh hơn. Mảnh con không tách tiếp."}},
 rift_bomber:{wave:12,name:{en:"Rift Bomber",vi:"Kẻ Ném Bom Khe Nứt"},desc:{en:"Throws bombs through paired rifts so the projectile exits from a different angle than the original throw.",vi:"Ném bom xuyên cặp khe nứt để projectile xuất hiện từ một góc khác hoàn toàn so với hướng ném ban đầu."}},
 rhythm_executioner:{wave:12,name:{en:"Rhythm Executioner",vi:"Đao Phủ Nhịp Điệu"},desc:{en:"Attacks on a four-beat cycle. The first three beats pulse lightly; beat four unleashes a heavy fan execution.",vi:"Tấn công theo chu kỳ bốn nhịp. Ba nhịp đầu là xung nhẹ; nhịp bốn tung quạt chém hành quyết cực mạnh."}},
 siphon_priest:{wave:13,name:{en:"Siphon Priest",vi:"Tư Tế Hấp Thu"},desc:{en:"Steals only excess defenses such as overshield/barrier charge, converts them into Siphon Core, then fires a charged bolt.",vi:"Chỉ hút phòng thủ dư như Overshield/Barrier, đổi thành Lõi Hấp Thu rồi bắn đạn tích năng."}},
 border_hunter:{wave:14,name:{en:"Border Hunter",vi:"Thợ Săn Biên Giới"},desc:{en:"Stalks outside the visible battlefield edge, fires inward, then commits to the arena after several attacks.",vi:"Rình ngoài biên màn hình, bắn vào trong rồi mới lao hẳn vào chiến trường sau vài lượt."}},
 reality_splitter:{wave:15,name:{en:"Reality Splitter",vi:"Kẻ Xé Không Gian"},desc:{en:"Creates blue and red hazard layers. Only the currently active reality can damage you; the active layer alternates on a readable timer.",vi:"Tạo hazard hai lớp xanh/đỏ. Chỉ lớp thực tại đang hoạt động gây sát thương và hai lớp đổi nhịp theo timer rõ ràng."}},
 apex_pursuer:{wave:16,name:{en:"Apex Pursuer",vi:"Kẻ Săn Đỉnh Chuỗi"},desc:{en:"Reads your recent movement history and attacks predicted future positions with cutoff lunges instead of simple chasing.",vi:"Đọc lịch sử di chuyển gần nhất và lao chặn vị trí tương lai dự đoán thay vì chỉ đuổi theo vị trí hiện tại."}}
};

const E31_DEF={
 echo_charger:[62,72,17,16,8,"#ffb86a","diamond",.74], boomerang_reaper:[70,58,16,17,9,"#d58cff","hex",.68], burrow_maw:[88,54,20,20,10,"#8e5b45","circle",.58],
 tripwire_weaver:[76,60,15,17,10,"#ff5d9a","diamond",.48], orbit_reaper:[68,78,18,16,10,"#ff8168","diamond",.58], hex_archer:[62,50,12,15,10,"#ba77ff","triangle",.62],
 meteor_caller:[78,45,22,18,12,"#ff9e55","hex",.44], prism_lancer:[92,48,20,19,13,"#6ce1ff","diamond",.42], pulse_shepherd:[100,51,13,20,13,"#75eaa8","square",.40],
 pain_banker:[115,48,15,20,14,"#d66a88","hex",.38], phantom_duelist:[82,76,20,17,13,"#e4d3ff","diamond",.44], wall_mason:[120,39,15,21,15,"#778da8","square",.33],
 harpoon_knight:[108,52,17,20,15,"#e0b56c","diamond",.38], weapon_mimic:[110,50,17,20,17,"#77b8ff","hex",.28], fission_horror:[135,58,18,22,16,"#f06aaa","circle",.36],
 rift_bomber:[96,55,19,18,16,"#a36cff","diamond",.32], rhythm_executioner:[122,47,23,21,17,"#ff596e","hex",.30], siphon_priest:[128,44,18,21,18,"#68d5d2","square",.27],
 border_hunter:[98,68,18,18,17,"#f6c85f","triangle",.27], reality_splitter:[155,39,20,24,21,"#8b78ff","hex",.20], apex_pursuer:[145,86,23,21,22,"#ff4f66","diamond",.16]
};
for(const id of E31_IDS){const [hp,speed,damage,size,xp,color,shape,weight]=E31_DEF[id],m=E31_META[id];ENEMY_DEFINITIONS[id]={name:m.name.en,hp,speed,damage,size,xp,color,shape,behavior:"enemy31",spawnWeight:weight,minimumTime:(m.wave-1)*60,knockbackResistance:id==="wall_mason"?.56:id==="reality_splitter"?.52:id==="apex_pursuer"?.42:.2}}

/* ---------- Threat model for all 31 specialist enemies ---------- */
const E31_THREAT={
 void_leech:{cost:1.3,tags:["TETHER"]},shard_sniper:{cost:1.4,tags:["PROJECTILE"]},bulwark_pair:{cost:2.0,tags:["FORMATION","SUPPORT"]},phase_stalker:{cost:1.7,tags:["ASSASSIN"]},grave_carrier:{cost:2.1,tags:["SUPPORT","SUMMON"]},xp_devourer:{cost:1.1,tags:["ECONOMY"]},mirror_husk:{cost:1.8,tags:["COUNTER"]},chrono_mine_layer:{cost:2.0,tags:["HAZARD","TERRAIN"]},swarm_mother:{cost:2.6,tags:["SUMMON"]},void_auditor:{cost:2.4,tags:["SUPPORT","COUNTER"]},
 echo_charger:{cost:1.6,tags:["PREDICTIVE","ASSASSIN"]},boomerang_reaper:{cost:1.4,tags:["PROJECTILE"]},burrow_maw:{cost:1.7,tags:["HAZARD","ASSASSIN"]},tripwire_weaver:{cost:2.3,tags:["TERRAIN","HAZARD"]},orbit_reaper:{cost:1.7,tags:["PREDICTIVE","ASSASSIN"]},hex_archer:{cost:1.5,tags:["PROJECTILE","MARK"]},meteor_caller:{cost:2.2,tags:["HAZARD","PROJECTILE"]},prism_lancer:{cost:2.1,tags:["PROJECTILE"]},pulse_shepherd:{cost:2.2,tags:["FORMATION","SUPPORT"]},pain_banker:{cost:1.9,tags:["COUNTER","PROJECTILE"]},phantom_duelist:{cost:1.8,tags:["PREDICTIVE","ASSASSIN"]},wall_mason:{cost:2.5,tags:["TERRAIN"]},harpoon_knight:{cost:2.0,tags:["TETHER"]},weapon_mimic:{cost:2.6,tags:["COPY","COUNTER"]},fission_horror:{cost:2.0,tags:["SUMMON","COUNTER"]},rift_bomber:{cost:2.1,tags:["PROJECTILE","HAZARD"]},rhythm_executioner:{cost:2.0,tags:["PATTERN","HAZARD"]},siphon_priest:{cost:2.2,tags:["SUPPORT","SUSTAIN"]},border_hunter:{cost:1.9,tags:["PROJECTILE"]},reality_splitter:{cost:3.2,tags:["TERRAIN","HAZARD"]},apex_pursuer:{cost:3.0,tags:["PREDICTIVE","ASSASSIN"]}
};
const E31_INCOMPAT={
 TETHER:1,COPY:1,PREDICTIVE:2,SUPPORT:2,SUMMON:2,FORMATION:2,
 TERRAIN:2,HAZARD:2,ASSASSIN:3
};
function e31Budget(){const w=game.wave||1,mode=game.difficultyMode||"normal";let b=Math.min(12,3.2+w*.68);if(mode==="easy")b-=.8;if(mode==="hard")b+=1.2;if(mode==="nightmare")b+=2.4;if(game.boss?.bigBoss)b*=.72;return Math.max(2.4,b)}
function e31ThreatState(){let cost=0;const counts={};for(const e of game.enemies||[]){if(e.dead||e.vsxFissionClone)continue;const t=E31_THREAT[e.type];if(!t)continue;cost+=t.cost;for(const tag of t.tags)counts[tag]=(counts[tag]||0)+1}return {cost,counts,budget:e31Budget()}}
function e31Allowed(id,state=e31ThreatState()){
 const t=E31_THREAT[id];if(!t)return true;if(state.cost+t.cost>state.budget+.001)return false;
 for(const tag of t.tags)if(E31_INCOMPAT[tag]!=null&&(state.counts[tag]||0)>=E31_INCOMPAT[tag])return false;
 const alive=(x)=>(game.enemies||[]).some(e=>!e.dead&&e.type===x);
 if(id==="reality_splitter"&&(alive("wall_mason")||alive("tripwire_weaver")||alive("chrono_mine_layer")))return false;
 if((id==="wall_mason"||id==="tripwire_weaver"||id==="chrono_mine_layer")&&alive("reality_splitter"))return false;
 if(id==="wall_mason"&&alive("tripwire_weaver"))return false;
 if(id==="tripwire_weaver"&&alive("wall_mason"))return false;
 return true
}
function e31TagString(id){return (E31_THREAT[id]?.tags||[]).join(" · ")}
function e31Name(id){return E31_META[id]?.name?.[VSX.lang]||ENEMY_DEFINITIONS[id]?.name||id}
function e31Src(id,tags=["enemy"]){return {id,def:{tags}}}
function e31Dir(e,x,y){let n=normalize(x-e.x,y-e.y);if(e.statuses?.has("confuse"))n={x:-n.x,y:-n.y};return n}
function e31Move(e,x,y,speed,dt){const n=e31Dir(e,x,y);e.x+=n.x*speed*dt;e.y+=n.y*speed*dt;return n}
function e31Pre(e,dt){e.flash=Math.max(0,e.flash-dt);if(e.regen)e.hp=Math.min(e.maxHp,e.hp+e.regen*dt);let sm=e.updateStatus(dt);if(game.timeDilation>0)sm*=.38;return sm}
function e31Contact(e){const p=game.player,d=Math.hypot(e.x-p.x,e.y-p.y);if(d<e.size+p.radius){p.takeDamage(e.damage,{fromX:e.x,fromY:e.y,enemy:e,physical:true});const n=normalize(e.x-p.x,e.y-p.y);e.x+=n.x*11;e.y+=n.y*11}}
function e31EnemyBullet(x,y,vx,vy,damage,color="#ff7194",r=5,life=3){const q=new Projectile({x,y,vx,vy,radius:r,damage,life,color,owner:"enemy",critAllowed:false});game.enemyProjectiles.push(q);return q}
function e31RingBullets(x,y,count,speed,damage,color,offset=0){for(let i=0;i<count;i++){const a=offset+i*Math.PI*2/count;e31EnemyBullet(x,y,Math.cos(a)*speed,Math.sin(a)*speed,damage,color)}}
function e31FanBullets(x,y,a,count,spread,speed,damage,color){for(let i=0;i<count;i++){const q=count===1?0:(i/(count-1)-.5)*spread,aa=a+q;e31EnemyBullet(x,y,Math.cos(aa)*speed,Math.sin(aa)*speed,damage,color,6,3.2)}}
function e31SegIntersect(a,b,c,d){const cross=(u,v,w,z)=>u*z-v*w,abx=b.x-a.x,aby=b.y-a.y,acx=c.x-a.x,acy=c.y-a.y,adx=d.x-a.x,ady=d.y-a.y,cdx=d.x-c.x,cdy=d.y-c.y,den=cross(abx,aby,cdx,cdy);if(Math.abs(den)<1e-8)return false;const t=cross(acx,acy,cdx,cdy)/den,u=cross(acx,acy,abx,aby)/den;return t>=0&&t<=1&&u>=0&&u<=1}
function e31Closest(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy||1,t=clamp(((px-x1)*dx+(py-y1)*dy)/l2,0,1);return{x:x1+t*dx,y:y1+t*dy}}
function e31KillOwnerObjects(id){for(const o of game.vsxEnemy31Objects||[])if(o.ownerId===id)o.dead=true}

/* ---------- World hazard objects ---------- */
class E31Boomerang{
 constructor(owner,a){this.ownerId=owner.id;this.x=owner.x;this.y=owner.y;this.vx=Math.cos(a)*360;this.vy=Math.sin(a)*360;this.life=3.6;this.age=0;this.returning=false;this.dead=false;this.radius=12;this.hitOut=false;this.hitBack=false}
 update(dt){this.life-=dt;this.age+=dt;const owner=(game.enemies||[]).find(e=>!e.dead&&e.id===this.ownerId);if(!owner){this.dead=true;return}if(!this.returning&&this.age>.85)this.returning=true;if(this.returning){const n=normalize(owner.x-this.x,owner.y-this.y),sp=410;this.vx=lerp(this.vx,n.x*sp,clamp(6*dt,0,1));this.vy=lerp(this.vy,n.y*sp,clamp(6*dt,0,1));if(Math.hypot(owner.x-this.x,owner.y-this.y)<18){this.dead=true;return}}this.x+=this.vx*dt;this.y+=this.vy*dt;const p=game.player,hit=this.returning?this.hitBack:this.hitOut;if(!hit&&Math.hypot(p.x-this.x,p.y-this.y)<p.radius+this.radius){p.takeDamage(owner.damage*.9,{fromX:this.x,fromY:this.y,enemy:owner,physical:true});if(this.returning)this.hitBack=true;else this.hitOut=true}if(this.life<=0)this.dead=true}
 render(g){g.save();g.translate(this.x,this.y);g.rotate(this.age*10);g.strokeStyle="#e6adff";g.lineWidth=5;g.shadowBlur=10;g.shadowColor="#c16cff";g.beginPath();g.arc(0,0,this.radius,0,Math.PI*1.35);g.stroke();g.restore()}
}
class E31Sinkhole{
 constructor(x,y,ownerId){this.ownerId=ownerId;this.x=x;this.y=y;this.radius=82;this.life=3.6;this.dead=false}
 update(dt){this.life-=dt;const p=game.player;if(Math.hypot(p.x-this.x,p.y-this.y)<this.radius+p.radius&&game.vsx31PrevPlayer){const q=game.vsx31PrevPlayer;p.x=q.x+(p.x-q.x)*.62;p.y=q.y+(p.y-q.y)*.62}for(const e of game.enemies||[]){if(e.dead||e.id===this.ownerId)continue;if(Math.hypot(e.x-this.x,e.y-this.y)<this.radius+e.size)e.applyStatus("slow",.2,.35,e31Src("sinkhole",["enemy","control"]))}if(this.life<=0)this.dead=true}
 render(g){g.save();g.globalAlpha=.22;g.fillStyle="#5e4038";g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.fill();g.globalAlpha=.8;g.strokeStyle="#a66d50";g.setLineDash([8,7]);g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.stroke();g.restore()}
}
class E31Tripwire{
 constructor(owner){this.ownerId=owner.id;this.life=9;this.max=9;this.dead=false;const a=Math.random()*Math.PI*2,r=155;this.cx=owner.x;this.cy=owner.y;this.nodes=[0,1,2].map(i=>({x:this.cx+Math.cos(a+i*Math.PI*2/3)*r,y:this.cy+Math.sin(a+i*Math.PI*2/3)*r}));this.hitCd=0}
 update(dt){this.life-=dt;this.hitCd-=dt;const owner=(game.enemies||[]).find(e=>!e.dead&&e.id===this.ownerId);if(!owner){this.dead=true;return}const shrink=Math.max(.55,this.life/this.max);for(const n of this.nodes){n.x=this.cx+(n.x-this.cx)*Math.pow(shrink,dt*.14);n.y=this.cy+(n.y-this.cy)*Math.pow(shrink,dt*.14)}const p=game.player,pr=game.vsx31PrevPlayer||p;if(this.hitCd<=0){for(let i=0;i<3;i++){const a=this.nodes[i],b=this.nodes[(i+1)%3];if(e31SegIntersect({x:pr.x,y:pr.y},{x:p.x,y:p.y},a,b)||pointSegDist(p.x,p.y,a.x,a.y,b.x,b.y)<p.radius+3){p.takeDamage(owner.damage*.85,{fromX:(a.x+b.x)/2,fromY:(a.y+b.y)/2,enemy:owner,physical:true});this.hitCd=.72;break}}}if(this.life<=0)this.dead=true}
 render(g){g.save();g.strokeStyle="rgba(255,77,151,.82)";g.lineWidth=2;g.shadowBlur=8;g.shadowColor="#ff4d97";g.beginPath();this.nodes.forEach((n,i)=>i?g.lineTo(n.x,n.y):g.moveTo(n.x,n.y));g.closePath();g.stroke();for(const n of this.nodes){g.fillStyle="#ff89ba";g.beginPath();g.arc(n.x,n.y,5,0,Math.PI*2);g.fill()}g.restore()}
}
class E31MeteorMark{
 constructor(x,y,delay,damage,ownerId,index){this.ownerId=ownerId;this.x=x;this.y=y;this.delay=delay;this.max=delay;this.damage=damage;this.index=index;this.radius=58;this.dead=false;this.struck=false;this.life=delay+.45}
 update(dt){this.delay-=dt;this.life-=dt;if(!this.struck&&this.delay<=0){this.struck=true;const p=game.player;if(Math.hypot(p.x-this.x,p.y-this.y)<this.radius+p.radius)p.takeDamage(this.damage,{fromX:this.x,fromY:this.y,physical:false});game.shake(4,.12);game.spark(this.x,this.y,"#ff9b57",13)}if(this.life<=0)this.dead=true}
 render(g){const t=clamp(1-this.delay/Math.max(.01,this.max),0,1);g.save();g.strokeStyle=`rgba(255,145,70,${.35+.6*t})`;g.lineWidth=2+3*t;g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.stroke();g.fillStyle="#ffd0a0";g.font="900 12px Arial";g.textAlign="center";g.fillText(String(this.index),this.x,this.y+4);if(this.struck){g.globalAlpha=.22;g.fillStyle="#ff6e3b";g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.fill()}g.restore()}
}
class E31Beam{
 constructor(ownerId,segs,delay=.7,damage=18,color="#7de7ff"){this.ownerId=ownerId;this.segs=segs;this.delay=delay;this.max=delay;this.life=delay+.28;this.damage=damage;this.color=color;this.dead=false;this.hit=false}
 update(dt){this.delay-=dt;this.life-=dt;if(!this.hit&&this.delay<=0){this.hit=true;const p=game.player;for(const s of this.segs)if(pointSegDist(p.x,p.y,s.x1,s.y1,s.x2,s.y2)<p.radius+9){p.takeDamage(this.damage,{fromX:s.x1,fromY:s.y1,physical:false});break}}if(this.life<=0)this.dead=true}
 render(g){g.save();const active=this.delay<=0;g.strokeStyle=this.color;g.globalAlpha=active?.95:.35;g.lineWidth=active?7:2;g.setLineDash(active?[]:[10,8]);g.beginPath();for(const s of this.segs){g.moveTo(s.x1,s.y1);g.lineTo(s.x2,s.y2)}g.stroke();g.setLineDash([]);g.restore()}
}
class E31Wall{
 constructor(owner,x,y,a){this.ownerId=owner.id;this.x=x;this.y=y;this.a=a;this.len=180;this.life=5.8;this.dead=false;this.width=13}
 ends(){const dx=Math.cos(this.a)*this.len/2,dy=Math.sin(this.a)*this.len/2;return{x1:this.x-dx,y1:this.y-dy,x2:this.x+dx,y2:this.y+dy}}
 update(dt){this.life-=dt;const z=this.ends(),p=game.player;if((game.dashTimer||0)<=0){const c=e31Closest(p.x,p.y,z.x1,z.y1,z.x2,z.y2),dx=p.x-c.x,dy=p.y-c.y,d=Math.hypot(dx,dy)||1,min=p.radius+this.width;if(d<min){p.x=c.x+dx/d*min;p.y=c.y+dy/d*min}}for(const e of game.enemies||[]){if(e.dead||e.id===this.ownerId||e.isBoss||e.isMiniBoss)continue;const c=e31Closest(e.x,e.y,z.x1,z.y1,z.x2,z.y2),dx=e.x-c.x,dy=e.y-c.y,d=Math.hypot(dx,dy)||1,min=e.size+this.width;if(d<min){e.x=c.x+dx/d*min;e.y=c.y+dy/d*min}}for(const q of game.enemyProjectiles||[]){if(q.dead)continue;if(pointSegDist(q.x,q.y,z.x1,z.y1,z.x2,z.y2)<this.width+(q.radius||4))q.dead=true}if(this.life<=0)this.dead=true}
 render(g){const z=this.ends();g.save();g.strokeStyle="rgba(129,158,190,.9)";g.lineWidth=this.width*2;g.shadowBlur=7;g.shadowColor="#7892ad";g.beginPath();g.moveTo(z.x1,z.y1);g.lineTo(z.x2,z.y2);g.stroke();g.strokeStyle="#c8d6e6";g.lineWidth=2;g.stroke();g.restore()}
}
class E31RiftBomb{
 constructor(owner){this.ownerId=owner.id;const p=game.player,a=Math.random()*Math.PI*2,r=rand(260,130);this.inX=owner.x;this.inY=owner.y;this.outX=p.x+Math.cos(a)*r;this.outY=p.y+Math.sin(a)*r;this.timer=.78;this.life=3.2;this.dead=false;this.fired=false}
 update(dt){this.timer-=dt;this.life-=dt;const owner=(game.enemies||[]).find(e=>!e.dead&&e.id===this.ownerId);if(!this.fired&&this.timer<=0&&owner){this.fired=true;const p=game.player,n=normalize(p.x-this.outX,p.y-this.outY);e31EnemyBullet(this.outX,this.outY,n.x*330,n.y*330,owner.damage*1.05,"#b987ff",8,3)}if(this.life<=0)this.dead=true}
 render(g){g.save();g.strokeStyle="#ac7cff";g.lineWidth=3;for(const [x,y] of [[this.inX,this.inY],[this.outX,this.outY]]){g.beginPath();g.ellipse(x,y,14,25,0,0,Math.PI*2);g.stroke()}g.globalAlpha=.25;g.beginPath();g.moveTo(this.inX,this.inY);g.lineTo(this.outX,this.outY);g.stroke();g.restore()}
}
class E31RealityZone{
 constructor(owner,x,y,layer){this.ownerId=owner.id;this.x=x;this.y=y;this.layer=layer;this.radius=72;this.life=8;this.dead=false;this.hitCd=0}
 update(dt){this.life-=dt;this.hitCd-=dt;const owner=(game.enemies||[]).find(e=>!e.dead&&e.id===this.ownerId);if(!owner){this.dead=true;return}if(this.layer===game.vsx31RealityLayer&&this.hitCd<=0&&Math.hypot(game.player.x-this.x,game.player.y-this.y)<this.radius+game.player.radius){game.player.takeDamage(owner.damage*.78,{fromX:this.x,fromY:this.y,enemy:owner,physical:false});this.hitCd=.75}if(this.life<=0)this.dead=true}
 render(g){const active=this.layer===game.vsx31RealityLayer,c=this.layer==="blue"?"#55c9ff":"#ff5a83";g.save();g.globalAlpha=active?.22:.055;g.fillStyle=c;g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.fill();g.globalAlpha=active?.92:.22;g.strokeStyle=c;g.lineWidth=active?3:1;g.beginPath();g.arc(this.x,this.y,this.radius,0,Math.PI*2);g.stroke();g.restore()}
}

function e31PrismSegments(e){const p=game.player,a=Math.atan2(p.y-e.y,p.x-e.x),dx=Math.cos(a),dy=Math.sin(a),cam=game.camera,margin=18,L=1200;let t=L;if(dx>0)t=Math.min(t,(cam.x+innerWidth-margin-e.x)/dx);if(dx<0)t=Math.min(t,(cam.x+margin-e.x)/dx);if(dy>0)t=Math.min(t,(cam.y+innerHeight-margin-e.y)/dy);if(dy<0)t=Math.min(t,(cam.y+margin-e.y)/dy);t=Math.max(80,t);const hx=e.x+dx*t,hy=e.y+dy*t;let rdx=dx,rdy=dy;if(hx<=cam.x+margin+2||hx>=cam.x+innerWidth-margin-2)rdx*=-1;else rdy*=-1;return[{x1:e.x,y1:e.y,x2:hx,y2:hy},{x1:hx,y1:hy,x2:hx+rdx*620,y2:hy+rdy*620}]}

/* ---------- Runtime state ---------- */
const E31_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){E31_INIT_BASE.call(this);this.vsxEnemy31Objects=[];this.vsx31PlayerHistory=[];this.vsx31PrevPlayer=null;this.vsx31RealityLayer="blue";this.vsx31RealityTimer=2;this.vsx31HexStacks=0;this.vsx31HexDecay=0};

/* ---------- Custom enemy AI ---------- */
const E31_ENEMY_UPDATE_BASE=Enemy.prototype.update;
Enemy.prototype.update=function(dt){
 if(!E31_META[this.type])return E31_ENEMY_UPDATE_BASE.call(this,dt);
 const sm=e31Pre(this,dt);if(this.dead||sm===0)return;const p=game.player,dx=p.x-this.x,dy=p.y-this.y,d=Math.hypot(dx,dy)||1,n=e31Dir(this,p.x,p.y),edt=dt;
 this.aiTimer=(this.aiTimer??1)-edt;this.shotTimer=(this.shotTimer??1)-edt;
 if(this.vsxStunUntil&&game.time<this.vsxStunUntil)return;

 if(this.type==="echo_charger"){
   this.vsxState||="observe";if(this.vsxState==="observe"&&this.aiTimer<=0){const h=game.vsx31PlayerHistory||[],old=h[Math.max(0,h.length-18)]||{x:p.x,y:p.y},vx=p.x-old.x,vy=p.y-old.y,nn=normalize(vx||n.x,vy||n.y);this.vsxEcho={x:p.x,y:p.y,vx:nn.x*this.speed*4.3,vy:nn.y*this.speed*4.3,time:.55};this.vsxState="telegraph";this.aiTimer=.55}else if(this.vsxState==="telegraph"){this.vsxEcho.time-=edt;if(this.vsxEcho.time<=0){this.vsxState="charge";this.vsxCharge=normalize(this.vsxEcho.vx,this.vsxEcho.vy);this.aiTimer=.50}}else if(this.vsxState==="charge"){this.x+=this.vsxCharge.x*this.speed*4.1*edt;this.y+=this.vsxCharge.y*this.speed*4.1*edt;if(this.aiTimer<=0){this.vsxState="observe";this.aiTimer=2.1}}else e31Move(this,p.x,p.y,this.speed*.7*sm,edt);e31Contact(this);return
 }
 if(this.type==="boomerang_reaper"){
   if(d<210)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>360)e31Move(this,p.x,p.y,this.speed*sm,edt);else{this.x+=-n.y*this.speed*.5*sm*edt;this.y+=n.x*this.speed*.5*sm*edt}if(this.shotTimer<=0){this.shotTimer=2.15;game.vsxEnemy31Objects.push(new E31Boomerang(this,Math.atan2(p.y-this.y,p.x-this.x)))}e31Contact(this);return
 }
 if(this.type==="burrow_maw"){
   this.vsxBurrowState||="surface";if(this.vsxBurrowState==="surface"){e31Move(this,p.x,p.y,this.speed*.55*sm,edt);if(this.aiTimer<=0){this.vsxBurrowState="burrow";this.vsxBurrowTarget={x:p.x,y:p.y};this.aiTimer=.92}}else if(this.vsxBurrowState==="burrow"){if(this.aiTimer<=0){this.x=this.vsxBurrowTarget.x;this.y=this.vsxBurrowTarget.y;this.vsxBurrowState="erupt";this.aiTimer=.24;game.vsxEnemy31Objects.push(new E31Sinkhole(this.x,this.y,this.id));if(Math.hypot(p.x-this.x,p.y-this.y)<p.radius+58)p.takeDamage(this.damage,{fromX:this.x,fromY:this.y,enemy:this,physical:true});game.shake(5,.15)}}else if(this.vsxBurrowState==="erupt"&&this.aiTimer<=0){this.vsxBurrowState="surface";this.aiTimer=2.7}if(this.vsxBurrowState==="surface")e31Contact(this);return
 }
 if(this.type==="tripwire_weaver"){
   if(d<220)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>360)e31Move(this,p.x,p.y,this.speed*sm,edt);else{this.x+=-n.y*this.speed*.32*edt;this.y+=n.x*this.speed*.32*edt}if(this.aiTimer<=0){this.aiTimer=7.1;for(const o of game.vsxEnemy31Objects||[])if(o.ownerId===this.id&&o instanceof E31Tripwire)o.dead=true;game.vsxEnemy31Objects.push(new E31Tripwire(this))}e31Contact(this);return
 }
 if(this.type==="orbit_reaper"){
   this.vsxOrbitDir??=(Math.random()<.5?-1:1);const desired=220;if(d>desired+40)e31Move(this,p.x,p.y,this.speed*sm,edt);else if(d<desired-45)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else{this.x+=-n.y*this.speed*this.vsxOrbitDir*sm*edt;this.y+=n.x*this.speed*this.vsxOrbitDir*sm*edt}if(this.aiTimer<=0){this.aiTimer=2.35;this.vsxSlash={vx:-n.y*this.vsxOrbitDir*this.speed*4.5,vy:n.x*this.vsxOrbitDir*this.speed*4.5,t:.36}}if(this.vsxSlash?.t>0){this.vsxSlash.t-=edt;this.x+=this.vsxSlash.vx*edt;this.y+=this.vsxSlash.vy*edt}e31Contact(this);return
 }
 if(this.type==="hex_archer"){
   if(d<250)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>430)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.shotTimer<=0){this.shotTimer=1.85;const a=Math.atan2(p.y-this.y,p.x-this.x),q=e31EnemyBullet(this.x,this.y,Math.cos(a)*270,Math.sin(a)*270,this.damage*.7,"#c790ff",5,3);q.vsxHex=true}e31Contact(this);return
 }
 if(this.type==="meteor_caller"){
   if(d<280)e31Move(this,this.x-n.x*120,this.y-n.y*120,this.speed*sm,edt);else if(d>480)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0){this.aiTimer=5.4;const base=Math.atan2((game.lastMoveDir||{x:1,y:0}).y,(game.lastMoveDir||{x:1,y:0}).x);for(let i=0;i<5;i++){const ahead=50+i*44,a=base+(i-2)*.14,x=p.x+Math.cos(a)*ahead+rand(26,-26),y=p.y+Math.sin(a)*ahead+rand(26,-26);game.vsxEnemy31Objects.push(new E31MeteorMark(x,y,.68+i*.32,this.damage*.82,this.id,i+1))}}e31Contact(this);return
 }
 if(this.type==="prism_lancer"){
   if(d<300)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>520)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0){this.aiTimer=3.35;game.vsxEnemy31Objects.push(new E31Beam(this.id,e31PrismSegments(this),.78,this.damage,"#75e6ff"))}e31Contact(this);return
 }
 if(this.type==="pulse_shepherd"){
   if(d<260)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>420)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0){this.aiTimer=4.25;const candidates=(game.enemies||[]).filter(q=>!q.dead&&q!==this&&!q.isBoss&&!q.isMiniBoss&&!E31_META[q.type]&&Math.hypot(q.x-this.x,q.y-this.y)<340).slice(0,8);for(const q of candidates){const nn=normalize(p.x-q.x,p.y-q.y);q.vsxShepherdOrder={ownerId:this.id,vx:nn.x*Math.max(220,q.speed*3),vy:nn.y*Math.max(220,q.speed*3),delay:.55,time:.55}}game.texts.push(new FloatingText(this.x,this.y-this.size-8,VSX.lang==="vi"?"XUNG PHONG!":"CHARGE ORDER!","#82f2b5",10))}e31Contact(this);return
 }
 if(this.type==="pain_banker"){
   if(d<220)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>360)e31Move(this,p.x,p.y,this.speed*sm,edt);if((this.vsxPainReserve||0)>=Math.max(24,this.maxHp*.11)&&!this.vsxPainTell){this.vsxPainTell=.72}if(this.vsxPainTell!=null){this.vsxPainTell-=edt;if(this.vsxPainTell<=0){const reserve=this.vsxPainReserve||0;this.vsxPainReserve=0;delete this.vsxPainTell;const cnt=clamp(Math.round(6+reserve/28),6,14),dmg=Math.min(this.damage*.95,7+reserve*.055);e31RingBullets(this.x,this.y,cnt,230,dmg,"#ef7995",game.time);game.texts.push(new FloatingText(this.x,this.y-this.size-8,VSX.lang==="vi"?"TRẢ NỢ ĐAU ĐỚN":"PAIN PAYOUT","#ff8aa2",10))}}e31Contact(this);return
 }
 if(this.type==="phantom_duelist"){
   e31Move(this,p.x,p.y,this.speed*.72*sm,edt);if(this.aiTimer<=0&&!this.vsxFeint){const base=Math.atan2(p.y-this.y,p.x-this.x),real=Math.floor(Math.random()*3);this.vsxFeint={base,real,t:.68,angles:[base-.45,base,base+.45]};this.aiTimer=2.45}if(this.vsxFeint){this.vsxFeint.t-=edt;if(this.vsxFeint.t<=0){const a=this.vsxFeint.angles[this.vsxFeint.real],x2=this.x+Math.cos(a)*330,y2=this.y+Math.sin(a)*330;if(pointSegDist(p.x,p.y,this.x,this.y,x2,y2)<p.radius+15)p.takeDamage(this.damage,{fromX:this.x,fromY:this.y,enemy:this,physical:true});game.shake(3,.09);this.vsxFeint=null}}e31Contact(this);return
 }
 if(this.type==="wall_mason"){
   if(d<270)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>430)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0){this.aiTimer=5.4;const a=Math.atan2(p.y-this.y,p.x-this.x)+Math.PI/2,x=p.x+Math.cos(a)*rand(100,-100),y=p.y+Math.sin(a)*rand(100,-100);game.vsxEnemy31Objects.push(new E31Wall(this,x,y,a))}e31Contact(this);return
 }
 if(this.type==="harpoon_knight"){
   if(this.vsxHook){const h=this.vsxHook;if((game.dashTimer||0)>0||game.time>(h.expires||0)){this.vsxHook=null;this.vsxStunUntil=game.time+.45}else{const nn=normalize(this.x-p.x,this.y-p.y);p.x+=nn.x*34*edt;p.y+=nn.y*34*edt;const prev=game.vsx31PrevPlayer||p,mx=p.x-prev.x,my=p.y-prev.y,away=normalize(p.x-this.x,p.y-this.y),gain=Math.max(0,mx*away.x+my*away.y);h.tension+=gain*.9;if(h.tension>62){this.vsxHook=null;this.vsxStunUntil=game.time+1.15;game.texts.push(new FloatingText(this.x,this.y-this.size-8,VSX.lang==="vi"?"ĐỨT DÂY":"CABLE SNAP","#ffe19c",11))}}}else{if(d<180)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>390)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0&&d<520){this.aiTimer=3.2;this.vsxHookTell=.55;this.vsxHookAim={x:p.x,y:p.y}}if(this.vsxHookTell!=null){this.vsxHookTell-=edt;if(this.vsxHookTell<=0){if(Math.hypot(p.x-this.vsxHookAim.x,p.y-this.vsxHookAim.y)<62)this.vsxHook={tension:0,expires:game.time+4};delete this.vsxHookTell}}}e31Contact(this);return
 }
 if(this.type==="weapon_mimic"){
   if(d<250)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>440)e31Move(this,p.x,p.y,this.speed*sm,edt);if(!this.vsxMimicWeapon||this.aiTimer<=0){this.aiTimer=4.2;const pool=(p.weapons||[]).filter(w=>!w.def?.rewardOnly&&!w.def?.legendaryRelic);this.vsxMimicWeapon=pool.length?pool[Math.floor(Math.random()*pool.length)]:null}if(this.shotTimer<=0){this.shotTimer=1.65;const w=this.vsxMimicWeapon,tags=w?.def?.tags||[],a=Math.atan2(p.y-this.y,p.x-this.x);if(tags.includes("beam")){game.vsxEnemy31Objects.push(new E31Beam(this.id,[{x1:this.x,y1:this.y,x2:p.x,y2:p.y}],.55,this.damage,"#76baff"))}else if(tags.includes("area")||tags.includes("explosive")){game.vsxEnemy31Objects.push(new E31MeteorMark(p.x,p.y,.65,this.damage*.88,this.id,"X"))}else if(tags.includes("orbit")||tags.includes("melee")){e31RingBullets(this.x,this.y,9,205,this.damage*.7,"#7db9ff",game.time)}else e31FanBullets(this.x,this.y,a,3,.34,285,this.damage*.72,"#7db9ff")}e31Contact(this);return
 }
 if(this.type==="fission_horror"){
   e31Move(this,p.x,p.y,this.speed*sm,edt);e31Contact(this);return
 }
 if(this.type==="rift_bomber"){
   if(d<240)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>420)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0){this.aiTimer=2.8;game.vsxEnemy31Objects.push(new E31RiftBomb(this))}e31Contact(this);return
 }
 if(this.type==="rhythm_executioner"){
   if(d<220)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*.7*sm,edt);else if(d>370)e31Move(this,p.x,p.y,this.speed*.7*sm,edt);this.vsxBeatTimer=(this.vsxBeatTimer??.75)-edt;if(this.vsxBeatTimer<=0){this.vsxBeatTimer=.72;this.vsxBeat=((this.vsxBeat||0)%4)+1;if(this.vsxBeat<4)e31RingBullets(this.x,this.y,4,155,this.damage*.32,"#ff8a9a",this.vsxBeat*Math.PI/4);else{const a=Math.atan2(p.y-this.y,p.x-this.x);e31FanBullets(this.x,this.y,a,7,1.0,300,this.damage*.78,"#ff526c");game.shake(4,.1)}}e31Contact(this);return
 }
 if(this.type==="siphon_priest"){
   if(d<270)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>420)e31Move(this,p.x,p.y,this.speed*sm,edt);this.vsxSiphon=(this.vsxSiphon??1)-edt;if(this.vsxSiphon<=0&&d<520){this.vsxSiphon=1.15;let take=0;if((p.overhealShield||0)>0){const q=Math.min(p.overhealShield,7);p.overhealShield-=q;take+=q}if((p.barrierHp||0)>0){const q=Math.min(p.barrierHp,5);p.barrierHp-=q;take+=q}this.vsxSiphonCore=(this.vsxSiphonCore||0)+take;if(take>0)game.beams.push({x1:p.x,y1:p.y,x2:this.x,y2:this.y,life:.14,color:"#75e4d8",width:2})}if((this.vsxSiphonCore||0)>=18){const a=Math.atan2(p.y-this.y,p.x-this.x),bonus=Math.min(12,this.vsxSiphonCore*.28);e31EnemyBullet(this.x,this.y,Math.cos(a)*305,Math.sin(a)*305,this.damage*.65+bonus,"#65e3d5",8,3);this.vsxSiphonCore=0}e31Contact(this);return
 }
 if(this.type==="border_hunter"){
   this.vsxBorderShots??=0;this.vsxBorderState||="outside";if(this.vsxBorderState==="outside"){const cam=game.camera,cx=cam.x+innerWidth/2,cy=cam.y+innerHeight/2,ang=Math.atan2(this.y-cy,this.x-cx)+.22*edt;const r=Math.max(innerWidth,innerHeight)*.64;this.x=cx+Math.cos(ang)*r;this.y=cy+Math.sin(ang)*r;if(this.shotTimer<=0){this.shotTimer=1.25;const a=Math.atan2(p.y-this.y,p.x-this.x);e31EnemyBullet(this.x,this.y,Math.cos(a)*340,Math.sin(a)*340,this.damage*.72,"#ffd56d",5,4);this.vsxBorderShots++;if(this.vsxBorderShots>=3)this.vsxBorderState="enter"}}else{e31Move(this,p.x,p.y,this.speed*1.25*sm,edt)}e31Contact(this);return
 }
 if(this.type==="reality_splitter"){
   if(d<290)e31Move(this,this.x-n.x*100,this.y-n.y*100,this.speed*sm,edt);else if(d>470)e31Move(this,p.x,p.y,this.speed*sm,edt);if(this.aiTimer<=0){this.aiTimer=3.1;for(let i=0;i<2;i++){const a=Math.random()*Math.PI*2,r=rand(280,90),layer=i?"red":"blue";game.vsxEnemy31Objects.push(new E31RealityZone(this,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,layer))}}e31Contact(this);return
 }
 if(this.type==="apex_pursuer"){
   this.vsxApexState||="hunt";const hist=game.vsx31PlayerHistory||[],old=hist[Math.max(0,hist.length-12)]||{x:p.x,y:p.y},vx=(p.x-old.x)*2.0,vy=(p.y-old.y)*2.0,pred={x:p.x+vx,y:p.y+vy};if(this.vsxApexState==="hunt"){e31Move(this,pred.x,pred.y,this.speed*.92*sm,edt);if(this.aiTimer<=0){this.aiTimer=2.2;this.vsxApexState="tell";this.vsxApexPred=pred;this.vsxApexTell=.42}}else if(this.vsxApexState==="tell"){this.vsxApexTell-=edt;if(this.vsxApexTell<=0){const nn=normalize(this.vsxApexPred.x-this.x,this.vsxApexPred.y-this.y);this.vsxApexV={x:nn.x*this.speed*5.0,y:nn.y*this.speed*5.0};this.vsxApexState="lunge";this.vsxApexTell=.34}}else{this.vsxApexTell-=edt;this.x+=this.vsxApexV.x*edt;this.y+=this.vsxApexV.y*edt;if(this.vsxApexTell<=0)this.vsxApexState="hunt"}e31Contact(this);return
 }
};

/* Hex projectile hit + dash counter. */
const E31_PROJECTILE_HIT_BASE=Projectile.prototype.hitPlayer;
Projectile.prototype.hitPlayer=function(){const was=this.dead,p=game.player,rr=this.radius+(p?.radius||0),touch=p&&!this.dead&&(this.x-p.x)**2+(this.y-p.y)**2<=rr*rr,r=E31_PROJECTILE_HIT_BASE.call(this);if(touch&&this.vsxHex&&!was){game.vsx31HexStacks=Math.min(3,(game.vsx31HexStacks||0)+1);game.vsx31HexDecay=5;if(game.vsx31HexStacks>=3){game.vsx31HexStacks=0;const owner=(game.enemies||[]).find(e=>!e.dead&&e.type==="hex_archer");game.vsxEnemy31Objects.push(new E31MeteorMark(p.x,p.y,.75,(owner?.damage||14)*.82,owner?.id||0,"HEX"));game.texts.push(new FloatingText(p.x,p.y-42,VSX.lang==="vi"?"ẤN III — PHÁT NỔ":"HEX III — DETONATION","#d9a6ff",11))}}return r};

/* Damage interactions: Pain Reserve + Fission burst. */
const E31_DAMAGE_BASE=Game.prototype.damageEnemy;
Game.prototype.damageEnemy=function(e,a,o={}){
 if(e&&!e.dead&&e.type==="pain_banker")e.vsxPainReserve=(e.vsxPainReserve||0)+Math.max(0,a)*.25;
 if(e&&!e.dead&&e.type==="fission_horror"&&!e.vsxFissionClone&&!e.vsxDidFission){const now=this.time||0;if(!e.vsxBurstStart||now-e.vsxBurstStart>1.25){e.vsxBurstStart=now;e.vsxBurstDamage=0}e.vsxBurstDamage=(e.vsxBurstDamage||0)+Math.max(0,a);if(e.vsxBurstDamage>=e.maxHp*.40){e.vsxDidFission=true;for(const side of [-1,1]){const q=vsxApplyDifficulty(new Enemy("fission_horror",e.x+side*28,e.y+rand(18,-18),Math.max(.75,game.difficulty*.74),null));q.vsxFissionClone=true;q.vsxDidFission=true;q.size*=.66;q.maxHp*=.36;q.hp=q.maxHp;q.speed*=1.38;q.damage*=.72;q.xp=Math.max(1,Math.round(q.xp*.34));game.enemies.push(q)}game.spark(e.x,e.y,"#ff78b4",18);game.texts.push(new FloatingText(e.x,e.y-e.size-8,VSX.lang==="vi"?"PHÂN HẠCH!":"FISSION!","#ff92c2",12))}}
 return E31_DAMAGE_BASE.call(this,e,a,o)
};

/* Cleanup owned hazards and special death effects. */
const E31_DIE_BASE=Enemy.prototype.die;
Enemy.prototype.die=function(drop=true){if(this.dead)return;const id=this.id,type=this.type;E31_DIE_BASE.call(this,drop);if(E31_META[type])e31KillOwnerObjects(id);if(type==="pulse_shepherd")for(const q of game.enemies||[])if(q.vsxShepherdOrder?.ownerId===id)q.vsxShepherdOrder=null;if(type==="harpoon_knight")this.vsxHook=null};

/* Additional visuals. */
const E31_RENDER_BASE=Enemy.prototype.render;
Enemy.prototype.render=function(g){
 const buried=this.type==="burrow_maw"&&this.vsxBurrowState==="burrow";g.save();if(buried)g.globalAlpha=.13;E31_RENDER_BASE.call(this,g);g.restore();if(!E31_META[this.type]||this.dead)return;g.save();
 if(this.type==="echo_charger"&&this.vsxEcho?.time>0){g.globalAlpha=.28;g.fillStyle="#ffd0a3";g.beginPath();g.arc(this.vsxEcho.x+this.vsxEcho.vx*(.55-this.vsxEcho.time),this.vsxEcho.y+this.vsxEcho.vy*(.55-this.vsxEcho.time),this.size*.8,0,Math.PI*2);g.fill()}
 else if(this.type==="burrow_maw"&&buried){g.globalAlpha=.7;g.strokeStyle="#c78765";g.setLineDash([7,6]);g.beginPath();g.arc(this.vsxBurrowTarget.x,this.vsxBurrowTarget.y,54,0,Math.PI*2);g.stroke();g.setLineDash([])}
 else if(this.type==="phantom_duelist"&&this.vsxFeint){this.vsxFeint.angles.forEach((a,i)=>{g.strokeStyle=i===this.vsxFeint.real?"rgba(245,229,255,.66)":"rgba(196,150,238,.25)";g.lineWidth=i===this.vsxFeint.real?2.4:1.3;g.beginPath();g.moveTo(this.x,this.y);g.lineTo(this.x+Math.cos(a)*330,this.y+Math.sin(a)*330);g.stroke()})}
 else if(this.type==="harpoon_knight"){if(this.vsxHook){g.strokeStyle="#e8c67c";g.lineWidth=2;g.beginPath();g.moveTo(this.x,this.y);g.lineTo(game.player.x,game.player.y);g.stroke();g.fillStyle="#ffe19b";g.font="900 9px Arial";g.textAlign="center";g.fillText(`TENSION ${Math.round(this.vsxHook.tension)}`,this.x,this.y-this.size-10)}else if(this.vsxHookTell!=null){g.strokeStyle="rgba(255,222,151,.45)";g.setLineDash([7,5]);g.beginPath();g.moveTo(this.x,this.y);g.lineTo(this.vsxHookAim.x,this.vsxHookAim.y);g.stroke();g.setLineDash([])}}
 else if(this.type==="pain_banker"){g.fillStyle="#ff91a9";g.font="900 9px Arial";g.textAlign="center";g.fillText(`PAIN ${Math.round(this.vsxPainReserve||0)}`,this.x,this.y-this.size-10);if(this.vsxPainTell!=null){g.strokeStyle="#ff7692";g.globalAlpha=.5;g.beginPath();g.arc(this.x,this.y,this.size+12+Math.sin(game.time*14)*4,0,Math.PI*2);g.stroke()}}
 else if(this.type==="weapon_mimic"&&this.vsxMimicWeapon){g.fillStyle="#9acbff";g.font="900 8px Arial";g.textAlign="center";g.fillText(`COPY: ${(this.vsxMimicWeapon.name||this.vsxMimicWeapon.id||"").slice(0,18)}`,this.x,this.y-this.size-10)}
 else if(this.type==="rhythm_executioner"){g.fillStyle="#ff93a0";g.font="900 10px Arial";g.textAlign="center";g.fillText(`${this.vsxBeat||1}/4`,this.x,this.y-this.size-10)}
 else if(this.type==="siphon_priest"){g.fillStyle="#86f0e4";g.font="900 9px Arial";g.textAlign="center";g.fillText(`CORE ${Math.round(this.vsxSiphonCore||0)}`,this.x,this.y-this.size-10)}
 else if(this.type==="reality_splitter"){g.fillStyle=game.vsx31RealityLayer==="blue"?"#70d5ff":"#ff7897";g.font="900 9px Arial";g.textAlign="center";g.fillText((game.vsx31RealityLayer||"blue").toUpperCase(),this.x,this.y-this.size-11)}
 else if(this.type==="apex_pursuer"&&this.vsxApexState==="tell"&&this.vsxApexPred){g.strokeStyle="rgba(255,82,105,.55)";g.setLineDash([7,5]);g.beginPath();g.moveTo(this.x,this.y);g.lineTo(this.vsxApexPred.x,this.vsxApexPred.y);g.stroke();g.setLineDash([])}
 g.restore()
};

/* ---------- Game-level object update, history, reality layers, formations ---------- */
const E31_GAME_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
 if(this.player)this.vsx31PrevPlayer={x:this.player.x,y:this.player.y};
 const r=E31_GAME_UPDATE_BASE.call(this,dt);if(this.state!=="PLAYING"||!this.player)return r;
 const edt=dt*(typeof VSX_ADMIN!=="undefined"?(VSX_ADMIN.speed||1):1);
 this.vsx31PlayerHistory||=[];this.vsx31PlayerHistory.push({x:this.player.x,y:this.player.y,t:this.time});while(this.vsx31PlayerHistory.length>50)this.vsx31PlayerHistory.shift();
 if((this.dashTimer||0)>0&&this.vsx31HexStacks>0&&!this.vsx31DashHexLatch){this.vsx31HexStacks--;this.vsx31DashHexLatch=true}else if((this.dashTimer||0)<=0)this.vsx31DashHexLatch=false;
 this.vsx31HexDecay=Math.max(0,(this.vsx31HexDecay||0)-edt);if(this.vsx31HexDecay<=0)this.vsx31HexStacks=0;
 this.vsx31RealityTimer=(this.vsx31RealityTimer??2)-edt;if(this.vsx31RealityTimer<=0){this.vsx31RealityTimer=2;this.vsx31RealityLayer=this.vsx31RealityLayer==="blue"?"red":"blue"}
 for(const e of this.enemies||[]){if(e.dead||!e.vsxShepherdOrder)continue;const o=e.vsxShepherdOrder,owner=this.enemies.find(q=>!q.dead&&q.id===o.ownerId);if(!owner){e.vsxShepherdOrder=null;continue}o.delay-=edt;if(o.delay<=0&&o.time>0){o.time-=edt;e.x+=o.vx*edt;e.y+=o.vy*edt;if(o.time<=0)e.vsxShepherdOrder=null}}
 this.vsxEnemy31Objects||=[];for(const o of this.vsxEnemy31Objects)if(!o.dead)o.update(edt);this.vsxEnemy31Objects=this.vsxEnemy31Objects.filter(o=>!o.dead);
 return r
};
const E31_GAME_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){const r=E31_GAME_RENDER_BASE.call(this);if(!this.player||this.state==="TITLE")return r;ctx.save();ctx.translate(-this.camera.x,-this.camera.y);for(const o of this.vsxEnemy31Objects||[])if(!o.dead)o.render(ctx);ctx.restore();return r};

/* ---------- Threat-budget Spawn Director ---------- */
SpawnManager.prototype.spawnOne=function(forceElite=false){
 if(!game.player)return;const state=e31ThreatState();let unlocked=Object.entries(ENEMY_DEFINITIONS).filter(([id,d])=>!d.special&&game.time>=d.minimumTime&&d.spawnWeight>0&&e31Allowed(id,state));if(!unlocked.length)unlocked=Object.entries(ENEMY_DEFINITIONS).filter(([id,d])=>!d.special&&!E31_THREAT[id]&&game.time>=d.minimumTime&&d.spawnWeight>0);if(!unlocked.length)return;
 let total=0;for(const [,d] of unlocked)total+=d.spawnWeight;let rr=Math.random()*total,type=unlocked[0][0];for(const [id,d] of unlocked){rr-=d.spawnWeight;if(rr<=0){type=id;break}}
 const a=Math.random()*Math.PI*2,rad=Math.hypot(innerWidth,innerHeight)*.58+rand(180,80),x=game.player.x+Math.cos(a)*rad,y=game.player.y+Math.sin(a)*rad,mode=DIFFICULTY_DEFINITIONS[game.difficultyMode||"normal"],fortune=game.player.passiveLevel("fortune_bold");let chance=(GAME_CONFIG.eliteBaseChance+game.time/14000+game.player.luck*.002)*(1+.45*fortune)*(mode.elite??1);if(game.worldEvent?.id==="elite_invasion")chance=Math.max(chance,.32);let elite=null;if(forceElite||Math.random()<chance)elite=pick(["Swift","Giant","Regenerating","Explosive","Shielded","Frenzied"]);
 const e=vsxApplyDifficulty(new Enemy(type,x,y,game.difficulty,elite));if(type==="border_hunter"){const ca=game.camera,cx=ca.x+innerWidth/2,cy=ca.y+innerHeight/2,aa=Math.random()*Math.PI*2,r=Math.max(innerWidth,innerHeight)*.66;e.x=cx+Math.cos(aa)*r;e.y=cy+Math.sin(aa)*r}if(game.worldEvent?.id==="golden_rush"&&Math.random()<.32){e.golden=true;e.xp=Math.round(e.xp*2.2)}game.enemies.push(e)
};

/* ---------- Collection ---------- */
const E31_CODEX_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){const rows=E31_CODEX_BASE.call(VSX,cat);if(cat!=="enemies")return rows;return rows.map(row=>{const m=E31_META[row[0]];if(!m)return row;return[row[0],m.name[VSX.lang],`${m.desc[VSX.lang]} • ${VSX.lang==="vi"?"Xuất hiện từ Wave":"Appears from Wave"} ${m.wave}. • Threat ${E31_THREAT[row[0]].cost.toFixed(1)} · ${e31TagString(row[0])}`]})};

/* ---------- Admin QA + Director readout ---------- */
function e31AdminSpawn(id,count=1){if(!game.player||!ENEMY_DEFINITIONS[id])return false;for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,r=rand(560,250),e=vsxApplyDifficulty(new Enemy(id,game.player.x+Math.cos(a)*r,game.player.y+Math.sin(a)*r,game.difficulty,null));game.enemies.push(e)}return true}
function e31AdminL(en,vi){return VSX.lang==="vi"?vi:en}
function e31EnhanceAdmin(){
 const admin=window.VSX_ADMIN;if(!admin||admin.tab!=="spawn")return;if(document.getElementById("vsxUnifiedEnemySpawner"))return;const sel=document.getElementById("admEnemy");if(sel)for(const o of sel.options)if(E31_META[o.value])o.textContent=e31Name(o.value);
 const root=document.querySelector("#vsxAdminContent .vsxAdminGrid");if(!root)return;let card=document.getElementById("vsxEnemy31AdminCard");if(card)card.remove();card=document.createElement("div");card.className="vsxAdminCard";card.id="vsxEnemy31AdminCard";const st=e31ThreatState();
 card.innerHTML=`<h3>${e31AdminL("SPECIALIST ENEMY QA · +21","QA ENEMY CHUYÊN BIỆT · +21")}</h3><div class="vsxEnemy31AdminGrid">${E31_IDS.map(id=>`<button data-e31="${id}">${VSX.esc(e31Name(id))}<br><small>W${E31_META[id].wave} · T${E31_THREAT[id].cost}</small></button>`).join("")}</div><div class="row" style="margin-top:8px"><button data-e31-all="1">${e31AdminL("SPAWN ALL 21","SPAWN CẢ 21")}</button><button data-e31-safe="1">${e31AdminL("DIRECTOR-SAFE SET","BỘ AN TOÀN DIRECTOR")}</button></div><div class="vsxThreatMeter"><b>THREAT DIRECTOR</b><br>${e31AdminL("Active","Đang dùng")}: ${st.cost.toFixed(1)} / ${st.budget.toFixed(1)}<br>${e31AdminL("Tags","Tag")}: ${Object.entries(st.counts).map(([k,v])=>`${k}:${v}`).join(" · ")||"—"}</div>`;
 root.appendChild(card);card.querySelectorAll("[data-e31]").forEach(b=>b.onclick=()=>e31AdminSpawn(b.dataset.e31,1));card.querySelector("[data-e31-all]").onclick=()=>E31_IDS.forEach(id=>e31AdminSpawn(id));card.querySelector("[data-e31-safe]").onclick=()=>{const ids=["echo_charger","boomerang_reaper","hex_archer","pulse_shepherd","pain_banker","siphon_priest"];ids.forEach(id=>e31AdminSpawn(id))}
}
document.addEventListener("click",e=>{const t=e.target;if(t?.dataset?.adminTab==="spawn"||t?.id==="vsxAdminBtn"||(window.VSX_ADMIN?.open&&window.VSX_ADMIN?.tab==="spawn"))setTimeout(e31EnhanceAdmin,0)});document.addEventListener("keydown",e=>{if(e.code==="F10")setTimeout(e31EnhanceAdmin,0)});

/* ---------- Self-test bridge ---------- */
window.VSX_ENEMY31={
 ids:E31_IDS,meta:E31_META,threat:E31_THREAT,spawn:e31AdminSpawn,
 state:e31ThreatState,allowed:e31Allowed,objects:()=>game.vsxEnemy31Objects||[],
 selfTest(){return{definitions:E31_IDS.every(id=>!!ENEMY_DEFINITIONS[id]),codex:E31_IDS.every(id=>VSX.codexEntries("enemies").some(r=>r[0]===id)),threat:E31_IDS.every(id=>!!E31_THREAT[id]),admin:!!window.VSX_ADMIN}}
};
})();
