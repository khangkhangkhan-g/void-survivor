(function(){
"use strict";
const VSX_ADMIN_TUNE_RECALC_BASE=Player.prototype.recalc;
Player.prototype.recalc=function(){
  VSX_ADMIN_TUNE_RECALC_BASE.call(this);
  const a=window.VSX_ADMIN;
  if(!a)return;
  this.moveSpeed*=Number(a.adminMoveSpeed)||1;
  this.attackSpeed*=Number(a.adminAttackSpeed)||1;
  this.projectileSpeed*=Number(a.adminProjectileSpeed)||1;
};
})();
