(function(){
'use strict';
const RL_BASE=Game.prototype.renderLightning;
Game.prototype.renderLightning=function(l){
  if(!l)return;
  if(!Array.isArray(l.pts)){
    if(Number.isFinite(l.x1)&&Number.isFinite(l.y1)&&Number.isFinite(l.x2)&&Number.isFinite(l.y2)) l.pts=[{x:l.x1,y:l.y1},{x:l.x2,y:l.y2}];
    else return;
  }
  if(l.pts.length<2)return;
  if(!Number.isFinite(l.life))l.life=.12;
  if(!Number.isFinite(l.max)||l.max<=0)l.max=Math.max(.01,l.life);
  return RL_BASE.call(this,l);
};
const CLEAN_BASE=Game.prototype.cleanup;
Game.prototype.cleanup=function(){
  // Drop malformed transient VFX instead of letting one bad entity break the render loop.
  if(Array.isArray(this.lightning))this.lightning=this.lightning.filter(l=>l&&Number.isFinite(l.life)&&(Array.isArray(l.pts)||(Number.isFinite(l.x1)&&Number.isFinite(l.y1)&&Number.isFinite(l.x2)&&Number.isFinite(l.y2))));
  if(Array.isArray(this.beams))this.beams=this.beams.filter(b=>b&&Number.isFinite(b.life)&&Number.isFinite(b.x1)&&Number.isFinite(b.y1)&&Number.isFinite(b.x2)&&Number.isFinite(b.y2));
  return CLEAN_BASE.apply(this,arguments);
};
})();
