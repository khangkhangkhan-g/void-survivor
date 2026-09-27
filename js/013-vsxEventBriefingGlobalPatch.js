(function(){
"use strict";
Object.assign(I18N.en,{eventBriefings:"World Event briefings",eventBriefingsDesc:"Pause before each naturally spawned World Event and show a short tactical briefing. Admin-forced events start immediately."});
Object.assign(I18N.vi,{eventBriefings:"Hướng dẫn trước World Event",eventBriefingsDesc:"Tạm dừng trước mỗi World Event xuất hiện tự nhiên và hiện hướng dẫn chiến thuật ngắn. Sự kiện ép từ Admin sẽ bắt đầu ngay."});
if(VSX.save?.settings){VSX.save.settings.eventBriefings??=true;vsxSave?.()}
// Hard freeze guard: briefing time is reading time, not simulation time.
const BRIEF_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){if(this.state==="EVENT_BRIEFING")return;return BRIEF_UPDATE_BASE.call(this,dt)};
// Conflict guard: no unrelated mini-boss or recruitment may start during an Event briefing/event/minigame.
const BRIEF_MINI_BASE=Game.prototype.spawnMiniBoss;
Game.prototype.spawnMiniBoss=function(){if(this.worldEvent||this.state==="EVENT_BRIEFING"||this.state==="EVENT_MINIGAME")return;return BRIEF_MINI_BASE.call(this)};
const BRIEF_RECRUIT_BASE=Game.prototype.spawnRecruitChallenge;
Game.prototype.spawnRecruitChallenge=function(id){return BRIEF_RECRUIT_BASE.call(this,id)};
if(typeof startTrial==="function"){const BRIEF_TRIAL_BASE=startTrial;startTrial=function(id){return BRIEF_TRIAL_BASE(id)}}
// Remove font-fallback glyphs from persistent HUD labels generated after load.
const FONT_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force=false){return FONT_HUD_BASE.call(this,force)};
})();
