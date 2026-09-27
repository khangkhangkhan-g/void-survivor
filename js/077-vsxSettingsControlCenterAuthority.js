(function(){
'use strict';
const TAG='[VSX SETTINGS CONTROL CENTER]';
const L=(en,vi)=>VSX.lang==='vi'?vi:en;
const HUD_PRESETS={
 minimal:{hudDensity:'minimal',hudOpacity:.88,allyPanel:'auto',minimapDetail:'minimal',objectLabels:'off',smartHud:true,autoCollisionGuard:true,bossFocusMode:true,minigameFocusMode:true,combatTextDensity:'essential',hostileProjectileOutline:'high',minimapLayerBoss:true,minimapLayerAllies:false,minimapLayerLoot:false,minimapLayerObjects:false,minimapLayerObjectives:true,minimapLayerEnemies:false,minimapLayerElites:true},
 balanced:{hudDensity:'compact',hudOpacity:.88,allyPanel:'auto',minimapDetail:'normal',objectLabels:'nearby',smartHud:true,autoCollisionGuard:true,bossFocusMode:true,minigameFocusMode:true,combatTextDensity:'smart',hostileProjectileOutline:'soft',minimapLayerBoss:true,minimapLayerAllies:true,minimapLayerLoot:true,minimapLayerObjects:true,minimapLayerObjectives:true,minimapLayerEnemies:false,minimapLayerElites:true},
 tactical:{hudDensity:'detailed',hudOpacity:1,allyPanel:'3',minimapDetail:'detailed',objectLabels:'nearby',smartHud:true,autoCollisionGuard:true,bossFocusMode:true,minigameFocusMode:true,combatTextDensity:'smart',hostileProjectileOutline:'high',minimapLayerBoss:true,minimapLayerAllies:true,minimapLayerLoot:true,minimapLayerObjects:true,minimapLayerObjectives:true,minimapLayerEnemies:true,minimapLayerElites:true}
};

const EXPERIENCE_PROFILES={
 cinematic:{playerVisibility:'soft',smartAllyFade:false,allyVisualDensity:'full',hostileProjectilePriority:'high',damageNumberStyle:'individual',bossClarityMode:'smart',minigameTransitionGrace:'standard',adaptivePerformance:'off',screenShake:1,particleDensity:'high',effectsQuality:'high',combatClarity:false},
 balanced:{playerVisibility:'soft',smartAllyFade:true,allyVisualDensity:'reduced',hostileProjectilePriority:'high',damageNumberStyle:'aggregate',bossClarityMode:'smart',minigameTransitionGrace:'safe',adaptivePerformance:'auto',screenShake:.6,particleDensity:'balanced',effectsQuality:'high',combatClarity:false},
 competitive:{playerVisibility:'strong',smartAllyFade:true,allyVisualDensity:'minimal',hostileProjectilePriority:'maximum',damageNumberStyle:'aggregate',bossClarityMode:'strong',minigameTransitionGrace:'safe',adaptivePerformance:'auto',screenShake:.3,particleDensity:'balanced',effectsQuality:'medium',combatClarity:true},
 performance:{playerVisibility:'strong',smartAllyFade:true,allyVisualDensity:'minimal',hostileProjectilePriority:'maximum',damageNumberStyle:'aggregate',bossClarityMode:'strong',minigameTransitionGrace:'safe',adaptivePerformance:'conservative',screenShake:0,particleDensity:'low',effectsQuality:'low',combatClarity:true}
};
const EXPERIENCE_KEYS=new Set(Object.keys(EXPERIENCE_PROFILES.balanced));
const PRESET_KEYS=new Set(Object.keys(HUD_PRESETS.balanced));
const EXTRA_DEFAULTS={
 settingsUxVersion:4,hudPreset:'balanced',experienceProfile:'balanced',confirmQuitRun:true,repeatProtection:true,explanationMode:'compact',discoveryNotifications:true,
 hudOpacity:.88,hudDensity:'compact',allyPanel:'auto',allyPanelPolicyVersion:3,allySort:'health',minimapScale:1,minimapDetail:'normal',
 minimapLayerBoss:true,minimapLayerAllies:true,minimapLayerLoot:true,minimapLayerObjects:true,minimapLayerObjectives:true,minimapLayerEnemies:false,minimapLayerElites:true,
 objectLabels:'nearby',objectLabelDistance:1,worldEventHow:true,worldEventLive:true,floatingText:'smart',combatTextDensity:'smart',hostileProjectileOutline:'soft',
 smartHud:true,autoCollisionGuard:true,bossFocusMode:true,minigameFocusMode:true,announcementStyle:'compact',
 effectsQuality:'high',combatClarity:false,backgroundGrid:1,dynamicFxReduction:true,backgroundAnimation:true,
 reduceMotion:false,resumeWithPrimary:true,keyConflictMode:'cancel',inputPromptIcons:true,
 fontScale:1,highContrastHud:false,colorblindMode:'off',lowHpVignette:true,
 masterVolume:1,sfxVolume:1,priorityAudio:true,
 playerVisibility:'soft',smartAllyFade:true,allyVisualDensity:'reduced',hostileProjectilePriority:'high',damageNumberStyle:'aggregate',bossClarityMode:'smart',minigameTransitionGrace:'safe',adaptivePerformance:'auto'
};
function presetMatches(name,s){const p=HUD_PRESETS[name];return !!p&&Object.entries(p).every(([k,v])=>String(s[k])===String(v))}
function detectPreset(s){for(const name of ['minimal','balanced','tactical'])if(presetMatches(name,s))return name;return'custom'}
function ensureSettings(){
 VSX.save.settings ||= {};
 const hadPolicy=Number(VSX.save.settings.allyPanelPolicyVersion||0),hadUx=Number(VSX.save.settings.settingsUxVersion||0);
 for(const [k,v] of Object.entries(EXTRA_DEFAULTS))if(VSX.save.settings[k]===undefined)VSX.save.settings[k]=v;
 if(hadPolicy<3){if(!['auto','2','3'].includes(String(VSX.save.settings.allyPanel)))VSX.save.settings.allyPanel='auto';VSX.save.settings.allyPanelPolicyVersion=3}
 if(!['auto','2','3'].includes(String(VSX.save.settings.allyPanel)))VSX.save.settings.allyPanel='auto';
 if(!['minimal','balanced','tactical','custom'].includes(String(VSX.save.settings.hudPreset)))VSX.save.settings.hudPreset='custom';
 if(hadUx<3){VSX.save.settings.hudPreset=detectPreset(VSX.save.settings)}
 if(!['cinematic','balanced','competitive','performance','custom'].includes(String(VSX.save.settings.experienceProfile)))VSX.save.settings.experienceProfile='custom';
 if(hadUx<4)VSX.save.settings.settingsUxVersion=4;
 return VSX.save.settings
}
function syncCombatTextDerived(s=ensureSettings()){
 const m=s.combatTextDensity||'smart';
 if(m==='off'){s.damageNumbers='off';s.floatingText='off'}
 else if(m==='essential'){s.damageNumbers='crit';s.floatingText='smart'}
 else if(m==='all'){s.damageNumbers='full';s.floatingText='all'}
 else{s.damageNumbers='reduced';s.floatingText='smart'}
}
function applyHudPreset(name){const p=HUD_PRESETS[name];if(!p){VSX.save.settings.hudPreset='custom';return false}Object.assign(VSX.save.settings,p,{hudPreset:name});syncCombatTextDerived(VSX.save.settings);saveAndApply();renderSettings();return true}
function markPresetCustom(key){if(PRESET_KEYS.has(key)&&ensureSettings().hudPreset!=='custom')VSX.save.settings.hudPreset='custom'}
function markExperienceCustom(key){if(EXPERIENCE_KEYS.has(key)&&ensureSettings().experienceProfile!=='custom')VSX.save.settings.experienceProfile='custom'}
function applyExperienceProfile(name){const p=EXPERIENCE_PROFILES[name];if(!p){VSX.save.settings.experienceProfile='custom';saveAndApply();renderSettings();return false}Object.assign(VSX.save.settings,p,{experienceProfile:name});saveAndApply();renderSettings();return true}
function renderExperienceProfiles(parent){const s=ensureSettings(),row=document.createElement('div');row.className='vsxPresetRow vsxExperiencePresetRow';for(const [id,label] of [['cinematic',L('CINEMATIC','ĐIỆN ẢNH')],['balanced',L('BALANCED · RECOMMENDED','CÂN BẰNG · KHUYẾN NGHỊ')],['competitive',L('COMPETITIVE','ƯU TIÊN ĐỘ RÕ')],['performance',L('PERFORMANCE','HIỆU NĂNG')],['custom',L('CUSTOM','TÙY CHỈNH')]]){const b=document.createElement('button');b.type='button';b.className='vsxPresetBtn'+(s.experienceProfile===id?' selected':'');b.textContent=label;b.onclick=()=>id==='custom'?(VSX.save.settings.experienceProfile='custom',saveAndApply(),renderSettings()):applyExperienceProfile(id);row.appendChild(b)}parent.appendChild(row)}

const DEFAULT_BASE=defaultMetaSettings;
defaultMetaSettings=function(){return Object.assign(DEFAULT_BASE(),EXTRA_DEFAULTS)};
ensureSettings();

function saveAndApply(){try{vsxSave?.()}catch(e){console.warn(TAG,'save',e)}applyMetaSettings()}
function ccRow(parent,label,desc,control){
 const r=document.createElement('div');r.className='vsxSettingRow vsxCCRow';
 const l=document.createElement('label');l.innerHTML=`${VSX.esc(label)}${desc?`<small>${VSX.esc(desc)}</small>`:''}`;
 r.append(l,control);parent.appendChild(r);return r
}
function addCheck(parent,key,label,desc=''){
 const x=document.createElement('input');x.type='checkbox';x.checked=!!ensureSettings()[key];x.onchange=()=>{VSX.save.settings[key]=x.checked;markPresetCustom(key);markExperienceCustom(key);if(key==='combatTextDensity')syncCombatTextDerived();saveAndApply();renderSettings()};ccRow(parent,label,desc,x)
}
function addSelect(parent,key,label,desc,opts,num=false){
 const s=document.createElement('select');for(const [v,t] of opts){const o=document.createElement('option');o.value=String(v);o.textContent=t;if(String(ensureSettings()[key])===String(v))o.selected=true;s.appendChild(o)}
 s.onchange=()=>{VSX.save.settings[key]=num?Number(s.value):s.value;markPresetCustom(key);markExperienceCustom(key);if(key==='combatTextDensity')syncCombatTextDerived();saveAndApply();renderSettings()};ccRow(parent,label,desc,s)
}
function addRange(parent,key,label,desc,min,max,step,fmt=v=>`${Math.round(v*100)}%`){
 const box=document.createElement('div'),x=document.createElement('input'),v=document.createElement('div');box.style.minWidth='170px';x.type='range';x.min=min;x.max=max;x.step=step;x.value=Number(ensureSettings()[key]);v.className='vsxCCValue';v.textContent=fmt(Number(x.value));x.oninput=()=>{v.textContent=fmt(Number(x.value))};x.onchange=()=>{VSX.save.settings[key]=Number(x.value);markPresetCustom(key);markExperienceCustom(key);saveAndApply();renderSettings()};box.append(x,v);ccRow(parent,label,desc,box)
}
function intro(parent,en,vi){const d=document.createElement('div');d.className='vsxSettingsIntro';d.textContent=L(en,vi);parent.appendChild(d)}
function sectionTitle(parent,en,vi){const d=document.createElement('div');d.className='vsxSettingsSectionTitle';d.textContent=L(en,vi);parent.appendChild(d);return d}
let PREVIEW_SCENARIO='normal';
function previewAllyCount(s){if(String(s.allyPanel)==='3')return 3;if(String(s.allyPanel)==='2')return 2;return 2}
function renderLivePreview(parent,scenario=PREVIEW_SCENARIO){PREVIEW_SCENARIO=scenario;let wrap=parent.querySelector?.('.vsxSettingsLivePreview');if(wrap)wrap.remove();wrap=document.createElement('div');wrap.className='vsxSettingsLivePreview';const s=ensureSettings(),allyCount=scenario==='allies'?previewAllyCount(s):Math.min(2,previewAllyCount(s));wrap.innerHTML=`<div class="vsxPreviewHead"><b>${L('LIVE HUD PREVIEW','PREVIEW HUD TRỰC TIẾP')}</b><div class="vsxPreviewTabs">${[['normal','NORMAL'],['allies','30 ALLIES'],['boss','BOSS'],['event','WORLD EVENT'],['minigame','MINIGAME']].map(([id,n])=>`<button type="button" data-preview="${id}" class="${scenario===id?'selected':''}">${n}</button>`).join('')}</div></div><div class="vsxPreviewStage ${s.bossFocusMode?'boss-focus':''} ${s.minigameFocusMode?'minigame-focus':''}" data-scenario="${scenario}"><div class="vsxPVBox vsxPVStats"><b>CORE</b><div class="vsxPVBar"></div><small>HP · LV · SCORE</small></div><div class="vsxPVBox vsxPVInv"><b>LOADOUT</b><div class="vsxPVBar"></div><small>WEAPONS</small></div><div class="vsxPVBox vsxPVAlly"><b>ALLY NETWORK</b><div class="vsxPVAllyRows">${Array.from({length:allyCount},()=>'<i class="vsxPVAllyRow"></i>').join('')}</div>${scenario==='allies'?`<div class="vsxPVMore">+${30-allyCount} ${L('MORE ALLIES','ĐỒNG MINH KHÁC')}</div>`:''}</div><div class="vsxPVBox vsxPVMap"><b>MAP</b><div class="vsxPVMapDots">${s.minimapLayerAllies?'<i></i>':''}${s.minimapLayerBoss?'<i></i>':''}${s.minimapLayerObjectives?'<i></i>':''}</div><small class="vsxPVMeta">${s.minimapDetail==='minimal'?'':L('TACTICAL INFO','THÔNG TIN')}</small></div><div class="vsxPVBox vsxPVAction"><b>DASH · ULT</b><div class="vsxPVBar"></div></div><div class="vsxPVBox vsxPVBoss"><b>BOSS ENCOUNTER</b><div class="vsxPVBar"></div></div><div class="vsxPVBox vsxPVEvent"><b>WORLD EVENT</b><small>${L('Objective + live status','Mục tiêu + trạng thái')}</small></div><div class="vsxPVMinigame">${L('MINIGAME FOCUS','TẬP TRUNG MINIGAME')}</div></div>`;for(const b of wrap.querySelectorAll('[data-preview]'))b.onclick=()=>renderLivePreview(parent,b.dataset.preview);parent.appendChild(wrap);return wrap}
function renderPresetControls(parent){const s=ensureSettings(),row=document.createElement('div');row.className='vsxPresetRow';for(const [id,label] of [['minimal',L('MINIMAL','TỐI GIẢN')],['balanced',L('BALANCED · RECOMMENDED','CÂN BẰNG · KHUYẾN NGHỊ')],['tactical',L('TACTICAL','CHIẾN THUẬT')],['custom',L('CUSTOM','TÙY CHỈNH')]]){const b=document.createElement('button');b.type='button';b.className='vsxPresetBtn'+(s.hudPreset===id?' selected':'');b.textContent=label;b.onclick=()=>id==='custom'?(VSX.save.settings.hudPreset='custom',saveAndApply(),renderSettings()):applyHudPreset(id);row.appendChild(b)}parent.appendChild(row)}
function addLayerGroup(parent){const group=document.createElement('div');group.className='vsxSettingsLayerGroup';for(const [key,en,vi] of [['minimapLayerBoss','Boss / Miniboss','Boss / Miniboss'],['minimapLayerElites','Elite enemies','Địch Elite'],['minimapLayerEnemies','Normal enemies','Địch thường'],['minimapLayerObjectives','Event / Recruit targets','Mục tiêu Event / Recruit'],['minimapLayerObjects','World Objects','World Objects'],['minimapLayerAllies','Allies','Đồng minh'],['minimapLayerLoot','Loot / Boosts','Loot / Buff']])addCheck(group,key,L(en,vi),'');parent.appendChild(group)}
function footer(parent){
 const f=document.createElement('div');f.className='vsxSettingsFooter';const note=document.createElement('small');note.textContent=L('Presentation, accessibility, audio and input only. Combat balance is not modified.','Chỉ thay đổi hiển thị, trợ năng, âm thanh và input. Không chỉnh cân bằng chiến đấu.');
 const row=document.createElement('div');row.className='row';const resetTab=document.createElement('button'),resetAll=document.createElement('button');
 resetTab.textContent=L('RESET TAB','ĐẶT LẠI TAB');resetAll.textContent=L('RESET ALL SETTINGS','ĐẶT LẠI TẤT CẢ');
 resetTab.onclick=()=>{const d=defaultMetaSettings(),keys=TAB_KEYS[SETTINGS_TAB]||[];for(const k of keys)VSX.save.settings[k]=d[k];saveAndApply();renderSettings()};
 resetAll.onclick=()=>{const kb=VSX.save.settings.keybinds;VSX.save.settings=defaultMetaSettings();VSX.save.settings.keybinds=kb;ensureSettings();saveAndApply();renderSettings()};
 row.append(resetTab,resetAll);f.append(note,row);parent.appendChild(f)
}
const TAB_KEYS={
 quick:['hudPreset','experienceProfile','smartHud','bossFocusMode','minigameFocusMode','allyPanel','combatTextDensity','hostileProjectileOutline','playerVisibility','smartAllyFade','allyVisualDensity','hostileProjectilePriority','damageNumberStyle','bossClarityMode','minigameTransitionGrace','adaptivePerformance'],
 general:['confirmQuitRun','autoPause','waveAnnouncements','eventBriefings','repeatProtection','explanationMode','discoveryNotifications','announcementStyle'],
 hud:['hudScale','hudOpacity','hudDensity','allyPanel','allySort','minimapScale','minimapDetail','minimapLayerBoss','minimapLayerElites','minimapLayerEnemies','minimapLayerObjectives','minimapLayerObjects','minimapLayerAllies','minimapLayerLoot','objectLabels','objectLabelDistance','worldEventHow','worldEventLive','combatTextDensity','hostileProjectileOutline','smartHud','autoCollisionGuard','bossFocusMode','minigameFocusMode','playerVisibility','smartAllyFade','damageNumberStyle','bossClarityMode','minigameTransitionGrace'],
 visual:['screenShake','particleDensity','effectsQuality','combatClarity','backgroundGrid','dynamicFxReduction','backgroundAnimation','allyVisualDensity','hostileProjectilePriority','adaptivePerformance'],
 audio:['masterVolume','sfxVolume','priorityAudio'],
 controls:['resumeWithPrimary','keyConflictMode','inputPromptIcons'],
 access:['fontScale','highContrastHud','reducedFlashing','reduceMotion','colorblindMode','lowHpVignette']
};
const RENDER_BASE=renderSettings;
renderSettings=function(){
 ensureSettings();const sc=document.getElementById('vsxSettingsScreen');if(!sc)return RENDER_BASE();
 document.getElementById('vsxSettingsTitle').textContent=t('settings');document.getElementById('vsxSettingsBack').textContent=t('back');
 const tabs=document.getElementById('vsxSettingsTabs'),arr=[['quick',L('QUICK SETUP','THIẾT LẬP NHANH')],['general',L('GENERAL','CHUNG')],['hud',t('hudSettings')],['visual',t('visual')],['audio',t('audio')],['controls',L('CONTROLS','ĐIỀU KHIỂN')],['access',t('accessibility')]];
 if(!arr.some(x=>x[0]===SETTINGS_TAB))SETTINGS_TAB='general';tabs.innerHTML='';
 for(const [id,label] of arr){const b=document.createElement('button');b.textContent=label;b.className=id===SETTINGS_TAB?'selected':'';b.onclick=()=>{SETTINGS_TAB=id;renderSettings()};tabs.appendChild(b)}
 const c=document.getElementById('vsxSettingsContent');c.innerHTML='';const grid=document.createElement('div');grid.className='vsxSettingsGrid';
 if(SETTINGS_TAB==='quick'){
  intro(c,'Choose a tested HUD profile, then fine-tune only what matters. Every control below has a live gameplay/UI effect.','Chọn profile HUD đã QA, sau đó chỉ chỉnh những gì cần. Mọi control bên dưới đều có hiệu ứng gameplay/UI thật.');
  sectionTitle(c,'HUD PROFILE','PROFILE HUD');renderPresetControls(c);
  sectionTitle(c,'COMBAT EXPERIENCE','TRẢI NGHIỆM COMBAT');renderExperienceProfiles(c);
  sectionTitle(grid,'ADAPTIVE CLARITY','ĐỘ RÕ THÍCH ỨNG');
  addCheck(grid,'smartHud',L('Smart HUD','HUD thông minh'),L('Allows context-aware layout compaction without changing gameplay.','Cho phép HUD tự thu gọn theo ngữ cảnh mà không đổi gameplay.'));
  addCheck(grid,'bossFocusMode',L('Boss Focus Mode','Chế độ tập trung Boss'),L('Dims noncritical loadout/detail UI while a Boss is active.','Giảm UI phụ khi Boss đang hoạt động.'));
  addCheck(grid,'minigameFocusMode',L('Minigame Focus Mode','Chế độ tập trung Minigame'),L('Hides combat HUD behind standalone minigames; the minigame screen remains fully visible.','Ẩn HUD combat phía sau minigame độc lập; màn minigame vẫn hiển thị đầy đủ.'));
  addSelect(grid,'allyPanel',L('Ally HUD mode','Chế độ HUD Ally'),L('AUTO = 2 normally, 1 when the recruitment guide or viewport becomes crowded.','AUTO = 2 bình thường, 1 khi hướng dẫn chiêu mộ hoặc viewport quá chật.'),[['auto',L('AUTO · Recommended','AUTO · Khuyến nghị')],['2',L('Fixed 2 allies','Cố định 2 đồng minh')],['3',L('Fixed 3 allies','Cố định 3 đồng minh')]]);
  addSelect(grid,'combatTextDensity',L('Combat text density','Mật độ chữ combat'),'',[['off',t('off')],['essential',L('Essential only','Chỉ quan trọng')],['smart',L('Smart · Recommended','Thông minh · Khuyến nghị')],['all',L('All','Tất cả')]]);
  addSelect(grid,'hostileProjectileOutline',L('Hostile projectile outline','Viền projectile địch'),L('Presentation only; hitboxes and projectile speed are unchanged.','Chỉ hiển thị; hitbox và tốc độ projectile không đổi.'),[['off',t('off')],['soft',L('Soft','Nhẹ')],['high',L('High contrast','Tương phản cao')]]);
  addSelect(grid,'playerVisibility',L('Player always-on-top','Luôn làm nổi player'),L('Draws a final visibility marker above battlefield FX.','Vẽ dấu nhận diện cuối cùng phía trên FX chiến trường.'),[['off',t('off')],['soft',L('Soft outline','Viền nhẹ')],['strong',L('Strong outline','Viền mạnh')]]);
  addCheck(grid,'smartAllyFade',L('Smart Ally Fade','Tự làm mờ Ally'),L('Fades nearby allies before they cover the player.','Làm mờ ally ở gần trước khi chúng che player.'));
  addSelect(grid,'damageNumberStyle',L('Damage number style','Kiểu số sát thương'),'',[['individual',L('Individual','Từng hit')],['aggregate',L('Aggregate · Recommended','Gộp số · Khuyến nghị')],['off',t('off')]]);
  addSelect(grid,'bossClarityMode',L('Boss Clarity','Độ rõ khi đánh Boss'),'',[['off',t('off')],['smart',L('Smart','Thông minh')],['strong',L('Strong','Mạnh')]]);
  c.appendChild(grid);renderLivePreview(c,PREVIEW_SCENARIO);footer(c);return;
 }else if(SETTINGS_TAB==='general'){
  intro(c,'These options change presentation and content ordering, not run balance.','Các tùy chọn này thay đổi cách hiển thị và thứ tự nội dung, không đổi cân bằng trận.');
  const lang=document.createElement('select');for(const [v,n] of [['en','English'],['vi','Tiếng Việt']]){const o=document.createElement('option');o.value=v;o.textContent=n;o.selected=VSX.lang===v;lang.appendChild(o)}lang.onchange=()=>{VSX.lang=lang.value;vsxApplyLanguage();renderSettings()};ccRow(grid,L('Language','Ngôn ngữ'),'',lang);
  addCheck(grid,'confirmQuitRun',L('Confirm before leaving a run','Xác nhận trước khi rời trận'),L('Prevents accidental Main Menu presses during a live run.','Tránh bấm nhầm về Menu khi đang chơi.'));
  addCheck(grid,'autoPause',t('autoPause'),'');
  addCheck(grid,'waveAnnouncements',t('waveAnnouncements'),'');
  addCheck(grid,'eventBriefings',L('Major encounter briefing','Thông báo encounter lớn'),L('Keeps the existing World Event / Minigame briefing flow.','Giữ briefing World Event / Minigame hiện tại.'));
  addCheck(grid,'repeatProtection',L('Repeat Protection','Chống lặp trực tiếp'),L('Avoids immediately repeating the same World Event/Minigame/category when alternatives are eligible.','Không lặp ngay cùng World Event/Minigame/category nếu còn lựa chọn hợp lệ khác.'));
  addSelect(grid,'explanationMode',L('Repeated explanations','Giải thích khi lặp'),L('Controls HOW text density only.','Chỉ thay mật độ dòng CÁCH CHƠI.'),[['always',L('Always full','Luôn đầy đủ')],['compact',L('Compact','Gọn')],['first',L('First encounter only','Chỉ lần gặp đầu')]]);
  addCheck(grid,'discoveryNotifications',L('Discovery notifications','Thông báo khám phá'),'');
  addSelect(grid,'announcementStyle',L('Announcement style','Kiểu thông báo'),'',[['full',L('Full','Đầy đủ')],['compact',L('Compact','Gọn')],['minimal',L('Minimal','Tối giản')]]);
 }else if(SETTINGS_TAB==='hud'){
  intro(c,'HUD options never change collision, range or gameplay values.','Tùy chọn HUD không thay collision, phạm vi hay chỉ số gameplay.');
  addSelect(grid,'hudScale',t('hudScale'),'',[[.8,'80%'],[.9,'90%'],[1,'100%'],[1.1,'110%'],[1.2,'120%']],true);
  addSelect(grid,'hudOpacity',L('HUD opacity','Độ trong HUD'),'',[[.72,'72%'],[.88,'88%'],[1,'100%']],true);
  addSelect(grid,'hudDensity',L('HUD density','Mật độ HUD'),'',[['minimal',L('Minimal','Tối giản')],['compact',L('Compact','Gọn')],['detailed',L('Detailed','Chi tiết')]]);
  addSelect(grid,'allyPanel',L('Ally health cards','Thẻ máu đồng minh'),L('AUTO shows 2 normally and drops to 1 when instructions or viewport are crowded. Fixed 2/3 still auto-drop to 1 for a long recruitment guide.','AUTO hiện 2 bình thường và giảm còn 1 khi hướng dẫn/viewport chật. Chế độ 2/3 cố định vẫn tự giảm còn 1 khi hướng dẫn chiêu mộ dài.'),[['auto',L('AUTO · Recommended','AUTO · Khuyến nghị')],['2',L('Fixed 2 allies','Cố định 2 đồng minh')],['3',L('Fixed 3 allies','Cố định 3 đồng minh')]]);
  addSelect(grid,'allySort',L('Ally sorting','Sắp xếp đồng minh'),'',[['health',L('Health → recent tie','Máu → mới nhất khi hòa')],['recent',L('Recently recruited','Mới recruit')],['name',L('Name','Tên')]]);
  addSelect(grid,'minimapScale',L('Minimap scale','Kích thước minimap'),'',[[.8,'80%'],[1,'100%'],[1.2,'120%']],true);
  addSelect(grid,'minimapDetail',L('Minimap detail','Chi tiết minimap'),'',[['minimal',L('Minimal','Tối giản')],['normal',L('Normal','Bình thường')],['detailed',L('Detailed','Chi tiết')]]);
  sectionTitle(grid,'MINIMAP LAYERS','LỚP MINIMAP');addLayerGroup(grid);
  addSelect(grid,'objectLabels',L('World Object labels','Nhãn World Object'),'',[['off',t('off')],['nearby',L('Nearby','Khi ở gần')],['always',L('Always','Luôn hiện')]]);
  addSelect(grid,'objectLabelDistance',L('Object label display distance','Khoảng hiện nhãn object'),L('Display-only; interaction radius is unchanged.','Chỉ hiển thị; không đổi bán kính tương tác.'),[[.75,L('Short','Gần')],[1,L('Normal','Bình thường')],[1.25,L('Far','Xa')]],true);
  addCheck(grid,'worldEventHow',L('World Event HOW','Dòng CÁCH CHƠI World Event'),'');
  addCheck(grid,'worldEventLive',L('World Event LIVE','Dòng TRẠNG THÁI World Event'),'');
  addSelect(grid,'combatTextDensity',L('Combat text density','Mật độ chữ combat'),'',[['off',t('off')],['essential',L('Essential only','Chỉ quan trọng')],['smart',L('Smart','Thông minh')],['all',L('All','Tất cả')]]);
  addSelect(grid,'hostileProjectileOutline',L('Hostile projectile outline','Viền projectile địch'),L('Visual-only outline for hostile bullets.','Viền hiển thị dành riêng cho projectile địch.'),[['off',t('off')],['soft',L('Soft','Nhẹ')],['high',L('High contrast','Tương phản cao')]]);
  addCheck(grid,'smartHud',L('Smart HUD','HUD thông minh'),L('Compacts noncritical panels during pressure.','Tự gọn panel không quan trọng khi giao tranh dày.'));
  addCheck(grid,'bossFocusMode',L('Boss Focus Mode','Chế độ tập trung Boss'),L('Reduces noncritical HUD detail while Boss/Miniboss pressure is active.','Giảm chi tiết HUD phụ khi Boss/Miniboss đang gây áp lực.'));
  addCheck(grid,'minigameFocusMode',L('Minigame Focus Mode','Chế độ tập trung Minigame'),L('Hides combat HUD behind standalone minigames.','Ẩn HUD combat phía sau minigame độc lập.'));
  addSelect(grid,'playerVisibility',L('Player always-on-top','Luôn làm nổi player'),L('Final outline is rendered after battlefield FX.','Viền cuối được render sau FX chiến trường.'),[['off',t('off')],['soft',L('Soft outline','Viền nhẹ')],['strong',L('Strong outline','Viền mạnh')]]);
  addCheck(grid,'smartAllyFade',L('Smart Ally Fade','Tự làm mờ Ally'),L('Reduces ally opacity near the player or under Boss pressure.','Giảm opacity ally gần player hoặc khi Boss gây áp lực.'));
  addSelect(grid,'damageNumberStyle',L('Damage number style','Kiểu số sát thương'),'',[['individual',L('Individual','Từng hit')],['aggregate',L('Aggregate','Gộp số')],['off',t('off')]]);
  addSelect(grid,'bossClarityMode',L('Boss Clarity Mode','Chế độ rõ Boss'),L('Prioritizes player, boss telegraphs and hostile projectiles over noncritical HUD/ally detail.','Ưu tiên player, telegraph Boss và projectile địch hơn HUD/ally phụ.'),[['off',t('off')],['smart',L('Smart','Thông minh')],['strong',L('Strong','Mạnh')]]);
  addSelect(grid,'minigameTransitionGrace',L('Minigame transition grace','Bảo vệ chuyển cảnh Minigame'),L('SAFE repeatedly renews surface ownership during the first transition window.','SAFE liên tục gia hạn ownership surface trong cửa sổ chuyển cảnh đầu.'),[['standard',L('Standard','Chuẩn')],['safe',L('Safe · Recommended','An toàn · Khuyến nghị')]]);
  addCheck(grid,'autoCollisionGuard',L('Adaptive HUD collision guard','Tự compact HUD khi chật'),L('Lets Smart HUD compact noncritical panels when space is tight. Core no-overlap safety remains always on.','Cho Smart HUD tự compact panel phụ khi thiếu chỗ. Lớp chống đè HUD cốt lõi luôn được giữ bật.'));
  c.appendChild(grid);renderLivePreview(c,PREVIEW_SCENARIO);footer(c);return;
 }else if(SETTINGS_TAB==='visual'){
  intro(c,'Visual quality may reduce decorative effects, never hazard or telegraph logic.','Chất lượng hình ảnh chỉ giảm hiệu ứng trang trí, không tắt hazard hay telegraph.');
  addSelect(grid,'effectsQuality',L('Effects quality','Chất lượng hiệu ứng'),'',[['high',t('high')],['medium',L('Medium','Trung bình')],['low',t('low')]]);
  addSelect(grid,'particleDensity',t('particleDensity'),'',[['high',t('high')],['balanced',t('balanced')],['low',t('low')]]);
  addSelect(grid,'screenShake',t('screenShake'),'',[[1,'100%'],[.6,'60%'],[.3,'30%'],[0,t('off')]],true);
  addCheck(grid,'combatClarity',L('Combat Clarity Mode','Chế độ dễ đọc combat'),L('Raises contrast and reduces decorative saturation.','Tăng tương phản, giảm độ rực trang trí.'));
  addSelect(grid,'backgroundGrid',L('Background grid','Độ rõ lưới nền'),'',[[.4,'40%'],[.7,'70%'],[1,'100%']],true);
  addCheck(grid,'dynamicFxReduction',L('Dynamic FX reduction','Tự giảm FX khi FPS thấp'),L('Reduces particles first; gameplay telegraphs remain.','Giảm particle trước; telegraph gameplay vẫn giữ.'));
  addSelect(grid,'allyVisualDensity',L('Ally visual density','Mật độ hiệu ứng Ally'),L('Changes ally opacity/visual weight only; ally damage and AI are untouched.','Chỉ đổi độ đậm hình ảnh ally; damage và AI không đổi.'),[['full',L('Full','Đầy đủ')],['reduced',L('Reduced · Recommended','Giảm · Khuyến nghị')],['minimal',L('Minimal','Tối giản')]]);
  addSelect(grid,'hostileProjectilePriority',L('Hostile projectile priority','Ưu tiên projectile địch'),L('Higher modes redraw hostile bullets above decorative FX without changing hitboxes.','Mode cao redraw đạn địch phía trên FX trang trí mà không đổi hitbox.'),[['normal',L('Normal','Bình thường')],['high',L('High','Cao')],['maximum',L('Maximum','Tối đa')]]);
  addSelect(grid,'adaptivePerformance',L('Adaptive performance','Hiệu năng thích ứng'),L('Only trims cosmetic particles when FPS is under pressure; enemy bullets/telegraphs are never culled.','Chỉ giảm particle trang trí khi FPS thấp; không cắt projectile/telegraph địch.'),[['off',t('off')],['auto',L('Auto','Tự động')],['conservative',L('Conservative','Ưu tiên FPS')]]);
  addCheck(grid,'backgroundAnimation',L('Background ambience','Hiệu ứng nền'),'');
 }else if(SETTINGS_TAB==='audio'){
  intro(c,'Audio sliders affect generated game SFX without changing timing or mechanics.','Thanh âm lượng chỉ thay âm thanh, không đổi timing hay cơ chế.');
  const mute=document.createElement('button');mute.textContent=game.audio.muted?L('SOUND ON','BẬT ÂM'):L('MUTE','TẮT ÂM');mute.onclick=()=>{game.audio.toggle();renderSettings()};ccRow(grid,L('Sound toggle','Bật / tắt âm thanh'),window.VSX_KEYBINDS?`MUTE · ${VSX_KEYBINDS.label('mute')}`:'',mute);
  addRange(grid,'masterVolume',L('Master volume','Âm lượng tổng'),'',0,1,.1);
  addRange(grid,'sfxVolume',L('SFX volume','Âm lượng hiệu ứng'),'',0,1,.1);
  addCheck(grid,'priorityAudio',L('Priority warning audio','Ưu tiên âm cảnh báo'),L('Important warning cues stay clearer than ordinary UI beeps.','Cảnh báo quan trọng rõ hơn âm UI thông thường.'));
 }else if(SETTINGS_TAB==='controls'){
  intro(c,'Custom bindings translate to the canonical controls used by every subsystem.','Phím tùy chỉnh được dịch sang input canonical dùng chung toàn game.');
  addCheck(grid,'resumeWithPrimary',L('Resume with Primary / Space','Tiếp tục bằng Primary / Space'),'');
  addSelect(grid,'keyConflictMode',L('Keybind conflict handling','Xử lý trùng phím'),'',[['cancel',L('Block duplicate','Chặn trùng')],['swap',L('Swap bindings','Hoán đổi phím')]]);
  addCheck(grid,'inputPromptIcons',L('Input prompt icons','Hiện biểu tượng phím'),'');
  c.appendChild(grid);const keyWrap=document.createElement('div');keyWrap.style.marginTop='12px';window.VSX_KEYBINDS?.render?.(keyWrap);c.appendChild(keyWrap);footer(c);return;
 }else{
  intro(c,'Accessibility changes presentation only.','Trợ năng chỉ thay cách hiển thị.');
  addSelect(grid,'fontScale',L('UI font scale','Cỡ chữ UI'),'',[[.9,'90%'],[1,'100%'],[1.1,'110%'],[1.2,'120%']],true);
  addCheck(grid,'highContrastHud',L('High-contrast HUD','HUD tương phản cao'),'');
  addCheck(grid,'reducedFlashing',t('reducedFlashing'),'');
  addCheck(grid,'reduceMotion',L('Reduce motion','Giảm chuyển động'),L('Disables screen shake and shortens UI animation.','Tắt rung màn hình và rút ngắn animation UI.'));
  addSelect(grid,'colorblindMode',L('Color assistance','Hỗ trợ màu'),'',[['off',t('off')],['protan',L('Protan assist','Hỗ trợ đỏ')],['deutan',L('Deutan assist','Hỗ trợ xanh-lục')],['tritan',L('Tritan assist','Hỗ trợ xanh-lam')]]);
  addCheck(grid,'lowHpVignette',L('Low HP vignette','Viền cảnh báo máu thấp'),'');
 }
 c.appendChild(grid);footer(c)
};

const APPLY_BASE=applyMetaSettings;
applyMetaSettings=function(){
 ensureSettings();syncCombatTextDerived(VSX.save.settings);APPLY_BASE();const s=VSX.save.settings,b=document.body,root=document.documentElement;
 for(const x of ['vsxHudOpacityLow','vsxHudOpacityMid','vsxHudDensityMinimal','vsxHudDensityDetailed','vsxMinimapMinimal','vsxMinimapDetailed','vsxHideEventHow','vsxHideEventLive','vsxEventHowCompact','vsxNoAutoCompact','vsxAnnouncementMinimal','vsxAnnouncementFull','vsxHighContrastHud','vsxCombatClarity','vsxColorProtan','vsxColorDeutan','vsxColorTritan','vsxReduceFlash','vsxReduceMotion','vsxNoBackgroundAnim','vsxNoInputPrompts','vsxMinigameFocusEnabled','vsxBossFocusEnabled','vsxBossClaritySmart','vsxBossClarityStrong','vsxPlayerVisibilitySoft','vsxPlayerVisibilityStrong','vsxPerfLevel1','vsxPerfLevel2'])b.classList.remove(x);
 if(s.hudOpacity<=.75)b.classList.add('vsxHudOpacityLow');else if(s.hudOpacity<1)b.classList.add('vsxHudOpacityMid');
 if(s.hudDensity==='minimal')b.classList.add('vsxHudDensityMinimal');else if(s.hudDensity==='detailed')b.classList.add('vsxHudDensityDetailed');
 if(s.minimapDetail==='minimal')b.classList.add('vsxMinimapMinimal');else if(s.minimapDetail==='detailed')b.classList.add('vsxMinimapDetailed');
 if(!s.worldEventHow)b.classList.add('vsxHideEventHow');if(!s.worldEventLive)b.classList.add('vsxHideEventLive');if(s.explanationMode==='compact')b.classList.add('vsxEventHowCompact');if(s.autoCollisionGuard===false)b.classList.add('vsxNoAutoCompact');
 if(s.announcementStyle==='minimal')b.classList.add('vsxAnnouncementMinimal');else if(s.announcementStyle==='full')b.classList.add('vsxAnnouncementFull');
 if(s.highContrastHud)b.classList.add('vsxHighContrastHud');if(s.combatClarity)b.classList.add('vsxCombatClarity');
 if(s.colorblindMode==='protan')b.classList.add('vsxColorProtan');if(s.colorblindMode==='deutan')b.classList.add('vsxColorDeutan');if(s.colorblindMode==='tritan')b.classList.add('vsxColorTritan');
 if(s.reducedFlashing)b.classList.add('vsxReduceFlash');if(s.reduceMotion)b.classList.add('vsxReduceMotion');if(!s.backgroundAnimation)b.classList.add('vsxNoBackgroundAnim');if(!s.inputPromptIcons)b.classList.add('vsxNoInputPrompts');
 if(s.minigameFocusMode)b.classList.add('vsxMinigameFocusEnabled');if(s.bossFocusMode)b.classList.add('vsxBossFocusEnabled');if(s.playerVisibility==='soft')b.classList.add('vsxPlayerVisibilitySoft');else if(s.playerVisibility==='strong')b.classList.add('vsxPlayerVisibilityStrong');
 root.style.setProperty('--vsxUiFontScale',String(s.fontScale||1));root.style.setProperty('--vsxGridOpacity',String(s.backgroundGrid??1));
 const map=document.getElementById('vsxMinimapWrap');if(map)map.style.zoom=String(s.minimapScale||1);
 updateMapKeyLabel()
};

function updateMapKeyLabel(){try{const e=document.getElementById('vsxMinimapToggle');if(e&&window.VSX_KEYBINDS?.defs?.map)e.textContent=VSX_KEYBINDS.label('map')}catch{}}
function installMapBind(){
 const K=window.VSX_KEYBINDS;if(!K)return false;
 if(!K.defs.map){K.defs.map={canonical:'KeyN',slots:1,defaults:['KeyN'],en:'Tactical Map',vi:'Bản đồ chiến thuật',hintEn:'Show / hide tactical minimap',hintVi:'Hiện / ẩn bản đồ chiến thuật'};K.order.push('map')}
 VSX.save.settings.keybinds=K.normalize(VSX.save.settings.keybinds);try{vsxSave?.()}catch{}updateMapKeyLabel();return true
}
installMapBind();

const ALLY_BASE=renderStoryAllyHud;
const allySeen=new Map();let allySeq=0;
function allyConfiguredLimit(s){const m=String(s?.allyPanel||'auto');return m==='3'?3:2}
function allyObjectiveIsLong(obj){
 if(!obj)return false;
 const h=Math.max(Number(obj.scrollHeight)||0,Number(obj.getBoundingClientRect?.().height)||0),txt=(obj.textContent||'').trim();
 /* In the current HUD typography ~36px is the point where the recruitment block becomes
    a multi-line instruction panel rather than a short status line. Text length is a
    fallback for browsers that report zero layout height during an early render pass. */
 return h>36||txt.length>60
}
function applyAllyCardPolicy(el,cards,obj,s){
 const mode=String(s?.allyPanel||'auto'),configured=allyConfiguredLimit(s);let limit=configured,reason=mode==='auto'?'auto':'setting';
 if(allyObjectiveIsLong(obj)){limit=1;reason='long-objective'}else if(mode==='auto'&&(innerWidth<=1100||innerHeight<=690)){limit=1;reason='auto-tight-viewport'}
 for(const c of cards)c.style.display='';
 for(const c of cards.slice(limit))c.style.display='none';
 let more=el.querySelector('.vsxAllyCollapsed');
 if(cards.length>limit){if(!more){more=document.createElement('div');more.className='vsxAllyCollapsed'}more.style.display='block';more.textContent=`+${Math.max(0,cards.length-limit)} ${L('MORE ALLIES','ĐỒNG MINH KHÁC')}`;const last=cards[Math.min(limit,cards.length)-1];if(last)last.after(more);else if(obj)obj.after(more);else el.appendChild(more)}else if(more)more.style.display='none';
 el.dataset.vsxAllyMode=mode;el.dataset.vsxAllyConfigured=String(configured);el.dataset.vsxAllyVisible=String(Math.min(limit,cards.length));el.dataset.vsxAllyReason=reason;
 return{configured,limit,reason,objectiveHeight:obj?Math.round(Math.max(Number(obj.scrollHeight)||0,Number(obj.getBoundingClientRect?.().height)||0)):0,objectiveLength:(obj?.textContent||'').trim().length,cards:cards.length}
}
renderStoryAllyHud=function(g){
 const r=ALLY_BASE.apply(this,arguments),el=document.getElementById('vsxAllyHud');if(!el)return r;const s=ensureSettings(),cards=[...el.querySelectorAll('.vsxAllyCard')],obj=el.querySelector('.vsxRecruitObjective');
 for(const c of cards){const name=c.querySelector('.vsxAllyName')?.textContent||c.textContent;if(!allySeen.has(name))allySeen.set(name,++allySeq);c.style.display=''}
 const hp=c=>{const n=parseFloat(c.querySelector('.vsxAllyBar i')?.style.width||'0');return Number.isFinite(n)?n:0},name=c=>c.querySelector('.vsxAllyName')?.textContent||'';
 cards.sort((a,b)=>s.allySort==='name'?name(a).localeCompare(name(b),VSX.lang):s.allySort==='recent'?(allySeen.get(name(b))||0)-(allySeen.get(name(a))||0):(hp(b)-hp(a)||((allySeen.get(name(b))||0)-(allySeen.get(name(a))||0))));
 const head=el.querySelector('.vsxAllyHead');let cursor=head;if(obj){if(cursor){cursor.after(obj);cursor=obj}else{el.prepend(obj);cursor=obj}}
 for(const c of cards){if(cursor){cursor.after(c);cursor=c}else{el.appendChild(c);cursor=c}}
 applyAllyCardPolicy(el,cards,obj,s);
 /* Recheck after layout settles: font fallback / localization can turn a short objective
    into a long one after the synchronous pass. This only reduces to 1; it never changes
    gameplay state or the user's saved 2/3 preference. */
 queueMicrotask(()=>{try{const live=[...el.querySelectorAll('.vsxAllyCard')],o=el.querySelector('.vsxRecruitObjective');applyAllyCardPolicy(el,live,o,ensureSettings())}catch(e){console.warn(TAG,'ally HUD adaptive pass',e)}});
 return r
};
window.VSX_ALLY_HUD_POLICY={version:'3.0.0',configuredLimit:()=>allyConfiguredLimit(ensureSettings()),objectiveIsLong:allyObjectiveIsLong,apply:()=>{const el=document.getElementById('vsxAllyHud');if(!el)return null;return applyAllyCardPolicy(el,[...el.querySelectorAll('.vsxAllyCard')],el.querySelector('.vsxRecruitObjective'),ensureSettings())},state:()=>{const el=document.getElementById('vsxAllyHud');return el?{mode:el.dataset.vsxAllyMode||String(ensureSettings().allyPanel||'auto'),configured:Number(el.dataset.vsxAllyConfigured||allyConfiguredLimit(ensureSettings())),visible:Number(el.dataset.vsxAllyVisible||0),reason:el.dataset.vsxAllyReason||'unknown',cards:el.querySelectorAll('.vsxAllyCard').length,objectiveHeight:Math.round(el.querySelector('.vsxRecruitObjective')?.getBoundingClientRect?.().height||0),objectiveLength:(el.querySelector('.vsxRecruitObjective')?.textContent||'').trim().length}:null}};
window.VSX_ARCH?.registerFeature('ally_hud_adaptive',{system:'hud',owner:'VSX_ALLY_HUD_POLICY',check:()=>{const st=window.VSX_ALLY_HUD_POLICY?.state?.(),mode=String(ensureSettings().allyPanel);return{ok:!!window.VSX_ALLY_HUD_POLICY&&['auto','2','3'].includes(mode)&&(!st||st.visible<=3),defaultCards:2,mode,adaptiveLongObjective:true,adaptiveViewport:mode==='auto',state:st}}});

const FLOAT_BASE=FloatingText.prototype.render;
FloatingText.prototype.render=function(g){const s=ensureSettings(),m=s.combatTextDensity||'smart',txt=String(this.text||''),numeric=/^[+\-]?\d/.test(txt),critical=/CRIT|DODGE|BLOCK|BARRIER|ULT|DOWN|READY|PERFECT|INSURANCE|BOSS|ELITE|!|\bHP\b/i.test(txt);if(s.damageNumberStyle==='off'&&numeric)return;if(m==='off')return;if(m==='essential'&&!critical)return;if(m==='smart'&&!numeric&&!critical&&txt.length<7&&Math.random()<.55)return;return FLOAT_BASE.apply(this,arguments)};

const BEEP_BASE=AudioManager.prototype.beep;
AudioManager.prototype.beep=function(freq,dur,type,vol){const s=ensureSettings(),raw=vol??.025,legacyPriority=window.VSX_SETTINGS_V5?1:(s.priorityAudio&&raw>=.03?1.12:1),v5=window.VSX_SETTINGS_V5?.audioMultiplier?.(raw)??1;return BEEP_BASE.call(this,freq,dur,type,raw*Number(s.masterVolume??1)*Number(s.sfxVolume??1)*legacyPriority*v5)};

const ANN_BASE=VSX.announce;
VSX.announce=function(title,sub,color){const s=ensureSettings();if(s.announcementStyle==='minimal'&&sub)sub=String(sub).split('•')[0].trim();if(window.VSX_SETTINGS_V5&&!VSX_SETTINGS_V5.allowAnnouncement(title,sub))return;return ANN_BASE.call(this,title,sub,color)};

const DISC_BASE=vsxDiscover;
vsxDiscover=function(cat,id){
 const existed=!!VSX.save?.codex?.[cat]?.[id],r=DISC_BASE.apply(this,arguments),s=ensureSettings();
 if(!existed&&s.discoveryNotifications&&['world_objects','world_events','minigames'].includes(cat)){queueMicrotask(()=>{try{VSX.announce(L('DISCOVERED','ĐÃ KHÁM PHÁ'),String(id).replaceAll('_',' ').toUpperCase(),'#78dfff')}catch{}})}
 return r
};

function settingsHudAuthority({game:g}){
 const s=ensureSettings(),b=document.body,adaptive=!!s.smartHud&&s.autoCollisionGuard!==false,bossActive=!!((g.boss&&!g.boss.dead)||(g.miniBoss&&!g.miniBoss.dead));
 b.classList.toggle('vsxSmartBoss',adaptive&&bossActive);
 b.classList.toggle('vsxBossFocusActive',!!s.bossFocusMode&&bossActive&&g.state==='PLAYING');
 b.classList.toggle('vsxBossFocusWithEvent',!!s.bossFocusMode&&bossActive&&!!g.worldEvent);b.classList.toggle('vsxBossClaritySmart',bossActive&&s.bossClarityMode==='smart');b.classList.toggle('vsxBossClarityStrong',bossActive&&s.bossClarityMode==='strong');
 b.classList.toggle('vsxSmartRecruit',adaptive&&!!g.activeRecruitChallenge);
 b.classList.toggle('vsxLowHp',!!s.lowHpVignette&&!!g.player&&g.player.hp/Math.max(1,g.player.maxHp)<.28&&g.state==='PLAYING');
 const mode=s.explanationMode||'compact',id=g.worldEvent?.id||null;if(!g.vsxSettingsSeenEvents)g.vsxSettingsSeenEvents=new Set();
 if(id&&g.vsxSettingsCurrentEvent!==id){g.vsxSettingsCurrentEvent=id;g.vsxSettingsCurrentFirst=!g.vsxSettingsSeenEvents.has(id);g.vsxSettingsSeenEvents.add(id)}
 if(!id){g.vsxSettingsCurrentEvent=null;g.vsxSettingsCurrentFirst=false}
 document.body.classList.toggle('vsxHideEventHow',!s.worldEventHow||(mode==='first'&&id&&!g.vsxSettingsCurrentFirst));
}
window.VSX_ARCH?.register('hud.after','settings.control-center',settingsHudAuthority,{priority:50});
function hostileProjectileReadability({game:g,ctx:c}){const s=ensureSettings(),mode=s.hostileProjectileOutline||'soft',priority=s.hostileProjectilePriority||'high';if(mode==='off'||!g?.player||!c||!g.enemyProjectiles?.length)return;const high=mode==='high'||priority==='maximum',max=priority==='maximum'?800:priority==='high'?620:420,list=g.enemyProjectiles.slice(-max);let rings=0;c.save();c.translate(-g.camera.x,-g.camera.y);c.globalAlpha=priority==='maximum'?.98:high?.90:.50;c.strokeStyle=priority==='maximum'?'#ffffff':high?'#f8ffff':'rgba(190,245,255,.88)';c.lineWidth=priority==='maximum'?2.45:high?2.0:1.1;for(const q of list){if(!q||q.dead||!Number.isFinite(q.x)||!Number.isFinite(q.y))continue;const r=Math.max(3,Number(q.radius)||4)+(high?3:2);c.beginPath();c.arc(q.x,q.y,r,0,Math.PI*2);c.stroke();rings++;if(priority==='maximum'&&Math.hypot(q.x-g.player.x,q.y-g.player.y)<280){c.globalAlpha=.45;c.beginPath();c.arc(q.x,q.y,r+4,0,Math.PI*2);c.stroke();c.globalAlpha=.98}}c.restore();EXPERIENCE_STATE.lastProjectileOverlay=rings}
window.VSX_ARCH?.register('render.after','settings.hostile-projectile-readability',hostileProjectileReadability,{priority:-35});

function ensureVignette(){if(document.getElementById('vsxLowHpVignette'))return;const d=document.createElement('div');d.id='vsxLowHpVignette';document.body.appendChild(d)}
ensureVignette();


const EXPERIENCE_STATE={perfLevel:0,perfTick:0,lastProjectileOverlay:0,playerOverlayFrames:0,lastAllyAlpha:1,aggregatedGroups:0,miniKey:null,graceUntil:0,graceRepairs:0};
function bossActive(g=game){return !!((g?.boss&&!g.boss.dead)||(g?.miniBoss&&!g.miniBoss.dead))}
function miniOwnerKey(){try{const m=window.VSX_MINIGAME_SYSTEM?.state?.();if(m?.active)return`modern:${m.id}`;const r=window.VSX_VOID_RELAY_SERIES?.state?.()||window.VSX_VOID_RELAY_SERIES;if(r?.active)return`relay:${r.id||'relay'}`;const l=VSX?.eventDebug?.mini;if(l?.active)return`legacy:${l.id||'legacy'}`;if(window.VSX_TRIAL?.active)return`trial:${VSX_TRIAL.id||'trial'}`}catch{}return null}
function aggregateDamageNumbers({game:g}){const s=ensureSettings();if(s.damageNumberStyle!=='aggregate'||!g?.texts?.length)return;const groups=new Map();for(const x of g.texts){if(!x||x.vsxAggregateSeen||x.life<=0)continue;const raw=String(x.text||''),m=raw.match(/^([+\-]?)([\d,]+)(?:\.\d+)?/);if(!m)continue;x.vsxAggregateSeen=true;const n=Number(m[2].replaceAll(',',''));if(!Number.isFinite(n))continue;const key=`${m[1]}:${x.color}:${Math.round(x.x/90)}:${Math.round(x.y/70)}`;(groups.get(key)||groups.set(key,[]).get(key)).push({x,n,sign:m[1]})}let made=0;for(const rows of groups.values()){if(rows.length<2)continue;const keep=rows[0].x,sum=rows.reduce((a,r)=>a+r.n,0),sign=rows[0].sign;keep.text=`${sign}${Math.round(sum).toLocaleString('en-US')}`;keep.size=Math.max(keep.size||15,17);for(const r of rows.slice(1))r.x.life=0;made++}if(made)EXPERIENCE_STATE.aggregatedGroups+=made}
function adaptivePerformanceAuthority({game:g,dt}){const s=ensureSettings(),mode=s.adaptivePerformance||'auto';EXPERIENCE_STATE.perfTick-=dt;if(mode==='off'){EXPERIENCE_STATE.perfLevel=0}else if(EXPERIENCE_STATE.perfTick<=0){EXPERIENCE_STATE.perfTick=.5;const fps=Number(g?.fps)||60,prev=EXPERIENCE_STATE.perfLevel;let next=prev;if(mode==='conservative'){if(fps<48)next=2;else if(fps<57)next=Math.max(1,prev);else if(fps>59)next=0}else{if(fps<42)next=2;else if(fps<52)next=1;else if(fps>57)next=0}EXPERIENCE_STATE.perfLevel=next}const level=EXPERIENCE_STATE.perfLevel,b=document.body;b.classList.toggle('vsxPerfLevel1',level===1);b.classList.toggle('vsxPerfLevel2',level===2);if(level>0&&Array.isArray(g?.particles)){const base=Number(window.GAME_CONFIG?.maxParticles)||600,cap=Math.max(90,Math.round(base*(level===2?.35:.65)));if(g.particles.length>cap)g.particles.splice(0,g.particles.length-cap)}}
function minigameGraceAuthority(){const s=ensureSettings(),key=miniOwnerKey(),now=performance.now();if(key&&key!==EXPERIENCE_STATE.miniKey){EXPERIENCE_STATE.miniKey=key;EXPERIENCE_STATE.graceUntil=now+(s.minigameTransitionGrace==='safe'?700:220)}else if(!key){EXPERIENCE_STATE.miniKey=null;EXPERIENCE_STATE.graceUntil=0}if(key&&now<EXPERIENCE_STATE.graceUntil){const repaired=window.VSX_MINIGAME_LIFECYCLE_GUARD?.fix?.('settings-transition-grace');if(repaired)EXPERIENCE_STATE.graceRepairs++}document.body.classList.toggle('vsxMinigameGraceActive',!!key&&now<EXPERIENCE_STATE.graceUntil)}
window.VSX_ARCH?.register('update.after','settings.experience-v4.runtime',ctx=>{aggregateDamageNumbers(ctx);adaptivePerformanceAuthority(ctx);minigameGraceAuthority()},{priority:-75});
function playerVisibilityOverlay({game:g,ctx:c}){const s=ensureSettings(),mode=s.playerVisibility||'soft';if(mode==='off'||!g?.player||g.state==='TITLE'||!c)return;const p=g.player,r=Math.max(12,p.radius||14)+(mode==='strong'?8:5),pulse=1+Math.sin((g.time||0)*7)*.06;c.save();c.translate(-g.camera.x,-g.camera.y);c.globalAlpha=mode==='strong'?.92:.58;c.strokeStyle=mode==='strong'?'#ffffff':'#bff4ff';c.lineWidth=mode==='strong'?2.6:1.5;c.shadowBlur=mode==='strong'?16:8;c.shadowColor='#76e7ff';c.beginPath();c.arc(p.x,p.y,r*pulse,0,Math.PI*2);c.stroke();if(mode==='strong'){for(let i=0;i<4;i++){const a=i*Math.PI/2,len=r+7;c.beginPath();c.moveTo(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r);c.lineTo(p.x+Math.cos(a)*len,p.y+Math.sin(a)*len);c.stroke()}}c.restore();EXPERIENCE_STATE.playerOverlayFrames++}
window.VSX_ARCH?.register('render.after','settings.player-visibility',playerVisibilityOverlay,{priority:-120});
const EXPERIENCE_ALLY_RENDER_BASE=VSX_NarrativeAlly.prototype.render;
VSX_NarrativeAlly.prototype.render=function(g){const s=ensureSettings();let a=s.allyVisualDensity==='minimal'?.50:s.allyVisualDensity==='reduced'?.78:1,dist=game?.player?Math.hypot(this.x-game.player.x,this.y-game.player.y):999;if(s.smartAllyFade&&dist<90)a*=Math.max(.28,dist/90);if(bossActive(game)){if(s.bossClarityMode==='strong')a*=.48;else if(s.bossClarityMode==='smart')a*=.72}if(EXPERIENCE_STATE.perfLevel===1)a*=.82;else if(EXPERIENCE_STATE.perfLevel===2)a*=.58;a=Math.max(.16,Math.min(1,a));EXPERIENCE_STATE.lastAllyAlpha=a;g.save();g.globalAlpha*=a;try{return EXPERIENCE_ALLY_RENDER_BASE.apply(this,arguments)}finally{g.restore()}};
const PAUSE_MENU=document.getElementById('pauseMenuBtn'),GAMEOVER_MENU=document.getElementById('menuBtn');
function askLeave(ev){if(!ensureSettings().confirmQuitRun)return;const live=game?.player&&['PLAYING','PAUSED'].includes(game.state);if(!live)return;ev.preventDefault();ev.stopImmediatePropagation();if(confirm(L('Leave this run and return to Main Menu?','Rời trận hiện tại và quay về Menu chính?')))game.menu()}
PAUSE_MENU?.addEventListener('click',askLeave,true);GAMEOVER_MENU?.addEventListener('click',askLeave,true);

const content=document.getElementById('vsxSettingsContent');if(content)new MutationObserver(()=>queueMicrotask(updateMapKeyLabel)).observe(content,{childList:true,subtree:true});
function adminCard(){if(!window.VSX_ADMIN?.open||!['run','meta'].includes(VSX_ADMIN.tab))return;const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||document.getElementById('vsxSettingsQaAdmin'))return;const c=document.createElement('div');c.id='vsxSettingsQaAdmin';c.className='vsxAdminCard';const s=ensureSettings();c.innerHTML=`<h3>SETTINGS EXPERIENCE · QA</h3><p>${L('Live settings authority: HUD + combat-experience profiles, ally visibility, boss clarity, minigame transition grace, damage aggregation and adaptive performance.','Authority Settings trực tiếp: profile HUD + trải nghiệm combat, độ rõ ally/player, Boss clarity, bảo vệ chuyển cảnh minigame, gộp damage và hiệu năng thích ứng.')}</p><div class="vsxPatchBadges"><span>V4</span><span>HUD ${VSX.esc(String(s.hudPreset).toUpperCase())}</span><span>EXP ${VSX.esc(String(s.experienceProfile).toUpperCase())}</span><span>PERF L${EXPERIENCE_STATE.perfLevel}</span></div><div class="row"><button data-experience="cinematic">CINEMATIC</button><button data-experience="balanced">BALANCED</button><button data-experience="competitive">COMPETITIVE</button><button data-experience="performance">PERFORMANCE</button></div><div class="row"><button data-setpreset="minimal">HUD MINIMAL</button><button data-setpreset="balanced">HUD BALANCED</button><button data-setpreset="tactical">HUD TACTICAL</button></div><pre>${VSX.esc(JSON.stringify(window.VSX_SETTINGS_UX?.selfTest?.()||{},null,2))}</pre>`;grid.appendChild(c);for(const b of c.querySelectorAll('[data-setpreset]'))b.onclick=()=>applyHudPreset(b.dataset.setpreset);for(const b of c.querySelectorAll('[data-experience]'))b.onclick=()=>applyExperienceProfile(b.dataset.experience)}
window.VSX_ARCH?.register('admin.refresh','settings.experience',adminCard,{priority:75});

window.VSX_SETTINGS_UX={version:'4.0.0',presets:HUD_PRESETS,experienceProfiles:EXPERIENCE_PROFILES,settings:()=>({...ensureSettings()}),applyPreset:applyHudPreset,applyExperienceProfile,renderProjectileOutline:hostileProjectileReadability,experienceState:()=>({...EXPERIENCE_STATE}),preview:(scenario='normal')=>{const c=document.getElementById('vsxSettingsContent');return c?renderLivePreview(c,scenario):null},selfTest:()=>{const s=ensureSettings(),ally=window.VSX_ALLY_HUD_POLICY?.state?.(),layers=['Boss','Elites','Enemies','Objectives','Objects','Allies','Loot'].map(k=>[k,!!s['minimapLayer'+k]]),valid=['auto','2','3'].includes(String(s.allyPanel))&&['minimal','balanced','tactical','custom'].includes(String(s.hudPreset))&&['cinematic','balanced','competitive','performance','custom'].includes(String(s.experienceProfile))&&['off','soft','strong'].includes(String(s.playerVisibility))&&['full','reduced','minimal'].includes(String(s.allyVisualDensity))&&['normal','high','maximum'].includes(String(s.hostileProjectilePriority))&&['individual','aggregate','off'].includes(String(s.damageNumberStyle))&&['off','smart','strong'].includes(String(s.bossClarityMode))&&['standard','safe'].includes(String(s.minigameTransitionGrace))&&['off','auto','conservative'].includes(String(s.adaptivePerformance));return{version:'4.0.0',preset:s.hudPreset,experienceProfile:s.experienceProfile,allyMode:s.allyPanel,ally,bossFocus:!!s.bossFocusMode,minigameFocus:!!s.minigameFocusMode,playerVisibility:s.playerVisibility,smartAllyFade:!!s.smartAllyFade,allyVisualDensity:s.allyVisualDensity,hostilePriority:s.hostileProjectilePriority,damageNumbers:s.damageNumberStyle,bossClarity:s.bossClarityMode,minigameGrace:s.minigameTransitionGrace,adaptivePerformance:s.adaptivePerformance,performanceLevel:EXPERIENCE_STATE.perfLevel,aggregatedGroups:EXPERIENCE_STATE.aggregatedGroups,graceRepairs:EXPERIENCE_STATE.graceRepairs,minimapLayers:Object.fromEntries(layers),previewScenario:PREVIEW_SCENARIO,valid}}};
window.VSX_ARCH?.registerFeature('settings_experience_v4',{system:'settings/hud/performance',owner:'VSX_SETTINGS_UX',check:()=>({ok:!!VSX_SETTINGS_UX.selfTest().valid,...VSX_SETTINGS_UX.selfTest()})});
applyMetaSettings();updateMapKeyLabel();
console.info(TAG,'ready',{version:'4.0.0',tabs:7,map:window.VSX_KEYBINDS?.label?.('map'),preset:ensureSettings().hudPreset,experience:ensureSettings().experienceProfile,ally:ensureSettings().allyPanel});
})();
