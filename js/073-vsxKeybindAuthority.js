(function(){
'use strict';
const TAG='[VSX KEYBINDS]';
const DEFS={
 moveUp:{canonical:'ArrowUp',slots:2,defaults:['KeyW','ArrowUp'],en:'Move Up',vi:'Di chuyển lên',hintEn:'Primary / alternate',hintVi:'Phím chính / phụ'},
 moveDown:{canonical:'ArrowDown',slots:2,defaults:['KeyS','ArrowDown'],en:'Move Down',vi:'Di chuyển xuống',hintEn:'Primary / alternate',hintVi:'Phím chính / phụ'},
 moveLeft:{canonical:'ArrowLeft',slots:2,defaults:['KeyA','ArrowLeft'],en:'Move Left',vi:'Di chuyển trái',hintEn:'Primary / alternate',hintVi:'Phím chính / phụ'},
 moveRight:{canonical:'ArrowRight',slots:2,defaults:['KeyD','ArrowRight'],en:'Move Right',vi:'Di chuyển phải',hintEn:'Primary / alternate',hintVi:'Phím chính / phụ'},
 dash:{canonical:'ShiftLeft',slots:2,defaults:['ShiftLeft','ShiftRight'],en:'Dash',vi:'Lướt',hintEn:'Movement burst',hintVi:'Bứt tốc'},
 primary:{canonical:'Space',slots:1,defaults:['Space'],en:'Primary / Confirm',vi:'Chính / Xác nhận',hintEn:'Ultimate · continue · confirm',hintVi:'Tuyệt Kỹ · tiếp tục · xác nhận'},
 interact:{canonical:'KeyE',slots:1,defaults:['KeyE'],en:'Interact / Reroll',vi:'Tương tác / Đổi lựa chọn',hintEn:'Interact in play · reroll at Level Up',hintVi:'Tương tác khi chơi · đổi thẻ khi Lên Cấp'},
 skip:{canonical:'KeyQ',slots:1,defaults:['KeyQ'],en:'Skip Upgrade',vi:'Bỏ nâng cấp',hintEn:'Level Up screen',hintVi:'Màn hình Lên Cấp'},
 pause:{canonical:'Escape',slots:2,defaults:['Escape','KeyP'],en:'Pause / Back',vi:'Tạm dừng / Quay lại',hintEn:'Pause gameplay · back in menus',hintVi:'Tạm dừng gameplay · quay lại menu'},
 mute:{canonical:'KeyM',slots:1,defaults:['KeyM'],en:'Mute',vi:'Âm thanh',hintEn:'Toggle sound',hintVi:'Bật / tắt âm thanh'},
 boost:{canonical:'KeyB',slots:1,defaults:['KeyB'],en:'Tactical Boost',vi:'Tăng cường chiến thuật',hintEn:'Activate equipped boost',hintVi:'Kích hoạt tăng cường đã trang bị'},
 select1:{canonical:'Digit1',slots:1,defaults:['Digit1'],en:'Choice 1',vi:'Lựa chọn 1',hintEn:'Level / reward choices',hintVi:'Chọn nâng cấp / phần thưởng'},
 select2:{canonical:'Digit2',slots:1,defaults:['Digit2'],en:'Choice 2',vi:'Lựa chọn 2',hintEn:'Level / reward choices',hintVi:'Chọn nâng cấp / phần thưởng'},
 select3:{canonical:'Digit3',slots:1,defaults:['Digit3'],en:'Choice 3',vi:'Lựa chọn 3',hintEn:'Level / reward choices',hintVi:'Chọn nâng cấp / phần thưởng'}
};
const ORDER=['moveUp','moveDown','moveLeft','moveRight','dash','primary','interact','skip','pause','mute','boost','select1','select2','select3'];
const RESERVED=new Set(['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Tab','CapsLock','MetaLeft','MetaRight','ControlLeft','ControlRight','AltLeft','AltRight']);
const synthetic=new WeakSet();
let capture=null,returnTarget='title',status='';
function cloneDefaults(){const o={};for(const id of ORDER)o[id]=[...DEFS[id].defaults];return o}
function normalize(raw){const out=cloneDefaults();if(raw&&typeof raw==='object')for(const id of ORDER){const d=DEFS[id],v=Array.isArray(raw[id])?raw[id].filter(x=>typeof x==='string'&&x):[];if(v.length)out[id]=v.slice(0,d.slots);while(out[id].length<d.slots)out[id].push(d.defaults[out[id].length]||'')}return out}
function save(){VSX.save.settings ||= {};VSX.save.settings.keybinds=normalize(VSX.save.settings.keybinds);try{vsxSave?.()}catch(e){console.warn(TAG,'save',e)}}
function bindings(){VSX.save.settings ||= {};VSX.save.settings.keybinds=normalize(VSX.save.settings.keybinds);return VSX.save.settings.keybinds}
function labelCode(code){if(!code)return '—';const m={Space:'SPACE',Escape:'ESC',ShiftLeft:'L-SHIFT',ShiftRight:'R-SHIFT',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Backspace:'BACKSPACE',Enter:'ENTER'};if(m[code])return m[code];if(/^Key[A-Z]$/.test(code))return code.slice(3);if(/^Digit[0-9]$/.test(code))return code.slice(5);return code.replace(/Left$/,' L').replace(/Right$/,' R').replace(/^Numpad/,'NUM ')}
function label(id,all=false){const v=bindings()[id]||DEFS[id].defaults;return all?v.filter(Boolean).map(labelCode).join(' / '):labelCode(v[0]||DEFS[id].defaults[0])}
function actionForCode(code){const b=bindings();for(const id of ORDER)if((b[id]||[]).includes(code))return id;return null}
function canonicalOwner(code){for(const id of ORDER)if(DEFS[id].canonical===code||DEFS[id].defaults.includes(code))return id;return null}
function conflicts(){const seen=new Map(),out=[];for(const id of ORDER)for(const c of bindings()[id]||[]){if(!c)continue;if(seen.has(c)&&seen.get(c)!==id)out.push([c,seen.get(c),id]);else seen.set(c,id)}return out}
function movementLabel(){return `${label('moveUp')} ${label('moveLeft')} ${label('moveDown')} ${label('moveRight')} / ${[bindings().moveUp?.[1],bindings().moveLeft?.[1],bindings().moveDown?.[1],bindings().moveRight?.[1]].map(labelCode).join(' ')}`}
function refreshText(){
 try{
  I18N.en.ready=`READY — ${label('primary')}`;I18N.vi.ready=`SẴN SÀNG — ${label('primary')}`;
  I18N.en.interact=`INTERACT — ${label('interact')}`;I18N.vi.interact=`TƯƠNG TÁC — ${label('interact')}`;
  I18N.en.boostReady=`READY — ${label('boost')}`;I18N.vi.boostReady=`SẴN SÀNG — ${label('boost')}`;
  I18N.en.continueHotkey=`${label('primary')} — CONTINUE`;I18N.vi.continueHotkey=`${label('primary')} — TIẾP TỤC`;
 }catch{}
 const controls=[...document.querySelectorAll('#titleScreen .controls > div')];
 if(controls[0]?.querySelector('span'))controls[0].querySelector('span').textContent=movementLabel();
 if(controls[2]?.querySelector('span'))controls[2].querySelector('span').textContent=label('pause',true);
 if(controls[3]?.querySelector('span'))controls[3].querySelector('span').textContent=`${label('select1')} / ${label('select2')} / ${label('select3')} · ${label('skip')} Skip · ${label('interact')} Reroll`;
 if(controls[4]?.querySelector('span'))controls[4].querySelector('span').textContent=label('mute');
 if(controls[5]?.querySelector('span'))controls[5].querySelector('span').textContent=label('primary');
 const shortcuts=[...document.querySelectorAll('#pauseScreen .vsxShortcutGrid strong')];if(shortcuts[0])shortcuts[0].textContent=movementLabel();if(shortcuts[1])shortcuts[1].textContent=`${label('mute')} — TOGGLE`;
 const ps=document.getElementById('vsxPauseSettingsBtn');if(ps)ps.textContent=VSX.lang==='vi'?'CÀI ĐẶT':'SETTINGS';const pc=document.querySelector('#pauseScreen .vsxOverlayCopy');if(pc)pc.textContent=VSX.lang==='vi'?`Mô phỏng đã tạm dừng. ${label('pause',true)} hoặc ${label('primary')} để tiếp tục.`:`Combat simulation suspended. ${label('pause',true)} or ${label('primary')} to resume.`;
 const rs=document.querySelector('#restartBtn span');if(rs)rs.textContent=`(${label('primary')})`;
 const cg=document.querySelectorAll('#levelModal .vsxKeyGuide kbd');if(cg[0])cg[0].textContent=label('skip');if(cg[1])cg[1].textContent=label('interact');
 const cc=document.getElementById('chestContinue');if(cc)cc.textContent=VSX.lang==='vi'?`${label('primary')} — TIẾP TỤC`:`${label('primary')} — CONTINUE`;
 const bc=document.getElementById('vsxBriefConfirm');if(bc)bc.textContent=VSX.lang==='vi'?`${label('primary')} - BẮT ĐẦU SỰ KIỆN`:`${label('primary')} - BEGIN EVENT`;
 const b=document.getElementById('vsxBoostButton');if(b&&!game?.boostActive)b.textContent=I18N[VSX.lang].boostReady;
 try{game?.updateHUD?.(true)}catch{}
}
function reset(){VSX.save.settings.keybinds=cloneDefaults();status=VSX.lang==='vi'?'Đã khôi phục phím mặc định.':'Default keybinds restored.';save();refreshText();render(document.getElementById('vsxSettingsContent'))}
function setBinding(id,slot,code){const b=bindings();if(RESERVED.has(code)){status=VSX.lang==='vi'?`${labelCode(code)} được dành cho hệ thống / QA.`:`${labelCode(code)} is reserved for system / QA.`;return false}let occupied=null;for(const oid of ORDER)for(let i=0;i<(b[oid]||[]).length;i++)if(b[oid][i]===code&&(oid!==id||i!==slot)){occupied={oid,i};break}if(occupied){const mode=VSX.save?.settings?.keyConflictMode||'cancel';if(mode!=='swap'){status=VSX.lang==='vi'?`${labelCode(code)} đã dùng cho ${DEFS[occupied.oid].vi}.`:`${labelCode(code)} is already used by ${DEFS[occupied.oid].en}.`;return false}const old=b[id]?.[slot]||'';b[occupied.oid][occupied.i]=old;b[id][slot]=code;status=VSX.lang==='vi'?`Đã hoán đổi ${DEFS[id].vi} ↔ ${DEFS[occupied.oid].vi}.`:`Swapped ${DEFS[id].en} ↔ ${DEFS[occupied.oid].en}.`}else{b[id][slot]=code;status=VSX.lang==='vi'?`Đã gán ${DEFS[id].vi}: ${labelCode(code)}.`:`Bound ${DEFS[id].en}: ${labelCode(code)}.`}VSX.save.settings.keybinds=normalize(b);save();refreshText();if(id==='map'||occupied?.oid==='map'){const mm=document.getElementById('vsxMinimapToggle');if(mm)mm.textContent=label('map')}return true}
function render(parent){if(!parent)return;parent.innerHTML='';const intro=document.createElement('div');intro.className='vsxKeybindIntro';intro.textContent=VSX.lang==='vi'?'Chọn một phím rồi nhấn phím mới. Phím mặc định chính là các nút đang dùng trong game. Hệ thống chặn trùng phím để tránh một thao tác kích hoạt hai cơ chế cùng lúc.':'Select a binding, then press a new key. Defaults match the controls currently used by the game. Duplicate bindings are blocked to prevent one input from firing two systems at once.';parent.appendChild(intro);const grid=document.createElement('div');grid.className='vsxKeybindGrid';for(const id of ORDER){const d=DEFS[id],row=document.createElement('div');row.className='vsxKeybindRow';row.innerHTML=`<div class="vsxKeybindName"><b>${VSX.esc(VSX.lang==='vi'?d.vi:d.en)}</b><small>${VSX.esc(VSX.lang==='vi'?d.hintVi:d.hintEn)}</small></div><div class="vsxKeybindSlots"></div>`;const slots=row.querySelector('.vsxKeybindSlots');for(let i=0;i<d.slots;i++){const bt=document.createElement('button');bt.type='button';bt.className='vsxKeybindButton';bt.textContent=labelCode(bindings()[id][i]);if(capture?.id===id&&capture.slot===i){bt.classList.add('capturing');bt.textContent=VSX.lang==='vi'?'NHẤN PHÍM…':'PRESS KEY…'}bt.onclick=()=>{capture={id,slot:i};status=VSX.lang==='vi'?'Nhấn phím mới · ESC cũng có thể được gán.':'Press the new key · ESC may also be assigned.';render(parent)};slots.appendChild(bt)}grid.appendChild(row)}parent.appendChild(grid);const st=document.createElement('div');st.className='vsxKeybindStatus'+(status&&/already|reserved|đã dùng|dành/.test(status)?' warn':'');st.textContent=status||((conflicts().length===0)?(VSX.lang==='vi'?'Không có xung đột phím.':'No key conflicts.'):'KEY CONFLICT');parent.appendChild(st);const r=document.createElement('div');r.className='row';r.style.marginTop='12px';const resetBtn=document.createElement('button');resetBtn.type='button';resetBtn.textContent=VSX.lang==='vi'?'ĐẶT LẠI PHÍM MẶC ĐỊNH':'RESET DEFAULT KEYBINDS';resetBtn.onclick=reset;r.appendChild(resetBtn);parent.appendChild(r)}
function dispatchCanonical(type,canonical,e){const ev=new KeyboardEvent(type,{code:canonical,key:labelCode(canonical),bubbles:true,cancelable:true,repeat:!!e.repeat,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey});synthetic.add(ev);document.dispatchEvent(ev)}
function inputBridge(e){if(synthetic.has(e))return;if(capture&&e.type==='keydown'){e.preventDefault();e.stopImmediatePropagation();const c={...capture};capture=null;if(setBinding(c.id,c.slot,e.code)){};if(SETTINGS_TAB==='keybinds')render(document.getElementById('vsxSettingsContent'));return}const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;const act=actionForCode(e.code),owner=canonicalOwner(e.code);if(act){const d=DEFS[act],can=d.canonical;if(d.defaults.includes(e.code)||can===e.code)return;e.preventDefault();e.stopImmediatePropagation();dispatchCanonical(e.type,can,e);return}if(owner){e.preventDefault();e.stopImmediatePropagation()}}
function openFromPause(){returnTarget='pause';document.getElementById('pauseScreen')?.classList.remove('active');showSettings('gameplay')}
function openFromTitle(){returnTarget='title';showSettings('gameplay')}
function closeSettings(){const sc=document.getElementById('vsxSettingsScreen');sc?.classList.remove('active');capture=null;if(returnTarget==='pause'&&game?.state==='PAUSED'){document.getElementById('pauseScreen')?.classList.add('active');hud?.classList.add('active')}else{titleScreen?.classList.add('active');returnTarget='title'}refreshText()}
const API={version:'1.0.0',defs:DEFS,order:ORDER,bindings,label,labelCode,normalize,render,reset,conflicts,refreshText,openFromPause,openFromTitle,closeSettings};window.VSX_KEYBINDS=API;

// Preserve existing Settings reset semantics, now including keybind defaults.
if(typeof defaultMetaSettings==='function'){const BASE=defaultMetaSettings;defaultMetaSettings=function(){const s=BASE();s.keybinds=cloneDefaults();return s}}
VSX.save.settings ||= {};VSX.save.settings.keybinds=normalize(VSX.save.settings.keybinds);save();
window.addEventListener('keydown',inputBridge,true);window.addEventListener('keyup',inputBridge,true);
const pauseSettings=document.getElementById('vsxPauseSettingsBtn');if(pauseSettings)pauseSettings.onclick=openFromPause;
const titleSettings=document.getElementById('vsxSettingsBtn');if(titleSettings)titleSettings.onclick=openFromTitle;
const back=document.getElementById('vsxSettingsBack');if(back)back.onclick=closeSettings;
if(typeof vsxApplyLanguage==='function'){const LANG_BASE=vsxApplyLanguage;vsxApplyLanguage=function(){const r=LANG_BASE.apply(this,arguments);refreshText();if(document.getElementById('vsxSettingsScreen')?.classList.contains('active')&&SETTINGS_TAB==='keybinds')render(document.getElementById('vsxSettingsContent'));return r}}

// QA diagnostics in Admin without adding a gameplay update/render wrapper.
function adminCard(){if(!window.VSX_ADMIN?.open||!['run','meta'].includes(VSX_ADMIN.tab))return;const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||document.getElementById('vsxKeybindQaAdmin'))return;const c=document.createElement('div');c.id='vsxKeybindQaAdmin';c.className='vsxAdminCard';const conf=conflicts();c.innerHTML=`<h3>${VSX.lang==='vi'?'KEYBINDS · QA':'KEYBINDS · QA'}</h3><p>${VSX.lang==='vi'?'Authority dịch phím tùy chỉnh sang input canonical, không sửa từng expansion handler.':'Custom bindings translate to canonical input without patching every expansion handler.'}</p><div class="vsxPatchBadges"><span>${ORDER.length} ACTIONS</span><span>${conf.length?'CONFLICT '+conf.length:'NO CONFLICT'}</span><span>PAUSE · ${VSX.esc(label('pause',true))}</span><span>PRIMARY · ${VSX.esc(label('primary'))}</span></div><pre>${VSX.esc(JSON.stringify({bindings:bindings(),conflicts:conf},null,2))}</pre>`;grid.appendChild(c)}
const adm=document.getElementById('vsxAdminContent');if(adm)new MutationObserver(()=>queueMicrotask(adminCard)).observe(adm,{childList:true,subtree:false});document.addEventListener('click',e=>{if(e.target?.closest?.('[data-admin-tab],#vsxAdminBtn,#vsxLangBtn'))queueMicrotask(adminCard)});

refreshText();
console.info(TAG,'ready',{actions:ORDER.length,conflicts:conflicts()});
})();
