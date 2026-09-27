/* pacing/statistics fix */
SpawnManager.prototype.spawnBoss=function(){
 if(game.worldEvent||game.miniBoss||game.time-game.lastMajorEncounterTime<15){game.pendingBossSpawn=true;return}
 game.pendingBossSpawn=false;VSX_BASE_SPAWN_BOSS.call(this);if(game.boss){vsxApplyDifficulty(game.boss);game.boss.vsxPhase=1;game.boss.vsxAbilityTimer=5;game.lastMajorEncounterTime=game.time;vsxDiscover("bosses","crimson_titan")}
};
const VSX_UPDATE_WITH_PENDING_BOSS=Game.prototype.update;
Game.prototype.update=function(dt){VSX_UPDATE_WITH_PENDING_BOSS.call(this,dt);if(this.pendingBossSpawn&&!this.worldEvent&&!this.miniBoss&&!this.boss&&this.time-this.lastMajorEncounterTime>=15&&this.state==="PLAYING"){this.pendingBossSpawn=false;VSX_BASE_SPAWN_BOSS.call(this.spawnManager);if(this.boss){vsxApplyDifficulty(this.boss);this.boss.vsxPhase=1;this.boss.vsxAbilityTimer=5;this.lastMajorEncounterTime=this.time;vsxDiscover("bosses","crimson_titan")}}};
function vsxBlockStatWrap(proto,name){const base=proto[name];if(!base)return;proto[name]=function(...args){const before=game?.enemyProjectiles?.filter(p=>!p.dead).length||0;const r=base.apply(this,args);const after=game?.enemyProjectiles?.filter(p=>!p.dead).length||0;if(game?.stats&&after<before)game.stats.projectilesBlocked+=before-after;return r}}
vsxBlockStatWrap(WeaponInstance.prototype,"updateAegis");vsxBlockStatWrap(WeaponInstance.prototype,"updateTrophyShield");vsxBlockStatWrap(BunkerEffect.prototype,"update");
