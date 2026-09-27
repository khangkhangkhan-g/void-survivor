(function(){
"use strict";

const MB9_REVIVE_SECONDS = 60;

Object.assign(I18N.en,{
  mb9Down:"MB9 DOWN",
  mb9Reviving:"REVIVE",
  mb9Back:"MB9 BACK IN THE FIGHT"
});
Object.assign(I18N.vi,{
  mb9Down:"MB9 GỤC",
  mb9Reviving:"HỒI SINH",
  mb9Back:"MB9 TRỞ LẠI TRẬN"
});

const MB9_DAMAGE_BASE = MbappeAlly.prototype.takeDamage;
MbappeAlly.prototype.takeDamage=function(amount,info={}){
  const wasDead=!!this.dead;
  const out=MB9_DAMAGE_BASE.call(this,amount,info);
  if(!wasDead&&this.dead){
    this.reviveTimer=MB9_REVIVE_SECONDS;
    this.target=null;
    VSX.announce(t("mb9Down"),VSX.lang==="vi"?"HỒI SINH SAU 60 GIÂY":"REVIVES IN 60 SECONDS","#ffd84d");
    game.audio.beep(105,.20,"sawtooth",.03);
  }
  return out;
};

MbappeAlly.prototype._reviveMb9=function(){
  this.dead=false;
  this.reviveTimer=0;
  this.syncHealth(true);
  this.invuln=1.5;
  this.cool=.20;
  this.target=null;
  this.survivalRun=0;
  this.contactTimes?.clear?.();
  this.x=game.player.x+58;
  this.y=game.player.y+38;
  game.spark(this.x,this.y,"#ffd84d",24);
  game.texts.push(new FloatingText(this.x,this.y-48,t("mb9Back"),"#ffd84d",17));
  VSX.announce("MB9",VSX.lang==="vi"?"TRỞ LẠI TRẬN":"BACK IN THE FIGHT","#ffd84d");
  game.audio.beep(520,.13,"triangle",.03);
};

// Core gameplay intentionally stops updating a dead MB9, so the revive clock
// is advanced here. It uses the same gameplay speed multiplier as VVD4.
const MB9_GAME_UPDATE_BASE = Game.prototype.update;
Game.prototype.update=function(dt){
  const out=MB9_GAME_UPDATE_BASE.call(this,dt);
  const a=this.mbappeAlly;
  if(this.state==="PLAYING"&&a?.dead){
    if(!Number.isFinite(a.reviveTimer)||a.reviveTimer<=0)a.reviveTimer=MB9_REVIVE_SECONDS;
    const scaledDt=dt*(VSX_ADMIN?.speed||1);
    a.reviveTimer=Math.max(0,a.reviveTimer-scaledDt);
    if(a.reviveTimer<=0)a._reviveMb9();
  }
  return out;
};

})();
