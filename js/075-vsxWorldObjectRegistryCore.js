(function(){
'use strict';
const ENTRIES={
 barrel:{name:{en:'Explosive Barrel',vi:'Thùng Nổ'},desc:{en:'Shoot it to detonate a 120px blast. Nearby barrels chain-react.',vi:'Bắn để kích nổ trong bán kính 120px. Thùng nổ gần đó sẽ nổ dây chuyền.'}},
 crate:{name:{en:'Supply Crate',vi:'Thùng Tiếp Tế'},desc:{en:'Shoot it open to release a Medkit, XP pickup or Frenzy pickup.',vi:'Bắn vỡ để nhận Medkit, XP hoặc vật phẩm Frenzy.'}},
 fountain:{name:{en:'Healing Fountain',vi:'Trạm Hồi Phục'},desc:{en:'Stand inside the cyan field to regenerate 1.8% Max HP per second. Press E when the Sanctuary Pulse is ready to heal, gain a small shield and clear nearby hostile shots.',vi:'Đứng trong vùng cyan để hồi 1,8% Máu Tối Đa mỗi giây. Nhấn E khi Xung Thánh Địa sẵn sàng để hồi máu, nhận lá chắn nhỏ và xóa đạn địch gần đó.'}},
 generator:{name:{en:'Overload Generator',vi:'Máy Phát Quá Tải'},desc:{en:'Shoot the cyan-core generator until it breaks. Its discharge shocks up to six nearby enemies.',vi:'Bắn máy phát lõi cyan đến khi vỡ. Xung điện sẽ đánh tối đa sáu kẻ địch gần đó.'}},
 goal:{name:{en:'Football Goal',vi:'Khung Thành'},desc:{en:'Press E nearby to score +500 and refresh or boost football systems for a short window.',vi:'Đứng gần và nhấn E để nhận +500 điểm và làm mới hoặc tăng cường hệ bóng đá trong thời gian ngắn.'}},
 shrine:{name:{en:'Void Shrine',vi:'Điện Thờ Hư Không'},desc:{en:'Press E nearby to open a three-choice meta encounter with a permanent run modifier.',vi:'Đứng gần và nhấn E để mở lựa chọn meta ba nhánh với modifier cho phần còn lại của run.'}}
};
try{VSX.save.codex.world_objects ||= {}}catch(_){}
const CODEX_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){
 if(cat==='world_objects'){
   const reg=window.VSX_WORLD_OBJECTS?.entries||ENTRIES;
   return Object.entries(reg).map(([id,d])=>[id,d.name?.[VSX.lang]||d.name?.en||id,d.desc?.[VSX.lang]||d.desc?.en||'']);
 }
 return CODEX_BASE.call(this,cat);
};
window.VSX_WORLD_OBJECTS={entries:{...ENTRIES},coreIds:Object.keys(ENTRIES)};
})();
