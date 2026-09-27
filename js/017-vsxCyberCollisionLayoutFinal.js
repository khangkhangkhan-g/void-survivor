(function(){
"use strict";
const imp=(el,k,v)=>{if(el)el.style.setProperty(k,v,'important')};
function visible(el){return !!el&&getComputedStyle(el).display!=='none'&&el.getClientRects().length>0}
function applyCyberLayout(){
  const hudEl=document.getElementById('hud');if(!hudEl?.classList.contains('active'))return;
  const vw=innerWidth,mobile=vw<=720,mid=vw<=930;
  const stats=document.getElementById('statsHud'),cur=document.getElementById('vsxCurrencyHud'),inv=document.getElementById('inventoryHud'),timer=document.getElementById('timerHud'),boss=document.getElementById('bossWrap'),evt=document.getElementById('vsxEventHud'),mini=document.getElementById('vsxMiniBossHud'),ally=document.getElementById('vsxAllyHud'),act=document.getElementById('vsxActionHud'),map=document.getElementById('vsxMinimapWrap'),dock=document.getElementById('vsxWeaponDock'),xp=document.getElementById('xpWrap');
  if(mobile){
    imp(stats,'left','8px');imp(stats,'top','8px');imp(stats,'width','174px');imp(stats,'min-width','174px');
    imp(cur,'right','8px');imp(cur,'top','8px');imp(cur,'width','174px');
    imp(inv,'display','none');imp(ally,'display','none');
    imp(timer,'left','50%');imp(timer,'right','auto');imp(timer,'width','220px');imp(timer,'min-width','0');imp(timer,'transform','translateX(-50%)');
    const topBottom=Math.max(stats?.getBoundingClientRect().bottom||0,cur?.getBoundingClientRect().bottom||0);imp(timer,'top',Math.ceil(topBottom+8)+'px');
    imp(act,'left','8px');imp(act,'bottom','42px');imp(act,'width','168px');imp(act,'min-width','0');
    imp(map,'right','8px');imp(map,'bottom','42px');imp(map,'width','150px');
    imp(dock,'left','12px');imp(dock,'right','12px');imp(dock,'bottom','222px');imp(dock,'width','auto');imp(dock,'transform','none');
    imp(xp,'left','8px');imp(xp,'right','8px');imp(xp,'bottom','12px');imp(xp,'width','auto');imp(xp,'transform','none');
  }else if(mid){
    imp(stats,'left','14px');imp(stats,'top','14px');imp(stats,'width','220px');imp(stats,'min-width','220px');
    imp(cur,'right','14px');imp(cur,'top','14px');imp(cur,'width','220px');imp(inv,'display','none');imp(ally,'display','none');
    imp(timer,'left','50%');imp(timer,'right','auto');imp(timer,'top','14px');imp(timer,'width','300px');imp(timer,'min-width','0');imp(timer,'transform','translateX(-50%)');
    imp(act,'left','14px');imp(act,'bottom','44px');imp(act,'width','220px');imp(act,'min-width','0');imp(map,'right','14px');imp(map,'bottom','44px');imp(map,'width','180px');
    imp(dock,'left','50%');imp(dock,'right','auto');imp(dock,'bottom','44px');imp(dock,'width','min(520px,52vw)');imp(dock,'transform','translateX(-50%)');
    imp(xp,'left','50%');imp(xp,'right','auto');imp(xp,'bottom','14px');imp(xp,'width','min(520px,52vw)');imp(xp,'transform','translateX(-50%)');
  }else{
    const leftW=vw<1180?236:278,rightW=vw<1180?236:288;
    imp(stats,'left','16px');imp(stats,'top','16px');imp(stats,'width',leftW+'px');imp(stats,'min-width',leftW+'px');
    imp(cur,'right','16px');imp(cur,'top','16px');imp(cur,'width',rightW+'px');
    imp(inv,'display','block');imp(inv,'right','16px');imp(inv,'top','99px');imp(inv,'width',rightW+'px');imp(inv,'max-height','35vh');
    imp(timer,'left','50%');imp(timer,'right','auto');imp(timer,'top','16px');imp(timer,'width',vw<1180?'360px':'510px');imp(timer,'min-width','0');imp(timer,'transform','translateX(-50%)');
    imp(ally,'display','block');imp(ally,'left','16px');imp(ally,'top','264px');imp(ally,'width',leftW+'px');
    imp(act,'left','16px');imp(act,'bottom','48px');imp(act,'width',leftW+'px');imp(map,'right','16px');imp(map,'bottom','50px');imp(map,'width',vw<1180?'205px':'230px');
    imp(dock,'left','50%');imp(dock,'right','auto');imp(dock,'bottom','42px');imp(dock,'width',vw<1180?'min(600px,48vw)':'min(760px,54vw)');imp(dock,'transform','translateX(-50%)');
    imp(xp,'left','50%');imp(xp,'right','auto');imp(xp,'bottom','14px');imp(xp,'width',vw<1180?'min(600px,48vw)':'min(760px,54vw)');imp(xp,'transform','translateX(-50%)');
  }
  // Stack timer -> boss -> event -> miniboss using actual rendered heights.
  const tr=timer?.getBoundingClientRect();let y=tr?Math.ceil(tr.bottom+8):(mobile?140:90);
  if(boss){imp(boss,'top',y+'px');if(visible(boss))y=Math.ceil(boss.getBoundingClientRect().bottom+8)}
  if(evt){imp(evt,'top',y+'px');if(visible(evt))y=Math.ceil(evt.getBoundingClientRect().bottom+8)}
  if(mini){imp(mini,'top',y+'px')}
}
if(typeof vsxLayoutHUD==='function'){
  // Replace the legacy layout function rather than chaining it; chaining would make ResizeObserver
  // bounce between two geometries and can create a resize loop.
  vsxLayoutHUD=function(){applyCyberLayout()};
}
if(typeof Game!=='undefined'&&Game.prototype){
  const base=Game.prototype.updateHUD;
  Game.prototype.updateHUD=function(){const r=base.apply(this,arguments);applyCyberLayout();return r};
}
addEventListener('resize',()=>requestAnimationFrame(applyCyberLayout));
requestAnimationFrame(applyCyberLayout);
window.VSX_APPLY_CYBER_LAYOUT=applyCyberLayout;
})();
