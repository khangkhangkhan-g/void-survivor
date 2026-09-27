(function(){
 const hudRoot=document.getElementById('hud');
 if(!hudRoot || document.getElementById('vsxMinimapWrap')) return;
 hudRoot.insertAdjacentHTML('beforeend', `
   <div id="vsxMinimapWrap">
     <div id="vsxMinimapHead"><b id="vsxMinimapTitle">TACTICAL MINIMAP</b><span id="vsxMinimapToggle">N</span></div>
     <canvas id="vsxMinimapCanvas" width="202" height="202"></canvas>
     <div id="vsxMinimapMeta"></div>
     <div id="vsxMinimapLegend"></div>
   </div>`);
 const wrap=document.getElementById('vsxMinimapWrap');
 const cvs=document.getElementById('vsxMinimapCanvas');
 const mctx=cvs.getContext('2d');
 const titleEl=document.getElementById('vsxMinimapTitle');
 const metaEl=document.getElementById('vsxMinimapMeta');
 const legendEl=document.getElementById('vsxMinimapLegend');
 const MAP_RANGE=1250;
 game.showMinimap = game.showMinimap !== false;
 if(game.input?.gameKeys) game.input.gameKeys.add('KeyN');
 
 function mmText(en,vi){return VSX?.lang==='vi'?vi:en}
 function mapLayers(){const q=VSX?.save?.settings||{};return{boss:q.minimapLayerBoss!==false,elites:q.minimapLayerElites!==false,enemies:!!q.minimapLayerEnemies,objectives:q.minimapLayerObjectives!==false,objects:q.minimapLayerObjects!==false,allies:q.minimapLayerAllies!==false,loot:q.minimapLayerLoot!==false}}
 function iconChip(shape,color,label){
   return `<span class="vsxMapChip"><i class="vsxMapDot ${shape}" style="color:${color};background:${shape==='triangle'?'transparent':color}"></i>${label}</span>`;
 }
 function refreshStaticText(){
   titleEl.textContent = mmText('TACTICAL MINIMAP','BẢN ĐỒ CHIẾN THUẬT');const l=mapLayers(),chips=[];
   if(l.boss)chips.push(iconChip('diamond','#ff637b',mmText('Boss','Boss')));if(l.elites)chips.push(iconChip('','#ff9b52',mmText('Elite','Elite')));if(l.enemies)chips.push(iconChip('','#ff667f',mmText('Enemy','Địch')));if(l.loot)chips.push(iconChip('square','#72f0bd',mmText('Loot','Loot')));if(l.objectives)chips.push(iconChip('triangle','#8f7bff',mmText('Objective','Mục tiêu')));if(l.objects)chips.push(iconChip('triangle','#63e3a3',mmText('Object','Object')));if(l.allies)chips.push(iconChip('', '#6fe5ff', mmText('Ally','Đồng minh')));legendEl.innerHTML=chips.join('');
 }
 refreshStaticText();
 
 function drawGrid(){
   const w=cvs.width,h=cvs.height;
   mctx.clearRect(0,0,w,h);
   mctx.fillStyle='rgba(5,13,24,.96)';
   mctx.fillRect(0,0,w,h);
   mctx.save();
   mctx.strokeStyle='rgba(102,180,255,.08)';
   mctx.lineWidth=1;
   for(let i=18;i<w;i+=22){mctx.beginPath();mctx.moveTo(i,0);mctx.lineTo(i,h);mctx.stroke()}
   for(let i=18;i<h;i+=22){mctx.beginPath();mctx.moveTo(0,i);mctx.lineTo(w,i);mctx.stroke()}
   mctx.restore();
 }
 function project(px,py,ox,oy){
   const w=cvs.width,h=cvs.height,cx=w/2,cy=h/2,maxR=Math.min(w,h)/2-14;
   let dx=ox-px, dy=oy-py;
   let sx = dx / MAP_RANGE * maxR;
   let sy = dy / MAP_RANGE * maxR;
   const d=Math.hypot(sx,sy);
   let edge=false;
   if(d>maxR){const k=maxR/d; sx*=k; sy*=k; edge=true;}
   return {x:cx+sx,y:cy+sy,edge,dist:Math.hypot(dx,dy),cx,cy,maxR};
 }
 function drawRing(cx,cy,r,col,a=1,line=1){mctx.save();mctx.globalAlpha=a;mctx.strokeStyle=col;mctx.lineWidth=line;mctx.beginPath();mctx.arc(cx,cy,r,0,Math.PI*2);mctx.stroke();mctx.restore()}
 function drawMarker(m){
   const p=project(game.player.x,game.player.y,m.x,m.y);
   const x=p.x,y=p.y,s=m.size||4;
   mctx.save();
   mctx.globalAlpha = p.edge?.68:1;
   mctx.shadowBlur = 10;
   mctx.shadowColor = m.color;
   mctx.fillStyle = m.color;
   mctx.strokeStyle = m.outline || 'rgba(255,255,255,.8)';
   mctx.lineWidth = 1;
   if(m.shape==='diamond'){
     mctx.translate(x,y);mctx.rotate(Math.PI/4);mctx.fillRect(-s,-s,s*2,s*2);mctx.strokeRect(-s,-s,s*2,s*2)
   }else if(m.shape==='square'){
     mctx.fillRect(x-s,y-s,s*2,s*2);mctx.strokeRect(x-s,y-s,s*2,s*2)
   }else if(m.shape==='triangle'){
     mctx.beginPath();mctx.moveTo(x,y-s-1);mctx.lineTo(x+s+1,y+s);mctx.lineTo(x-s-1,y+s);mctx.closePath();mctx.fill();mctx.stroke();
   }else if(m.shape==='cross'){
     mctx.lineWidth=2; mctx.beginPath();mctx.moveTo(x-s,y);mctx.lineTo(x+s,y);mctx.moveTo(x,y-s);mctx.lineTo(x,y+s);mctx.stroke();
   }else{
     mctx.beginPath();mctx.arc(x,y,s,0,Math.PI*2);mctx.fill();mctx.stroke();
   }
   if(m.label){
     mctx.shadowBlur = 0; mctx.fillStyle='rgba(225,243,255,.96)';mctx.font='700 8px Arial';mctx.textAlign='center';
     mctx.fillText(m.label,x,y-(m.shape==='triangle'?s+6:s+7));
   }
   mctx.restore();
   return p;
 }
 function collectLimited(src,max,mapFn){
   if(!src||!src.length) return [];
   const p=game.player;
   const arr=[];
   for(const item of src){if(!item||item.dead) continue; arr.push(item)}
   arr.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
   const out=[];
   for(let i=0;i<arr.length && i<max;i++){const r=mapFn(arr[i]); if(r) out.push(r)}
   return out;
 }
 function minimapItems(){
   const g=game,out=[],l=mapLayers();if(!g.player)return out;
   if(l.boss&&g.boss&&!g.boss.dead)out.push({kind:'boss',x:g.boss.x,y:g.boss.y,color:'#ff637b',shape:'diamond',size:5,label:'B'});
   if(l.boss&&g.miniBoss&&!g.miniBoss.dead)out.push({kind:'boss',x:g.miniBoss.x,y:g.miniBoss.y,color:'#ff9b52',shape:'diamond',size:4,label:'M'});
   if(l.elites)out.push(...collectLimited((g.enemies||[]).filter(e=>e.elite&&!e.isBoss&&!e.isMiniBoss&&!e.specialId),8,e=>({kind:'elite',x:e.x,y:e.y,color:'#ff9b52',shape:'dot',size:2.6,label:'E'})));
   if(l.enemies)out.push(...collectLimited((g.enemies||[]).filter(e=>!e.elite&&!e.isBoss&&!e.isMiniBoss&&!e.specialId&&!e.isCaptive),14,e=>({kind:'enemy',x:e.x,y:e.y,color:'#ff667f',shape:'dot',size:1.7,label:''})));
   if(l.allies){if(g.mbappeAlly&&!g.mbappeAlly.dead)out.push({kind:'ally',x:g.mbappeAlly.x,y:g.mbappeAlly.y,color:'#ffd84d',shape:'dot',size:4,label:'MB'});if(g.contractAlly&&!g.contractAlly.dead&&!g.contractAlly.leave)out.push({kind:'ally',x:g.contractAlly.x,y:g.contractAlly.y,color:g.contractAlly.def?.color||'#6fe5ff',shape:'dot',size:4,label:(g.contractAlly.id||'A').slice(0,2).toUpperCase()});for(const a of(g.storyAllies||[]))if(a&&!a.dead)out.push({kind:'ally',x:a.x,y:a.y,color:a.def?.color||'#6fe5ff',shape:'dot',size:4,label:(a.def?.glyph||a.id?.slice(0,1)||'A')});for(const w of(g.player.weapons||[]))if(w.id==='virgil_vandijk'&&w.vvdAlly&&!w.vvdAlly.dead)out.push({kind:'ally',x:w.vvdAlly.x,y:w.vvdAlly.y,color:'#ff6868',shape:'dot',size:4,label:'4'})}
   if(l.loot){out.push(...collectLimited(g.pickups,12,p=>({kind:'loot',x:p.x,y:p.y,color:p.type==='golden_boost'?'#ffd84d':p.type==='shield'?'#9ab7ff':p.type==='frenzy'?'#ff9a5a':'#d38dff',shape:'square',size:p.type==='golden_boost'?4:3,label:''})));out.push(...collectLimited(g.chests,6,c=>({kind:'loot',x:c.x,y:c.y,color:'#72f0bd',shape:'square',size:4,label:'C'})));out.push(...collectLimited((g.gems||[]).filter(q=>q.value>=20),6,q=>({kind:'loot',x:q.x,y:q.y,color:'#54ef8c',shape:'diamond',size:3,label:''})))}
   if(l.objects)out.push(...collectLimited((g.worldObjects||[]).filter(o=>o.type!=='trial_portal'),10,o=>({kind:'object',x:o.x,y:o.y,color:o.type==='goal'?'#ffffff':o.type==='fountain'?'#63e3a3':o.type==='generator'?'#7deaff':'#66d9c8',shape:'triangle',size:3.8,label:o.type==='goal'?'G':o.type==='shrine'?'S':o.type==='fountain'?'F':o.type==='generator'?'P':'O'})));
   if(l.objectives){out.push(...collectLimited((g.worldObjects||[]).filter(o=>o.type==='trial_portal'),5,o=>({kind:'objective',x:o.x,y:o.y,color:'#9f8cff',shape:'triangle',size:4,label:'T'})));out.push(...collectLimited((g.recruitObjects||[]).filter(o=>!(o.minimapHidden&&!o.revealed)),8,o=>({kind:'objective',x:o.x,y:o.y,color:o.type==='omega_core'?'#ffb15d':'#b47cff',shape:'triangle',size:4,label:o.type==='chrono_fragment'?'C':o.type==='omega_core'?'Ω':'R'})));out.push(...collectLimited((g.healingZones||[]),4,z=>({kind:'objective',x:z.x,y:z.y,color:'#79ffb0',shape:'triangle',size:4,label:'+'})))}
   return out;
 }
 function nearestDistance(arr){
   if(!arr.length||!game.player) return null;
   let best=Infinity;
   for(const m of arr){const d=Math.hypot(m.x-game.player.x,m.y-game.player.y); if(d<best) best=d}
   return isFinite(best)?Math.round(best):null;
 }
 function renderMinimap(){
   if(!game.player || !game.showMinimap || !hud.classList.contains('active')){wrap.style.display='none';return}
   wrap.style.display='block';
   if(window.VSX_SETTINGS_V5&&!VSX_SETTINGS_V5.minimapShouldRender())return;
   wrap.dataset.vsxMapFrame=String((Number(wrap.dataset.vsxMapFrame)||0)+1);
   const layerSig=JSON.stringify(mapLayers());if(wrap.dataset.lang!==String(VSX?.lang||'en')||wrap.dataset.layers!==layerSig){wrap.dataset.lang=String(VSX?.lang||'en');wrap.dataset.layers=layerSig;refreshStaticText();}
   drawGrid();
   const w=cvs.width,h=cvs.height,cx=w/2,cy=h/2,maxR=Math.min(w,h)/2-14;
   mctx.save();
   drawRing(cx,cy,maxR,'rgba(117,214,255,.22)',1,1.4);
   drawRing(cx,cy,maxR*.66,'rgba(117,214,255,.10)',1,1);
   drawRing(cx,cy,maxR*.33,'rgba(117,214,255,.07)',1,1);
   mctx.strokeStyle='rgba(130,197,255,.11)';
   mctx.beginPath();mctx.moveTo(cx,10);mctx.lineTo(cx,h-10);mctx.moveTo(10,cy);mctx.lineTo(w-10,cy);mctx.stroke();
   mctx.restore();
   const items=minimapItems(),byKind={};for(const q of items)byKind[q.kind||'other']=(byKind[q.kind||'other']||0)+1;window.VSX_MINIMAP_LAYER_QA={version:'1.0.0',layers:mapLayers(),items:items.length,byKind,lastAt:performance.now()};
   for(const m of items) drawMarker(m);
   const dir=game.lastMoveDir||{x:1,y:0};
   mctx.save();
   mctx.translate(cx,cy); mctx.rotate(Math.atan2(dir.y,dir.x));
   mctx.fillStyle='#6fe5ff'; mctx.shadowBlur=12; mctx.shadowColor='#6fe5ff';
   mctx.beginPath(); mctx.moveTo(9,0); mctx.lineTo(-6,-5); mctx.lineTo(-2,0); mctx.lineTo(-6,5); mctx.closePath(); mctx.fill();
   mctx.shadowBlur=0; mctx.fillStyle='#0d1723'; mctx.beginPath();mctx.arc(0,0,4.5,0,Math.PI*2);mctx.fill();
   mctx.strokeStyle='#d7ffff'; mctx.lineWidth=2; mctx.beginPath();mctx.arc(0,0,5.8,0,Math.PI*2);mctx.stroke();
   mctx.restore();
   if(game.worldEvent){
     mctx.save();mctx.strokeStyle='rgba(255,174,87,.95)';mctx.lineWidth=2; mctx.strokeRect(6,6,w-12,h-12);mctx.restore();
   }
   const bosses=items.filter(x=>x.kind==='boss');
   const boosts=items.filter(x=>x.kind==='loot'&&x.shape==='square'&&!String(x.label).startsWith('C'));
   const loots=items.filter(x=>x.kind==='loot');
   const events=items.filter(x=>x.kind==='objective'||x.kind==='object');
   const allies=items.filter(x=>x.kind==='ally');
   const bd=nearestDistance(bosses), ed=nearestDistance(events), ld=nearestDistance(loots), ad=nearestDistance(allies), pd=nearestDistance(boosts);
   const fmt=v=>v==null?'—':`${v}`;
   const line1 = `${mmText('Range','Tầm quét')} ${MAP_RANGE} • ${mmText('Boss','Boss')} ${fmt(bd)} • ${mmText('Boost','Buff')} ${fmt(pd)}`;
   const line2 = `${mmText('Allies','Đồng minh')} ${fmt(ad)} • ${mmText('Event','Sự kiện')} ${fmt(ed)} • ${mmText('Loot','Loot')} ${fmt(ld)}`;
   const eventText = game.worldEvent ? `<span style="color:#ffcf8d">${mmText('Active event','Sự kiện hiện tại')}: ${VSX.esc(WORLD_EVENT_DEFINITIONS[game.worldEvent.id].name[VSX.lang])}</span><br>` : '';
   const baseInfo=`${line1}<br>${line2}`,baseHtml=`${eventText}${baseInfo}`,now=performance.now();wrap.dataset.vsxBaseMeta=baseInfo;if(!wrap._vsxMetaNext||now>=wrap._vsxMetaNext){if(metaEl.innerHTML!==baseHtml)metaEl.innerHTML=baseHtml;wrap._vsxMetaNext=now+200;}
 }
 const MINIMAP_RENDER_BASE=Game.prototype.render;
 Game.prototype.render=function(){const r=MINIMAP_RENDER_BASE.call(this);renderMinimap();return r};
 const MINIMAP_HANDLE_BASE=Game.prototype.handleKey;
 Game.prototype.handleKey=function(code){if(code==='KeyN'){this.showMinimap=!this.showMinimap;return}return MINIMAP_HANDLE_BASE.call(this,code)};
 const MINIMAP_START_BASE=Game.prototype.start;
 Game.prototype.start=function(){const r=MINIMAP_START_BASE.call(this);this.showMinimap = this.showMinimap !== false;return r};
})();
