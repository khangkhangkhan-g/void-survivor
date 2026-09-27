(()=>{
"use strict";
const GOAT_CHARS=new Set(["cr7_goat","m10_goat"]);
const GOAT_SKINS=new Set(["cr7_portugal_7","m10_argentina_10"]);
const vi=()=>VSX?.lang==="vi";
const txt=(en,viText)=>vi()?viText:en;
const isGoatChar=g=>GOAT_CHARS.has(g?.characterId);
const dashBase=g=>4.5*((CHARACTER_DEFINITIONS[g?.characterId]?.mods||{}).dashCooldown||1);

if(CHARACTER_DEFINITIONS.cr7_goat){
  CHARACTER_DEFINITIONS.cr7_goat.mods ||= {};
  CHARACTER_DEFINITIONS.cr7_goat.mods.move=1.5;
  CHARACTER_DEFINITIONS.cr7_goat.desc={
    en:"LEGENDARY — Portugal No. 7 now plays at 1.5× base movement speed and stores a double dash, letting him burst twice before the full recovery window.",
    vi:"LEGENDARY — Số 7 Bồ Đào Nha nay chạy ở tốc độ 1.5× cơ bản và có cơ chế Dash kép, cho phép lướt liên tiếp 2 nhịp trước khi hồi đầy."
  };
}
if(CHARACTER_DEFINITIONS.m10_goat){
  CHARACTER_DEFINITIONS.m10_goat.mods ||= {};
  CHARACTER_DEFINITIONS.m10_goat.mods.move=1.5;
  CHARACTER_DEFINITIONS.m10_goat.desc={
    en:"LEGENDARY — Argentina No. 10 keeps the same 1.5× base movement speed and a stored double dash for rapid slaloms through danger.",
    vi:"LEGENDARY — Số 10 Argentina giữ tốc độ chạy 1.5× cơ bản và có Dash kép để lắt léo xuyên qua vùng nguy hiểm nhanh hơn."
  };
}

const GOAT_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){
  const r=GOAT_INIT_BASE.apply(this,arguments);
  this.vsxGoatDashMax=isGoatChar(this)?2:1;
  this.vsxGoatDashCharges=this.vsxGoatDashMax;
  this.vsxGoatDashRecharge=0;
  return r;
};

const GOAT_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const r=GOAT_UPDATE_BASE.apply(this,arguments);
  if(!this.player) return r;
  const isGoat=isGoatChar(this);
  const max=isGoat?2:1;
  if(this.vsxGoatDashMax!==max){
    this.vsxGoatDashMax=max;
    if(this.vsxGoatDashCharges==null) this.vsxGoatDashCharges=max;
    this.vsxGoatDashCharges=Math.min(this.vsxGoatDashCharges,max);
    if(this.vsxGoatDashCharges<0) this.vsxGoatDashCharges=0;
    if(!isGoat && this.vsxGoatDashCharges===0) this.vsxGoatDashCharges=1;
  }
  if(isGoat){
    if(this.vsxGoatDashCharges==null) this.vsxGoatDashCharges=max;
    if(this.vsxGoatDashCharges<max){
      if(!(this.vsxGoatDashRecharge>0)) this.vsxGoatDashRecharge=dashBase(this);
      this.vsxGoatDashRecharge=Math.max(0,this.vsxGoatDashRecharge-dt);
      if(this.vsxGoatDashRecharge<=0){
        this.vsxGoatDashCharges=Math.min(max,this.vsxGoatDashCharges+1);
        this.vsxGoatDashRecharge=this.vsxGoatDashCharges<max?dashBase(this):0;
      }
    }else this.vsxGoatDashRecharge=0;
    this.dashCooldown=this.vsxGoatDashCharges>0?0:(this.vsxGoatDashRecharge||0);
  }else{
    this.vsxGoatDashRecharge=0;
    this.vsxGoatDashCharges=1;
    this.vsxGoatDashMax=1;
  }
  return r;
};

const GOAT_TRYDASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){
  if(!isGoatChar(this)) return GOAT_TRYDASH_BASE.apply(this,arguments);
  if(this.state!=="PLAYING"||this.dashTimer>0) return;
  const max=2;
  if(this.vsxGoatDashCharges==null) this.vsxGoatDashCharges=max;
  if(this.vsxGoatDashCharges<=0) return;
  let dx=0,dy=0;
  if(this.input.has("KeyW")||this.input.has("ArrowUp")) dy--;
  if(this.input.has("KeyS")||this.input.has("ArrowDown")) dy++;
  if(this.input.has("KeyA")||this.input.has("ArrowLeft")) dx--;
  if(this.input.has("KeyD")||this.input.has("ArrowRight")) dx++;
  if(dx||dy) this.lastMoveDir=normalize(dx,dy);
  const c=this.player?.characterMods||CHARACTER_DEFINITIONS[this.characterId]?.mods||{};
  this.dashDir={...(this.lastMoveDir||{x:1,y:0})};
  this.dashTimer=.20;
  this.player.invuln=Math.max(this.player.invuln,.16*(c.dashIFrame||1));
  this.stats.dashes++;
  this.vsxGoatDashCharges=Math.max(0,this.vsxGoatDashCharges-1);
  if(this.vsxGoatDashCharges<max && !(this.vsxGoatDashRecharge>0)) this.vsxGoatDashRecharge=dashBase(this);
  this.dashCooldown=this.vsxGoatDashCharges>0?0:(this.vsxGoatDashRecharge||dashBase(this));
  this.audio?.beep?.(530,.05,"sine",.018);
  if(this.vsxGoatDashCharges>0&&this.texts) this.texts.push(new FloatingText(this.player.x,this.player.y-34,txt("DOUBLE DASH READY","LƯỚT KÉP SẴN SÀNG"),this.characterId==="cr7_goat"?"#f0c85a":"#8fe3ff",10));
};

const GOAT_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force){
  const r=GOAT_HUD_BASE.apply(this,arguments);
  if(!isGoatChar(this)) return r;
  const t=document.getElementById("vsxDashText"),f=document.getElementById("vsxDashFill");
  const cur=Math.max(0,this.vsxGoatDashCharges??2),max=this.vsxGoatDashMax||2;
  if(t){
    const clean=(t.textContent||"").replace(/\s*•\s*\d+\/\d+$/,'');
    t.textContent=`${clean} • ${cur}/${max}`;
  }
  if(f){
    let pct=(cur/max)*100;
    if(cur<=0&&this.vsxGoatDashRecharge>0){ pct=100*Math.max(0,1-this.vsxGoatDashRecharge/dashBase(this)); }
    f.style.width=`${Math.max(0,Math.min(100,pct))}%`;
  }
  return r;
};

function drawGoatPattern(g,p,skinId){
  const r=p.radius+1.2;
  g.save();
  g.translate(p.x,p.y);
  g.beginPath();
  g.arc(0,0,r,0,Math.PI*2);
  g.clip();
  if(skinId==='cr7_portugal_7'){
    g.fillStyle='#a10d16';
    g.fillRect(-r,-r,r*2,r*2);
    g.beginPath();
    g.moveTo(-r,r);
    g.lineTo(r,r);
    g.lineTo(r,r*0.15);
    g.closePath();
    g.fillStyle='#0a5b2f';
    g.fill();
    const sheen=g.createLinearGradient(-r,-r,r,r);
    sheen.addColorStop(0,'rgba(255,255,255,.18)');
    sheen.addColorStop(.5,'rgba(255,255,255,0)');
    sheen.addColorStop(1,'rgba(0,0,0,.16)');
    g.fillStyle=sheen;
    g.fillRect(-r,-r,r*2,r*2);
    g.fillStyle='#d6b240';
    g.font=`900 ${Math.max(12,r*1.00)}px Arial`;
    g.textAlign='center';
    g.textBaseline='middle';
    g.fillText('7',0,r*0.10);
    if(r>=13){
      g.font=`800 ${Math.max(4,r*0.28)}px Arial`;
      g.fillText('RONALDO',0,-r*0.62);
    }
    g.strokeStyle='rgba(214,178,64,.85)';
    g.lineWidth=2.6;
    g.shadowBlur=12;
    g.shadowColor='rgba(214,178,64,.75)';
    g.beginPath(); g.arc(0,0,r+7,0,Math.PI*2); g.stroke();
  }else{
    g.fillStyle='#f5f8fb';
    g.fillRect(-r,-r,r*2,r*2);
    const stripeW=r*0.44;
    g.fillStyle='#96d9ff';
    g.fillRect(-r*0.82,-r,stripeW,r*2);
    g.fillRect(-stripeW/2,-r,stripeW*0.58,r*2);
    g.fillRect(r*0.32,-r,stripeW,r*2);
    const sheen=g.createLinearGradient(-r,-r,r,r);
    sheen.addColorStop(0,'rgba(255,255,255,.18)');
    sheen.addColorStop(.62,'rgba(255,255,255,0)');
    sheen.addColorStop(1,'rgba(0,0,0,.10)');
    g.fillStyle=sheen;
    g.fillRect(-r,-r,r*2,r*2);
    g.fillStyle='#121212';
    g.font=`900 ${Math.max(11,r*0.92)}px Arial`;
    g.textAlign='center';
    g.textBaseline='middle';
    g.fillText('10',0,r*0.08);
    if(r>=13){
      g.font=`800 ${Math.max(4,r*0.30)}px Arial`;
      g.fillText('MESSI',0,-r*0.62);
    }
    g.strokeStyle='rgba(117,220,255,.82)';
    g.lineWidth=2.6;
    g.shadowBlur=12;
    g.shadowColor='rgba(117,220,255,.72)';
    g.beginPath(); g.arc(0,0,r+7,0,Math.PI*2); g.stroke();
    if(typeof gpPackageOwned==='function' && gpPackageOwned()){
      g.strokeStyle='rgba(67,196,121,.38)';
      g.lineWidth=1.2;
      g.beginPath(); g.arc(0,0,r+12+Math.sin((window.game?.time||0)*2)*1.5,0,Math.PI*2); g.stroke();
    }
  }
  g.restore();
}

const GOAT_RENDER_BASE=Player.prototype.render;
Player.prototype.render=function(g){
  GOAT_RENDER_BASE.apply(this,arguments);
  const skinId=VSX.save?.loadout?.skin;
  if(!GOAT_SKINS.has(skinId)) return;
  drawGoatPattern(g,this,skinId);
};
})();
