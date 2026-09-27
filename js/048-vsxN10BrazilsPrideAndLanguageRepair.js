(()=>{
'use strict';
const ID='n10_neymar';
const L=(en,vi)=>VSX.lang==='vi'?vi:en;
function decorateBrazilBundle(){
  const root=document.getElementById('vsxN10Package'); if(!root)return;
  root.dataset.lang=VSX.lang;
  const hero=root.querySelector('.n10HeroHead>div:first-child');
  if(hero){
    let mast=hero.querySelector('.n10BrazilMasthead');
    if(!mast){mast=document.createElement('div');mast.className='n10BrazilMasthead';hero.prepend(mast)}
    mast.innerHTML=`<span class="n10BrazilPride">${L("BRAZIL'S PRIDE","NIỀM KIÊU HÃNH BRAZIL")}</span><span class="n10BrazilTag">${L('O ÚLTIMO SAMBA · N10','O ÚLTIMO SAMBA · N10')}</span>`;
    const h=hero.querySelector('h3');if(h){h.classList.add('n10BrazilTitle');h.textContent=L('THE LAST SAMBA · N10','THE LAST SAMBA · VŨ CÔNG SAMBA CUỐI CÙNG')}
  }
  const kicker=root.querySelector('.n10Kicker');if(kicker)kicker.textContent=L('FOOTBALL LEGENDS · BRAZIL SIGNATURE','HUYỀN THOẠI SÂN CỎ · DẤU ẤN BRAZIL');

  /* Fully rewrite all package copy from the active language. Do not rely on renderArmory rerendering this late-mounted DOM. */
  const heroCopy=root.querySelector('.n10HeroHead>div:first-child>p');
  if(heroCopy)heroCopy.textContent=L(
    'A premium Samba-line bundle built around Neymar: the Legendary survivor, Samba Streetball, Brazil No.10 cosmetics, dribble-path aura and a complete N10 presentation across Shop, Survivor Pick, Collection and the in-run HUD.',
    'Gói Samba cao cấp dành riêng cho Neymar: mở N10 Legendary, Samba Đường Phố, bộ Brazil Số 10, Hào Quang Đường Rê và toàn bộ giao diện riêng của Neymar từ Cửa Hàng, Chọn Nhân Vật, Bộ Sưu Tập đến HUD trong trận.'
  );
  const detailCopy=[
    [
      'SIGNATURE GAMEPLAY','LỐI CHƠI ĐẶC TRƯNG',
      'TRICK → BAIT → ESCAPE → CREATE','KỸ THUẬT → NHỬ ĐỊCH → THOÁT HIỂM → KIẾN TẠO',
      'Neymar deliberately plays inside danger. He spends Samba Flow on situational tricks, baits the swarm into bad angles, then turns that chaos into an escape route or a new attacking lane.',
      'Neymar chủ động áp sát đàn quái. Cậu tiêu Nhịp Samba để tung kỹ thuật đúng tình huống, dụ đối thủ lao sai hướng rồi biến sự hỗn loạn thành đường thoát hoặc một góc tấn công mới.'
    ],
    [
      'N10 COSMETIC SET','BỘ MỸ THUẬT N10',
      'Brazil No.10 Signature Look','DẤU ẤN BRAZIL SỐ 10',
      'Yellow-green orb, electric gold-green aura, a subtle blue rim at high Flow, a curved dribble-path trail and restrained afterimages on skill moves.',
      'Orb vàng Brazil phối xanh lá, hào quang vàng-xanh điện, viền xanh lam khi Nhịp Samba lên cao, vệt rê bóng uốn cong và bóng ảnh nhẹ sau mỗi pha kỹ thuật.'
    ],
    [
      'N10 HUD EXPERIENCE','HUD CHIẾN ĐẤU N10',
      'Samba Flow · Combo · Showboat · Free Kick','Nhịp Samba · Combo · Biểu Diễn · Đá Phạt',
      'The dedicated N10 HUD tracks Flow, combo milestones, Showboat risk windows, Free Kick opportunities and Ultimate style diversity without crowding the existing combat HUD.',
      'HUD riêng của N10 theo dõi Nhịp Samba, các mốc combo, Cửa Sổ Biểu Diễn đầy rủi ro, cơ hội Đá Phạt và độ đa dạng kỹ thuật trong Tuyệt Kỹ mà không làm rối HUD chiến đấu hiện có.'
    ],
    [
      'EXCLUSIVE SET EFFECT','HIỆU ỨNG ĐỘC QUYỀN',
      'Dribble Path Aura','HÀO QUANG ĐƯỜNG RÊ',
      'A cosmetic-only dribble-path ambience and movement trail. Toggle it below or from the Admin QA panel; it never adds combat stats.',
      'Hiệu ứng thuần mỹ thuật tạo đường rê và vệt chuyển động riêng cho Neymar. Có thể bật hoặc tắt ngay bên dưới hay trong bảng kiểm thử Admin; hoàn toàn không cộng chỉ số chiến đấu.'
    ]
  ];
  root.querySelectorAll('.n10DetailCard').forEach((card,i)=>{
    const c=detailCopy[i];if(!c)return;
    const label=card.querySelector('span'),title=card.querySelector('b'),body=card.querySelector('p');
    if(label)label.textContent=L(c[0],c[1]);
    if(title)title.textContent=L(c[2],c[3]);
    if(body)body.textContent=L(c[4],c[5]);
  });
  const bonus=root.querySelector('.n10Bonus');
  if(bonus)bonus.innerHTML=`<b>${L('PACKAGE HIGHLIGHT','ĐIỂM NỔI BẬT CỦA GÓI')}</b> · ${L(
    'This is more than a skin unlock. The bundle completes the N10 identity across Shop presentation, Survivor Pick, Collection, Admin QA, character cosmetics and the dedicated gameplay HUD.',
    'Đây không chỉ là một gói trang phục. THE LAST SAMBA hoàn thiện toàn bộ bản sắc N10: cách trưng bày trong Cửa Hàng, Chọn Nhân Vật, Bộ Sưu Tập, bảng kiểm thử Admin, mỹ thuật nhân vật và HUD lối chơi riêng.'
  )}`;
  const single=root.querySelector('.n10SingleCard');
  if(single){
    const desc=single.querySelector('div:nth-child(2)>p');
    if(desc)desc.textContent=L(
      'Legendary Neymar revolves around Samba Flow, Showboat Window, Draw the Foul, Free Kick Spot, non-repeating trick combos and the Body Feint double dash.',
      'Neymar Legendary xoay quanh Nhịp Samba, Cửa Sổ Biểu Diễn, cơ chế Câu Lỗi → Đá Phạt, combo khuyến khích đổi kỹ thuật liên tục và Dash kép Body Feint để đánh lạc hướng đối thủ.'
    );
    const meta=single.querySelectorAll('.n10Meta span');
    if(meta[0])meta[0].textContent=L('Samba Streetball','Samba Đường Phố');
    if(meta[1])meta[1].textContent=L('THE LAST SAMBA','THE LAST SAMBA · Vũ Điệu Samba Cuối Cùng');
    if(meta[2])meta[2].textContent=L('Neymar — Brazil No. 10','Neymar — Brazil Số 10');
    const note=single.querySelector('.n10SmallNote');
    if(note)note.textContent=L(
      'Already own Neymar? The package automatically drops to the cosmetic/FX upgrade price.',
      'Đã sở hữu Neymar? Giá gói sẽ tự giảm; bạn chỉ trả phần trang phục và hiệu ứng còn thiếu.'
    );
  }
  /* Last-mile localization: this also repairs already-mounted package DOM if a previous wrapper failed to rerender. */
  if(VSX.lang==='vi'){
    const price=root.querySelector('.n10Price small');if(price&&!/TRẠNG THÁI/.test(price.textContent))price.textContent='GIÁ GÓI HIỆN TẠI';
    const priceB=root.querySelector('.n10Price b');if(priceB)priceB.textContent=priceB.textContent.replace(/\bSCORE\b/g,'ĐIỂM').replace(/^OWNED$/,'ĐÃ SỞ HỮU');
    const priceS=root.querySelector('.n10Price span');if(priceS)priceS.textContent=priceS.textContent.replace(/SURVIVOR(S)?/g,'NHÂN VẬT').replace('Includes survivor + skin + effect','Gồm Neymar + trang phục + hiệu ứng');
    const buy=root.querySelector('#vsxN10BuyBundle');if(buy)buy.textContent=buy.textContent.replace('BUY BUNDLE','MUA TRỌN GÓI').replace('PACKAGE OWNED','ĐÃ SỞ HỮU TRỌN GÓI').replace(/\bSCORE\b/g,'ĐIỂM');
    const fx=root.querySelector('#vsxN10ToggleFx');if(fx)fx.textContent=fx.textContent.replace('SET EFFECT: ON','HIỆU ỨNG: BẬT').replace('SET EFFECT: OFF','HIỆU ỨNG: TẮT');
    const own=root.querySelector('#vsxN10BuySurvivor');if(own)own.textContent=own.textContent.replace('BUY SURVIVOR','MUA NHÂN VẬT').replace(/^OWNED$/,'ĐÃ SỞ HỮU').replace(/\bSCORE\b/g,'ĐIỂM');
  }
}
function hardRefreshLocalizedUi(){
  try{
    if(document.getElementById('vsxArmoryScreen')?.classList.contains('active')){
      /* Use the final global binding, not window.renderArmory: this build re-wraps the function many times. */
      if(typeof renderArmory==='function')renderArmory();
    }
    if(document.getElementById('vsxSetupScreen')?.classList.contains('active'))VSX.renderSetup?.();
    if(document.getElementById('vsxCollectionScreen')?.classList.contains('active'))VSX.showCollection?.();
    queueMicrotask(()=>{decorateBrazilBundle();window.VSX_FOOTBALL_LAYOUT_HELPERS?.refreshN10?.()});
  }catch(e){console.warn('[N10 language refresh]',e)}
}
/* Directly wrap the FINAL language binding. This is intentionally not window.vsxApplyLanguage. */
const LANG_BASE=vsxApplyLanguage;
vsxApplyLanguage=function(){const r=LANG_BASE.apply(this,arguments);hardRefreshLocalizedUi();return r};
/* Redundant observer makes the Main Menu toggle future-proof even if a later patch re-wraps language again. */
new MutationObserver((records)=>{if(records.some(r=>r.attributeName==='lang'))hardRefreshLocalizedUi()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
/* And refresh every package render so the Brazil masthead never gets lost. */
const ARMORY_BASE=renderArmory;
renderArmory=function(){const r=ARMORY_BASE.apply(this,arguments);if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='packages')queueMicrotask(decorateBrazilBundle);return r};
const langBtn=document.getElementById('vsxLangBtn');if(langBtn)langBtn.addEventListener('click',()=>setTimeout(hardRefreshLocalizedUi,0));
queueMicrotask(decorateBrazilBundle);
window.VSX_N10_BRAZIL_UI={refresh:hardRefreshLocalizedUi,decorate:decorateBrazilBundle};
})();
