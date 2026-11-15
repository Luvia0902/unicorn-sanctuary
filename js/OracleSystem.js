// =========================================================================
// OracleSystem：心安宮五步儀式邏輯（許願星泉稟報、光之共鳴擲筊、靈籤變色飛升動畫、靈籤資料庫 ORACLE_DATABASE 與祈願樹心願儲存）
// =========================================================================

export const ORACLE_DATABASE = [
    // ==================== 1. 心靈療癒與陪伴 (4 籤) ====================
    {
        category: '心靈療癒與陪伴',
        title: '【第一籤・上上】月光星泉之淨化',
        poem: '「迷霧終隨夜風散，星泉洗盡舊塵埃；\n 心安即是歸途處，靜待晨光破曉來。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>過去這段時間您辛苦了。那些讓您反覆糾結或焦慮的事，其實已經過了最艱難的時刻。請先放下對「立刻看到結果」的執著，給自己一個喘息的夜晚，您所期盼的轉機正在暗中成形。',
        plainAdvice: '過去這段時間您辛苦了。那些讓您反覆糾結或焦慮的事，其實已經過了最艱難的時刻。請先放下對「立刻看到結果」的執著，給自己一個喘息的夜晚，您所期盼的轉機正在暗中成形。',
        luckyItem: '✨ 開運星語：月光銀白・正北方・睡前深呼吸三次放下手機'
    },
    {
        category: '心靈療癒與陪伴',
        title: '【第二籤・上吉】千年靈樹之庇佑',
        poem: '「根深不懼風霜襲，葉茂自然百鳥依；\n 先養元神再圖遠，春來花發滿高枝。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>現在最需要被照顧的，是您自己的身心能量。別把所有責任都一個人扛在肩上，適時放慢腳步、好好睡一覺或吃頓喜歡的美食。當您的內在恢復飽滿，問題自然迎刃而解。',
        plainAdvice: '現在最需要被照顧的，是您自己的身心能量。別把所有責任都一個人扛在肩上，適時放慢腳步、好好睡一覺或吃頓喜歡的美食。當您的內在恢復飽滿，問題自然迎刃而解。',
        luckyItem: '✨ 開運星語：森林翠綠・東方・泡一杯溫熱飲品犒賞自己'
    },
    {
        category: '心靈療癒與陪伴',
        title: '【第三籤・大吉】星塵羽翼之溫柔',
        poem: '「莫責昔日微瑕處，萬物生來有陰晴；\n 輕擁己心如初雪，星河萬里為君明。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>您對自己太嚴格了！獨角獸看見了您不為人知的努力與善良。允許自己偶爾有脆弱或不想努力的時刻，接納當下的不完美，自我原諒將為您開啟全新的輕盈能量。',
        plainAdvice: '您對自己太嚴格了！獨角獸看見了您不為人知的努力與善良。允許自己偶爾有脆弱或不想努力的時刻，接納當下的不完美，自我原諒將為您開啟全新的輕盈能量。',
        luckyItem: '✨ 開運星語：薰衣草紫・西南方・對鏡中的自己微笑說聲辛苦了'
    },
    {
        category: '心靈療癒與陪伴',
        title: '【第四籤・上吉】靜謐森湖之澄明',
        poem: '「風止波平映皓月，無須外求問紛紜；\n 靜觀一念歸澄澈，自有幽香伴曉雲。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>外界的聲音與建議太多，反而容易讓您迷失。今天請暫時關閉不必要的社交干擾，留給自己一段獨處的空白時光。當心湖平靜下來，您內心真正的渴望就會浮現。',
        plainAdvice: '外界的聲音與建議太多，反而容易讓您迷失。今天請暫時關閉不必要的社交干擾，留給自己一段獨處的空白時光。當心湖平靜下來，您內心真正的渴望就會浮現。',
        luckyItem: '✨ 開運星語：星泉冰藍・西北方・聆聽五分鐘輕柔純音樂'
    },

    // ==================== 2. 事業與方向迷惘 (4 籤) ====================
    {
        category: '事業與方向迷惘',
        title: '【第五籤・大吉】黃金獨角之破曉',
        poem: '「靈角微明指北辰，莫疑前路有荊榛；\n 順心而動皆成瑞，自有一番新氣象。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>您心裡其實已經有一個隱約的答案與方向了！不要害怕踏出那一步，獨角獸的黃金角正為您照亮前路，相信您的直覺與專業，勇敢推進，貴人與助力會在行動後自然浮現。',
        plainAdvice: '您心裡其實已經有一個隱約的答案與方向了！不要害怕踏出那一步，獨角獸的黃金角正為您照亮前路，相信您的直覺與專業，勇敢推進，貴人與助力會在行動後自然浮現。',
        luckyItem: '✨ 開運星語：璀璨曜金・正南方・寫下明日最想完成的一件小目標'
    },
    {
        category: '事業與方向迷惘',
        title: '【第六籤・上上】星途破繭之飛躍',
        poem: '「久蟄潛修非枉然，一朝展翼入雲巔；\n 昔時積累皆成器，萬丈星光耀眼前。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>過去看似沒有立即回報的累積與磨練，其實都在為接下來的舞台做準備。請大膽展現您的作品、想法或爭取新的機會，現在是破繭而出、獲得肯定與突破的絕佳時機！',
        plainAdvice: '過去看似沒有立即回報的累積與磨練，其實都在為接下來的舞台做準備。請大膽展現您的作品、想法或爭取新的機會，現在是破繭而出、獲得肯定與突破的絕佳時機！',
        luckyItem: '✨ 開運星語：琥珀暖金・東南方・整理桌面迎接全新工作運勢'
    },
    {
        category: '事業與方向迷惘',
        title: '【第七籤・中平轉吉】迷霧森林之靜待',
        poem: '「林深霧重莫急行，駐足聽風心自明；\n 待得雲開明月現，一山翠色任君行。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>如果現在覺得卡關或資訊不明朗，代表「時機尚未完全成熟」。此時不宜勉強做衝動決定，建議先觀察、收集資訊並穩固基本盤，再過一小段時間局勢就會豁然開朗。',
        plainAdvice: '如果現在覺得卡關或資訊不明朗，代表「時機尚未完全成熟」。此時不宜勉強做衝動決定，建議先觀察、收集資訊並穩固基本盤，再過一小段時間局勢就會豁然開朗。',
        luckyItem: '✨ 開運星語：深海琉璃藍・正北方・將複雜問題拆解成三個小步驟'
    },
    {
        category: '事業與方向迷惘',
        title: '【第八籤・上吉】北辰引路之貴人',
        poem: '「獨行何懼路迢遙，忽有清風送玉簫；\n 虛懷若谷迎新友，指點迷津過畫橋。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>目前的瓶頸不需要一個人埋頭苦思。請試著向有經驗的前輩、值得信賴的夥伴請益，或是接觸跨領域的新資訊。一句無心的提點或一次交流，將為您打開意想不到的新局。',
        plainAdvice: '目前的瓶頸不需要一個人埋頭苦思。請試著向有經驗的前輩、值得信賴的夥伴請益，或是接觸跨領域的新資訊。一句無心的提點或一次交流，將為您打開意想不到的新局。',
        luckyItem: '✨ 開運星語：極光青綠・東北方・主動向一位欣賞的人表達感謝或請益'
    },

    // ==================== 3. 感情與人際緣分 (4 籤) ====================
    {
        category: '感情與人際緣分',
        title: '【第九籤・上吉】極光彩翼之良緣',
        poem: '「同頻星彩自相逢，何須強求逆水風；\n 溫柔對待眼前事，善緣已在不言中。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>無論是感情、合作還是人際關係，真誠與自在是最好的頻率。不需要為了討好誰而委屈自己，保持您原本的善良與界線，真正懂得珍惜您的人與美好緣分正在向您靠近。',
        plainAdvice: '無論是感情、合作還是人際關係，真誠與自在是最好的頻率。不需要為了討好誰而委屈自己，保持您原本的善良與界線，真正懂得珍惜您的人與美好緣分正在向您靠近。',
        luckyItem: '✨ 開運星語：櫻花柔粉・正東方・穿搭加入一點柔和亮色系'
    },
    {
        category: '感情與人際緣分',
        title: '【第十籤・上上】雙星交輝之默契',
        poem: '「銀河清淺映雙星，不語亦知彼此情；\n 敞開心扉通一語，春風化雨百花馨。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>若心中有在乎的人或想修復的關係，請放下猜忌與防備，用溫和坦率的方式傳達您的真實心意。對方其實比您想像的更願意傾聽，一次真誠的對話將讓彼此距離大幅拉近。',
        plainAdvice: '若心中有在乎的人或想修復的關係，請放下猜忌與防備，用溫和坦率的方式傳達您的真實心意。對方其實比您想像的更願意傾聽，一次真誠的對話將讓彼此距離大幅拉近。',
        luckyItem: '✨ 開運星語：珊瑚暖橘・正南方・傳送一則溫暖問候給在乎的人'
    },
    {
        category: '感情與人際緣分',
        title: '【第十一籤・上吉】月下花開之從容',
        poem: '「花開自有春風度，莫嘆枝頭尚未紅；\n 先綻芬芳充己身，蝶來何須問西東。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>好的緣分建立在您對自己生活的熱愛之上。當您把重心放回讓自己開心、充實與發光的事物上，您散發出的自信魅力，自然會吸引到頻率契合、懂得尊重您的優質對象與夥伴。',
        plainAdvice: '好的緣分建立在您對自己生活的熱愛之上。當您把重心放回讓自己開心、充實與發光的事物上，您散發出的自信魅力，自然會吸引到頻率契合、懂得尊重您的優質對象與夥伴。',
        luckyItem: '✨ 開運星語：玫瑰香檳金・西南方・安排一場讓自己開心的散步或小旅行'
    },
    {
        category: '感情與人際緣分',
        title: '【第十二籤・大吉】清泉映月之釋懷',
        poem: '「落花流水隨他去，明月依然照碧溪；\n 斬斷紛擾留清淨，前途自有好花期。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>那些消耗您情緒、讓您感到內耗的人際關係，獨角獸正賜予您溫柔而堅定的勇氣去設立界線。學會課題分離，把珍貴的心力留給真正在乎您的人，您的世界將頓時清爽明亮。',
        plainAdvice: '那些消耗您情緒、讓您感到內耗的人際關係，獨角獸正賜予您溫柔而堅定的勇氣去設立界線。學會課題分離，把珍貴的心力留給真正在乎您的人，您的世界將頓時清爽明亮。',
        luckyItem: '✨ 開運星語：月光珍珠白・正西方・清理房間裡一件不再需要的舊物'
    },

    // ==================== 4. 平安順遂祈福 (4 籤) ====================
    {
        category: '平安順遂祈福',
        title: '【第十三籤・上上】瑞獸金光之守護',
        poem: '「靈獸巡疆百煞消，星光護佑路迢迢；\n 出入平安皆順遂，福澤綿長樂逍遙。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>獨角獸的聖潔金光已為您與家人張開守護結界。近期無論是外出遠行、日常事務或健康調養，皆有吉星庇佑、逢凶化吉。請懷抱感恩與安心的心情，穩步迎接每一天。',
        plainAdvice: '獨角獸的聖潔金光已為您與家人張開守護結界。近期無論是外出遠行、日常事務或健康調養，皆有吉星庇佑、逢凶化吉。請懷抱感恩與安心的心情，穩步迎接每一天。',
        luckyItem: '✨ 開運星語：聖殿純金・正中央・出門前深呼吸感受陽光或微風'
    },
    {
        category: '平安順遂祈福',
        title: '【第十四籤・大吉】晨露生機之安康',
        poem: '「瑤草沾露生紫煙，四時調順體安然；\n 莫憂微恙終將散，笑看松鶴舞晴川。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>森林晨露正為您注入滿滿的生命力。若近期為自己或親友的健康與平安祈福，請放寬心，配合規律作息與溫和調養，身心元氣正在穩定回升，一切都朝著平安康泰的方向發展。',
        plainAdvice: '森林晨露正為您注入滿滿的生命力。若近期為自己或親友的健康與平安祈福，請放寬心，配合規律作息與溫和調養，身心元氣正在穩定回升，一切都朝著平安康泰的方向發展。',
        luckyItem: '✨ 開運星語：翡翠嫩綠・正東方・今日多喝一杯溫開水滋潤身心'
    },
    {
        category: '平安順遂祈福',
        title: '【第十五籤・上吉】和風甘雨之順境',
        poem: '「細雨潤田萬物生，家門和樂百事亨；\n 莫道尋常無奇事，平安便是最高情。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>看似平淡安穩的日常，其實是宇宙賜予最珍貴的祝福。近期生活步調將趨於平順和諧，先前的波折已逐漸平息，請珍惜眼前的微小幸福，好運正像春雨般無聲滋養著您的生活。',
        plainAdvice: '看似平淡安穩的日常，其實是宇宙賜予最珍貴的祝福。近期生活步調將趨於平順和諧，先前的波折已逐漸平息，請珍惜眼前的微小幸福，好運正像春雨般無聲滋養著您的生活。',
        luckyItem: '✨ 開運星語：暖陽米金・東南方・記錄今天發生的一件微小好事'
    },
    {
        category: '平安順遂祈福',
        title: '【第十六籤・上上】萬星拱照之圓滿',
        poem: '「群星拱月映華堂，所願皆成福壽長；\n 心存善念天必佑，四時吉慶滿庭芳。」',
        advice: '🦄 <b>獨角獸療癒指引：</b><br>您的虔誠祈願已化為星果升入夜空，並獲得森林聖域的圓滿回應！您所掛念的家人、朋友或自身計畫，都將在溫暖的守護中順遂推進，請帶著微笑與信心迎接即將到來的好消息。',
        plainAdvice: '您的虔誠祈願已化為星果升入夜空，並獲得森林聖域的圓滿回應！您所掛念的家人、朋友或自身計畫，都將在溫暖的守護中順遂推進，請帶著微笑與信心迎接即將到來的好消息。',
        luckyItem: '✨ 開運星語：極光星耀金・正南方・將這份平安喜悅分享給身邊的人'
    }
];

export function showToast(msg) {
    const b = document.getElementById('toastBanner');
    if (!b) return;
    b.innerHTML = msg;
    b.style.display = 'block';
    clearTimeout(b._timer);
    b._timer = setTimeout(() => {
        b.style.display = 'none';
    }, 4200);
}

export function closeAllModals() {
    ['modalPool', 'modalAltar', 'modalOracle', 'modalTree', 'modalFireDomain', 'modalWaterDomain', 'modalWindDomain'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('oracle-reveal-anim');
        }
    });
}

export const FIRE_ORACLE_QUOTES = [
    '🔥 <b>【赤焰聖諭・燎原破局】</b><br>「莫畏前途霜雪寒，胸中聖火自燎原；一朝踏碎躊躇影，萬里晴空任騰驤！」<br><span style="font-size:13px; color:#ffd4b3;">👉 赤焰獨角獸賜予您果斷行動的勇氣：現在正是打破僵局、主動出擊的最佳時機！</span>',
    '🔥 <b>【赤焰聖諭・浴火新生】</b><br>「舊繭焚盡見真金，烈焰淬鍊志更堅；莫嘆昨日風波惡，今朝破浪啟新篇！」<br><span style="font-size:13px; color:#ffd4b3;">👉 過去的阻礙與消耗都已化為滋養您的養分，請大膽放下包袱，迎接全新的突破！</span>',
    '🔥 <b>【赤焰聖諭・曜日領航】</b><br>「金角燃光破夜長，赤心所向即康莊；無須借問風雲路，你自生來有鋒芒！」<br><span style="font-size:13px; color:#ffd4b3;">👉 請相信自己的實力與熱情，展現您的主導力，周遭的人事物將因您的光芒而匯聚！</span>'
];

export const WATER_ORACLE_QUOTES = [
    '💧 <b>【滄溟聖諭・琉璃澄心】</b><br>「萬頃星瀾映碧霄，潮平風定自逍遙；洗盡心頭千般慮，一輪明月照歸潮。」<br><span style="font-size:13px; color:#b3f0ff;">👉 水元素獨角獸為您撫平近日的疲憊與思慮：當內心如鏡湖般澄澈，最佳解答將自然浮現！</span>',
    '💧 <b>【滄溟聖諭・上善若水】</b><br>「柔水穿石不爭先，隨方就圓自通玄；莫與逆流強相抗，順勢輕舟過萬山！」<br><span style="font-size:13px; color:#b3f0ff;">👉 面對當前的變化，以柔克剛、順勢而為是最好的智慧，轉個彎將看見更寬廣的星海！</span>',
    '💧 <b>【滄溟聖諭・甘露靈泉】</b><br>「瑤池甘露落星津，潤物無聲萬象新；靜聽深海潮音起，靈犀一點破迷津。」<br><span style="font-size:13px; color:#b3f0ff;">👉 您的直覺與靈感正在大幅覺醒，請留意近期浮現的靈光一閃與溫柔貴人！</span>'
];

export const WIND_ORACLE_QUOTES = [
    '🍃 <b>【靈風聖諭・隨風化境】</b><br>「不滯於物不困情，清風拂野過千林；一朝抖擻雙翎翼，天闊雲舒任遠行！」<br><span style="font-size:13px; color:#b9f6ca;">👉 蒼穹風元素獨角獸賜予您放下執念的輕盈能量：不拘泥於過去形式，轉念之間海闊天空！</span>',
    '🍃 <b>【靈風聖諭・心若明鏡】</b><br>「長風浩蕩掃殘陰，碧落無塵照客心；萬籟俱寂靈犀動，清音一曲勝萬金！」<br><span style="font-size:13px; color:#b9f6ca;">👉 當思維不再被繁雜雜音干擾，您的判斷力將變得無比清晰敏銳，順心而行必得自在！</span>',
    '🍃 <b>【靈風聖諭・御風扶搖】</b><br>「蓄力清幽碧玉間，乘時一躍上青天；莫憂前路風勢定，展翼長空傲九淵！」<br><span style="font-size:13px; color:#b9f6ca;">👉 您所累積的才智與靈氣正在迎來起飛之風，把握靈動先機，展翅乘風扶搖直上！</span>'
];

export class OracleSystem {
    constructor({
        scene,
        camera,
        hero,
        unicorn,
        treeOrbsGroup,
        floatingCards,
        cardRingGroup,
        defaultCardTex,
        awakenedCardTex,
        ascensionFX,
        wishTreeFX,
        fireDomainFX,
        waterDomainFX,
        windDomainFX,
        setCameraTarget
    }) {
        this.scene = scene;
        this.camera = camera;
        this.hero = hero;
        this.unicorn = unicorn;
        this.treeOrbsGroup = treeOrbsGroup;
        this.floatingCards = floatingCards || [];
        this.cardRingGroup = cardRingGroup;
        this.defaultCardTex = defaultCardTex;
        this.awakenedCardTex = awakenedCardTex;
        this.ascensionFX = ascensionFX;
        this.wishTreeFX = wishTreeFX;
        this.fireDomainFX = fireDomainFX;
        this.waterDomainFX = waterDomainFX;
        this.windDomainFX = windDomainFX;
        this.setCameraTarget = setCameraTarget;

        this.currentCategory = '心靈療癒與陪伴';
        this.currentWishContent = '';
        this.currentOraclePick = ORACLE_DATABASE[0];
        this.lastOracleTitle = '';
        this.flyingOrbs = [];

        // 抽牌變色飛升動畫狀態
        this.cardDrawAnim = null;
        // 祈願靈樹掛願覺醒動畫狀態
        this.treeBlessingAnim = null;
        this.newHangNode = null;

        this.savedWishes = JSON.parse(localStorage.getItem('sanctuary_wishes_v1') || '[]');
        if (this.savedWishes.length === 0) {
            this.savedWishes.push({
                cat: '平安順遂祈福',
                text: '願家人與自己身心安康，在忙碌中常保平靜與勇氣。',
                time: '星光留存'
            });
        }

        for (let i = 0; i < 6; i++) {
            this.addStaticOrbToTree(false);
        }

        this._bindGlobalCallbacks();
    }

    addStaticOrbToTree(isNew = false) {
        if (!this.treeOrbsGroup) return null;

        const wishNode = new THREE.Group();
        const ang = Math.random() * Math.PI * 2;
        const r = 0.72 + Math.random() * 0.75;
        const baseY = 2.05 + Math.random() * 1.15;
        wishNode.position.set(Math.cos(ang) * r, baseY, Math.sin(ang) * r);
        wishNode.userData = {
            baseY,
            phase: Math.random() * Math.PI * 2,
            isNew,
            bornTimer: 0
        };

        // 1. 璀璨祈願星果光球
        const orbColor = isNew ? 0xffd700 : Math.random() > 0.4 ? 0xffe680 : 0xff99dd;
        const orb = new THREE.Mesh(
            new THREE.SphereGeometry(isNew ? 0.12 : 0.09, 14, 14),
            new THREE.MeshBasicMaterial({ color: orbColor })
        );
        wishNode.add(orb);

        // 2. 外層柔光星暈
        const halo = new THREE.Mesh(
            new THREE.SphereGeometry(isNew ? 0.20 : 0.14, 12, 12),
            new THREE.MeshBasicMaterial({
                color: isNew ? 0xffea80 : 0xffb8f0,
                transparent: true,
                opacity: isNew ? 0.55 : 0.32,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        wishNode.add(halo);

        // 3. 垂掛東方祈願靈箋（繪馬流蘇木牌）
        if (this.wishTreeFX && this.wishTreeFX.wishPlaqueTex) {
            const plaque = new THREE.Mesh(
                new THREE.PlaneGeometry(0.20, 0.40),
                new THREE.MeshBasicMaterial({
                    map: this.wishTreeFX.wishPlaqueTex,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthWrite: false
                })
            );
            plaque.position.y = -0.22;
            wishNode.add(plaque);
            wishNode.userData.plaque = plaque;
        }

        if (isNew) {
            wishNode.scale.setScalar(0.05);
            this.newHangNode = wishNode;
        }

        this.treeOrbsGroup.add(wishNode);
        return wishNode;
    }

    spawnFlyingWishOrb(startVec, endVec, onArrive, isTreeCeremony = false) {
        const carrier = new THREE.Group();
        carrier.position.copy(startVec);

        const coreOrb = new THREE.Mesh(
            new THREE.SphereGeometry(isTreeCeremony ? 0.16 : 0.13, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffea80 })
        );
        carrier.add(coreOrb);

        const outerGlow = new THREE.Mesh(
            new THREE.SphereGeometry(isTreeCeremony ? 0.28 : 0.20, 14, 14),
            new THREE.MeshBasicMaterial({
                color: isTreeCeremony ? 0xff80df : 0x00f2fe,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        carrier.add(outerGlow);

        // 若為掛上祈願靈樹儀式，飛行光球下方帶著發光祈願靈箋與動態點光源
        let trailPoints = null;
        const trailPositions = [];
        if (isTreeCeremony && this.wishTreeFX) {
            const flyPlaque = new THREE.Mesh(
                new THREE.PlaneGeometry(0.26, 0.52),
                new THREE.MeshBasicMaterial({
                    map: this.wishTreeFX.wishPlaqueTex,
                    transparent: true,
                    side: THREE.DoubleSide
                })
            );
            flyPlaque.position.y = -0.26;
            carrier.add(flyPlaque);

            const flyLight = new THREE.PointLight(0xffd700, 2.2, 5.5);
            carrier.add(flyLight);

            // 建立飛行星軌拖尾粒子（24 顆尾跡星塵）
            const trailCount = 24;
            const trailGeo = new THREE.BufferGeometry();
            const posArr = new Float32Array(trailCount * 3);
            const colArr = new Float32Array(trailCount * 3);
            for (let i = 0; i < trailCount; i++) {
                posArr[i * 3] = startVec.x;
                posArr[i * 3 + 1] = startVec.y;
                posArr[i * 3 + 2] = startVec.z;
                trailPositions.push(startVec.clone());
                const ratio = 1 - i / trailCount;
                colArr[i * 3] = 1.0 * ratio;
                colArr[i * 3 + 1] = (0.75 + 0.25 * (i % 2)) * ratio;
                colArr[i * 3 + 2] = (0.85 + 0.15 * ((i + 1) % 2)) * ratio;
            }
            trailGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
            trailGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
            trailPoints = new THREE.Points(
                trailGeo,
                new THREE.PointsMaterial({
                    size: 0.22,
                    map: this.wishTreeFX.glowDotTex,
                    vertexColors: true,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                })
            );
            this.scene.add(trailPoints);
        }

        this.scene.add(carrier);
        this.flyingOrbs.push({
            mesh: carrier,
            trailPoints,
            trailPositions,
            isTreeCeremony,
            start: startVec.clone(),
            end: endVec.clone(),
            progress: 0,
            onArrive
        });
    }

    // 觸發「祈願靈樹掛願覺醒・漫天櫻花星雨」專屬儀式動畫
    _triggerTreeBlessingCeremony() {
        this.addStaticOrbToTree(true);
        this.unicorn.triggerBlessingPulse();

        if (this.wishTreeFX) {
            this.wishTreeFX.fxGroup.visible = true;
            this.wishTreeFX.light.intensity = 3.2;
            this.wishTreeFX.ring1.scale.setScalar(0.3);
            this.wishTreeFX.ring2.scale.setScalar(0.2);
            this.wishTreeFX.ring1.material.opacity = 0.95;
            this.wishTreeFX.ring2.material.opacity = 0.85;
        }

        // 鏡頭特寫千年祈願靈樹，欣賞樹冠變色綻放與漫天櫻花星雨
        this.setCameraTarget(new THREE.Vector3(-7.2, 2.85, 6.4), new THREE.Vector3(-7.2, 2.35, 1.8));
        showToast('🌸 心願靈箋已掛上樹梢！千年祈願靈樹正綻放極光金櫻與漫天星雨...');

        this.treeBlessingAnim = {
            timer: 0,
            duration: 2.8,
            modalShown: false
        };
    }

    // 觸發「靈籤變色飛升＆星光綻放」抽牌儀式動畫
    drawOracleCard(selectedCard = null) {
        if (this.cardDrawAnim && !this.cardDrawAnim.revealed) return;
        closeAllModals();

        // 若未指定卡牌，挑選一張浮空神諭卡
        const targetCard =
            selectedCard ||
            this.floatingCards[Math.floor(Math.random() * this.floatingCards.length)];
        if (!targetCard) {
            this._revealOracleModal();
            return;
        }

        // 重設所有卡牌至初始狀態
        this._resetAllCards();

        // 切換被選中卡牌為「極光金彩覺醒卡面」
        if (this.awakenedCardTex) {
            targetCard.material.map = this.awakenedCardTex;
            targetCard.material.needsUpdate = true;
        }

        // 啟動飛升特效群組
        if (this.ascensionFX) {
            this.ascensionFX.group.visible = true;
            this.ascensionFX.light.intensity = 0.5;
            this.ascensionFX.ring1.scale.setScalar(0.2);
            this.ascensionFX.ring2.scale.setScalar(0.2);
            this.ascensionFX.ring1.material.opacity = 0.9;
            this.ascensionFX.ring2.material.opacity = 0.75;
        }

        // 運鏡聚焦至神諭陣上方，觀賞卡牌變色飛升
        this.setCameraTarget(new THREE.Vector3(6.8, 2.65, 5.8), new THREE.Vector3(6.8, 2.1, 2.2));
        showToast('✨ 靈籤共鳴覺醒！神諭卡正化為極光金彩螺旋飛升...');

        this.cardDrawAnim = {
            card: targetCard,
            timer: 0,
            ascendDuration: 1.35,
            totalDuration: 1.85,
            revealed: false
        };
    }

    _resetAllCards() {
        this.floatingCards.forEach((c) => {
            c.position.set(c.userData.baseX, 0, c.userData.baseZ);
            c.rotation.set(0, c.userData.baseRotY, 0);
            c.scale.set(1, 1, 1);
            if (this.defaultCardTex && c.material.map !== this.defaultCardTex) {
                c.material.map = this.defaultCardTex;
                c.material.needsUpdate = true;
            }
            c.material.color.setHex(0xffffff);
            c.material.emissive.setHex(0x331a66);
            c.material.emissiveIntensity = 0.45;
        });
        if (this.ascensionFX) {
            this.ascensionFX.group.visible = false;
            this.ascensionFX.light.intensity = 0;
        }
    }

    _revealOracleModal() {
        this.unicorn.triggerBlessingPulse();

        // 依玩家於許願星泉選擇的祈願類別精準匹配專屬籤詩池（並避免連續抽中同一支籤）
        let pool = ORACLE_DATABASE.filter((item) => item.category === this.currentCategory);
        if (pool.length === 0) pool = ORACLE_DATABASE;
        if (pool.length > 1 && this.lastOracleTitle) {
            const nonRepeat = pool.filter((item) => item.title !== this.lastOracleTitle);
            if (nonRepeat.length > 0) pool = nonRepeat;
        }

        const pick = pool[Math.floor(Math.random() * pool.length)];
        this.currentOraclePick = pick;
        this.lastOracleTitle = pick.title;

        document.getElementById('oracleTag').innerText = '祈願類別：' + this.currentCategory;
        document.getElementById('oracleTitle').innerText = pick.title;
        document.getElementById('oraclePoem').innerText = pick.poem;
        document.getElementById('oracleAdvice').innerHTML = pick.advice;

        const luckyEl = document.getElementById('oracleLuckyBox');
        if (luckyEl) {
            luckyEl.innerText = pick.luckyItem || '✨ 開運星語：月光銀白・正北方・保持平靜微笑';
            luckyEl.style.display = 'block';
        }

        const modalEl = document.getElementById('modalOracle');
        if (modalEl) {
            modalEl.style.display = 'block';
            modalEl.classList.remove('oracle-reveal-anim');
            void modalEl.offsetWidth; // 觸發動畫重播
            modalEl.classList.add('oracle-reveal-anim');
        }
        showToast('🌟 神諭靈籤已降臨！可細讀指引或一鍵下載「專屬神諭守護卡 PNG」珍藏');
    }

    // -------------------------------------------------------------------------
    // 動態繪製 720x1200 高解析度「專屬神諭守護卡」並下載為 PNG
    // -------------------------------------------------------------------------
    downloadOracleGuardianCard() {
        try {
            const pick = this.currentOraclePick || ORACLE_DATABASE[0];
            const category = this.currentCategory || pick.category || '心靈療癒與陪伴';
            const wishText = (this.currentWishContent || '願星光庇佑，在迷惘中尋得平靜、勇氣與順遂方向。').trim();

            const W = 720;
            const H = 1200;
            const cvs = document.createElement('canvas');
            cvs.width = W;
            cvs.height = H;
            const ctx = cvs.getContext('2d');

            // 1. 深邃月光極光背景漸層
            const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
            bgGrad.addColorStop(0, '#070e22');
            bgGrad.addColorStop(0.38, '#101f42');
            bgGrad.addColorStop(0.72, '#16173a');
            bgGrad.addColorStop(1, '#060c1a');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            // 極光柔光暈染
            const aurora1 = ctx.createRadialGradient(W * 0.5, 290, 20, W * 0.5, 290, 320);
            aurora1.addColorStop(0, 'rgba(110, 230, 255, 0.25)');
            aurora1.addColorStop(0.55, 'rgba(155, 100, 255, 0.12)');
            aurora1.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = aurora1;
            ctx.fillRect(0, 0, W, H);

            // 璀璨星塵背景點綴
            for (let i = 0; i < 85; i++) {
                const sx = (Math.sin(i * 127.1 + 19.7) * 0.5 + 0.5) * (W - 60) + 30;
                const sy = (Math.cos(i * 269.5 + 41.3) * 0.5 + 0.5) * (H - 60) + 30;
                const sr = (i % 3 === 0) ? 1.9 : 1.1;
                ctx.fillStyle = i % 4 === 0 ? 'rgba(255, 225, 130, 0.78)' : 'rgba(180, 235, 255, 0.62)';
                ctx.beginPath();
                ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. 雙層燙金神聖雕花邊框
            ctx.save();
            const borderGrad = ctx.createLinearGradient(0, 0, W, H);
            borderGrad.addColorStop(0, '#ffd700');
            borderGrad.addColorStop(0.5, '#88eeff');
            borderGrad.addColorStop(1, '#ffae00');
            ctx.strokeStyle = borderGrad;
            ctx.lineWidth = 3.5;
            ctx.strokeRect(24, 24, W - 48, H - 48);

            ctx.strokeStyle = 'rgba(255, 215, 0, 0.42)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(34, 34, W - 68, H - 68);

            // 四角星芒裝飾
            const corners = [
                [34, 34],
                [W - 34, 34],
                [34, H - 34],
                [W - 34, H - 34]
            ];
            corners.forEach(([cx, cy]) => {
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();

            // 3. 頂部聖域徽章與標題
            ctx.textAlign = 'center';
            ctx.fillStyle = '#88eeff';
            ctx.font = 'bold 17px "Microsoft JhengHei", "PingFang TC", sans-serif';
            ctx.fillText('🌙 月 光 森 林 ・ 獨 角 獸 心 安 聖 域', W / 2, 74);

            // 祈願類別膠囊標籤
            const pillText = `✦ 祈願類別：${category} ✦`;
            ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif';
            const pillW = Math.max(240, ctx.measureText(pillText).width + 44);
            const pillX = (W - pillW) / 2;
            const pillY = 92;
            ctx.fillStyle = 'rgba(123, 63, 228, 0.38)';
            ctx.strokeStyle = 'rgba(136, 238, 255, 0.65)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, pillW, 32, 16);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#eaf8ff';
            ctx.fillText(pillText, W / 2, pillY + 21);

            // 4. 守護獨角獸聖光法陣與即時去背立繪
            const centerX = W / 2;
            const centerY = 270;
            const portraitRadius = 112;

            // 背光神聖月輪與星芒陣
            const haloGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, portraitRadius + 28);
            haloGrad.addColorStop(0, 'rgba(255, 245, 200, 0.45)');
            haloGrad.addColorStop(0.65, 'rgba(100, 220, 255, 0.22)');
            haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, portraitRadius + 28, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 215, 0, 0.68)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, portraitRadius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(136, 238, 255, 0.42)';
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.arc(centerX, centerY, portraitRadius + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 繪製目前的去背獨角獸立繪 Canvas
            const unicornCvs = this.unicorn?.cardMat?.map?.image;
            if (unicornCvs && unicornCvs.width > 0 && unicornCvs.height > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, portraitRadius - 2, 0, Math.PI * 2);
                ctx.clip();

                const aspect = unicornCvs.width / unicornCvs.height;
                const drawH = portraitRadius * 1.92;
                const drawW = drawH * aspect;
                ctx.drawImage(unicornCvs, centerX - drawW / 2, centerY - drawH / 2 + 6, drawW, drawH);
                ctx.restore();
            }

            // 5. 靈籤吉凶與籤名
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = 'rgba(255, 215, 0, 0.55)';
            ctx.shadowBlur = 12;
            ctx.font = 'bold 28px "Microsoft JhengHei", serif';
            ctx.fillText(pick.title, W / 2, 428);
            ctx.shadowBlur = 0;

            // 6. 籤詩卷軸框
            const poemBoxX = 64;
            const poemBoxY = 452;
            const poemBoxW = W - 128;
            const poemBoxH = 120;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.roundRect(poemBoxX, poemBoxY, poemBoxW, poemBoxH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffe999';
            ctx.font = 'bold 21px "Kaiti TC", "STKaiti", "DFKai-SB", "Microsoft JhengHei", serif';
            const poemLines = pick.poem.split('\n').map((l) => l.trim());
            poemLines.forEach((line, idx) => {
                ctx.fillText(line, W / 2, poemBoxY + 48 + idx * 38);
            });

            // 7. 獨角獸療癒指引（自動斷行排版）
            const adviceBoxX = 64;
            const adviceBoxY = 594;
            const adviceBoxW = W - 128;
            const adviceBoxH = 228;
            ctx.fillStyle = 'rgba(10, 26, 48, 0.68)';
            ctx.strokeStyle = 'rgba(136, 238, 255, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(adviceBoxX, adviceBoxY, adviceBoxW, adviceBoxH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = '#88eeff';
            ctx.font = 'bold 18px "Microsoft JhengHei", sans-serif';
            ctx.fillText('🦄 獨角獸療癒指引：', adviceBoxX + 24, adviceBoxY + 36);

            ctx.fillStyle = '#e4f3ff';
            ctx.font = '17px "Microsoft JhengHei", sans-serif';
            const cleanAdvice =
                pick.plainAdvice ||
                pick.advice.replace(/<[^>]+>/g, '').replace('🦄 獨角獸療癒指引：', '').trim();
            this._drawWrappedText(ctx, cleanAdvice, adviceBoxX + 24, adviceBoxY + 72, adviceBoxW - 48, 30, 5);

            // 8. 開運星語欄
            const luckyY = 842;
            ctx.fillStyle = 'rgba(123, 63, 228, 0.28)';
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(64, luckyY, W - 128, 48, 10);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif';
            ctx.fillText(
                pick.luckyItem || '✨ 開運星語：月光銀白・正北方・睡前深呼吸三次',
                W / 2,
                luckyY + 30
            );

            // 9. 祈願者心願銘刻區塊
            const wishBoxY = 910;
            const wishBoxH = 160;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(64, wishBoxY, W - 128, wishBoxH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif';
            ctx.fillText('💧 許願星泉・心願銘刻：', 88, wishBoxY + 34);

            ctx.fillStyle = '#cde6ff';
            ctx.font = '16px "Microsoft JhengHei", sans-serif';
            const clippedWish = wishText.length > 90 ? wishText.slice(0, 90) + '...' : wishText;
            this._drawWrappedText(ctx, `「${clippedWish}」`, 88, wishBoxY + 68, W - 176, 28, 3);

            // 10. 底部聖域落款與日期印記
            const todayStr = new Date().toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(170, 215, 255, 0.78)';
            ctx.font = '14px "Microsoft JhengHei", sans-serif';
            ctx.fillText(`✦ 賜福印記：${todayStr} ｜ 月光森林・獨角獸心安聖域 永久守護 ✦`, W / 2, 1126);

            // 觸發 PNG 檔案下載
            const dataUrl = cvs.toDataURL('image/png');
            const a = document.createElement('a');
            const safeTitle = pick.title.replace(/[【】・\s]/g, '_').replace(/^_+|_+$/g, '');
            a.href = dataUrl;
            a.download = `獨角獸神諭守護卡_${safeTitle}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showToast('📸 已為您繪製並下載「專屬神諭守護卡 PNG」！可隨時珍藏或分享祝福');
        } catch (err) {
            console.error('守護卡生成失敗:', err);
            showToast('⚠️ 守護卡生成時發生小狀況，請稍後再試');
        }
    }

    _drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 5) {
        const chars = Array.from(text);
        let line = '';
        let lineCount = 0;
        for (let i = 0; i < chars.length; i++) {
            const testLine = line + chars[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line.length > 0) {
                lineCount++;
                if (lineCount >= maxLines) {
                    ctx.fillText(line.slice(0, -1) + '…', x, y);
                    return;
                }
                ctx.fillText(line, x, y);
                line = chars[i];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        if (line) {
            ctx.fillText(line, x, y);
        }
    }

    update(delta, elapsed = 0) {
        // 1. 更新飛行中的祈願星果光球（含掛上祈願靈樹的螺旋星軌拖尾特效）
        for (let i = this.flyingOrbs.length - 1; i >= 0; i--) {
            const item = this.flyingOrbs[i];
            const speed = item.isTreeCeremony ? 0.68 : 0.85;
            item.progress += delta * speed;
            if (item.progress >= 1.0) {
                this.scene.remove(item.mesh);
                if (item.trailPoints) {
                    this.scene.remove(item.trailPoints);
                }
                if (item.onArrive) item.onArrive();
                this.flyingOrbs.splice(i, 1);
            } else {
                const t = item.progress;
                // Smoothstep 曲線讓飛行更具儀式感
                const ease = t * t * (3 - 2 * t);
                item.mesh.position.lerpVectors(item.start, item.end, ease);
                // 高拋弧線 + 環繞靈樹螺旋偏擺
                const arcHeight = item.isTreeCeremony ? 1.95 : 1.4;
                item.mesh.position.y += Math.sin(t * Math.PI) * arcHeight;
                if (item.isTreeCeremony) {
                    const swirl = Math.sin(t * Math.PI * 3) * (1 - t) * 0.55;
                    item.mesh.position.x += swirl;
                    item.mesh.position.z += Math.cos(t * Math.PI * 3) * (1 - t) * 0.55;
                    item.mesh.rotation.y = elapsed * 5.0;
                    const s = 1.0 + Math.sin(t * Math.PI) * 0.45;
                    item.mesh.scale.setScalar(s);
                }

                // 更新星軌尾跡粒子位置
                if (item.trailPoints && item.trailPositions) {
                    item.trailPositions.pop();
                    item.trailPositions.unshift(item.mesh.position.clone());
                    const posAttr = item.trailPoints.geometry.attributes.position;
                    for (let k = 0; k < item.trailPositions.length; k++) {
                        const tp = item.trailPositions[k];
                        posAttr.setXYZ(
                            k,
                            tp.x + Math.sin(elapsed * 8 + k) * 0.04,
                            tp.y + Math.cos(elapsed * 7 + k) * 0.04,
                            tp.z
                        );
                    }
                    posAttr.needsUpdate = true;
                }
            }
        }

        // 2. 更新祈願靈樹上的所有星果與靈箋隨風輕擺 + 掛願覺醒綻放動畫
        this._updateTreeBlessingAnim(delta, elapsed);

        // 3. 更新神諭靈籤浮空陣與「抽牌變色飛升」動畫
        if (!this.cardDrawAnim) {
            if (this.cardRingGroup) {
                this.cardRingGroup.rotation.y += delta * 0.45;
            }
            this.floatingCards.forEach((c, idx) => {
                c.position.y = Math.sin(elapsed * 2.2 + idx) * 0.06;
            });
            return;
        }

        const anim = this.cardDrawAnim;
        anim.timer += delta;
        const card = anim.card;
        const t = anim.timer;

        if (t <= anim.ascendDuration) {
            // 【階段 A：變色覺醒 + 螺旋飛升 + 星光環爆發 (0 ~ 1.35s)】
            const p = Math.min(1, t / anim.ascendDuration);
            // Smoothstep 緩動曲線
            const ease = p * p * (3 - 2 * p);

            // 整圈卡牌加速旋轉，其餘 6 張微向外退讓並泛起青藍微光
            if (this.cardRingGroup) {
                this.cardRingGroup.rotation.y += delta * (0.6 + (1 - p) * 2.4);
            }
            this.floatingCards.forEach((c, idx) => {
                if (c === card) return;
                const expand = 1.0 + Math.sin(p * Math.PI) * 0.22;
                c.position.set(
                    c.userData.baseX * expand,
                    Math.sin(elapsed * 3.0 + idx) * 0.05 - ease * 0.12,
                    c.userData.baseZ * expand
                );
                c.material.emissive.setHex(0x164e78);
                c.material.emissiveIntensity = 0.35 + Math.sin(p * Math.PI) * 0.35;
            });

            // 選中卡牌由外圈聚攏至陣心正上方，並螺旋飛升至 +1.28m 高處
            const curX = card.userData.baseX * (1 - ease);
            const curZ = card.userData.baseZ * (1 - ease);
            const curY = ease * 1.28;
            card.position.set(curX, curY, curZ);

            // 卡牌放大至 2.15 倍，高速翻轉後於頂點面向鏡頭定格
            const scaleVal = 1.0 + ease * 1.15;
            card.scale.set(scaleVal, scaleVal, 1);

            if (p < 0.78) {
                card.rotation.y += delta * 18.0;
                card.rotation.z = Math.sin(p * Math.PI * 3) * 0.15;
            } else {
                // 轉向面對相機（扣除父節點 cardRingGroup 的旋轉角）
                const worldCardPos = new THREE.Vector3(6.8, 1.45 + curY, 2.2);
                const targetWorldYaw = Math.atan2(
                    this.camera.position.x - worldCardPos.x,
                    this.camera.position.z - worldCardPos.z
                );
                const parentYaw = this.cardRingGroup ? this.cardRingGroup.rotation.y : 0;
                const desiredLocalYaw = targetWorldYaw - parentYaw;
                card.rotation.y += (desiredLocalYaw - card.rotation.y) * Math.min(1, delta * 14);
                card.rotation.z *= 0.8;
            }

            // 卡牌動態變色：紫羅蘭 -> 霓虹青 -> 櫻粉極光 -> 璀璨聖光金
            if (p < 0.3) {
                card.material.emissive.setHex(0x00f2fe); // 極光青藍
            } else if (p < 0.6) {
                card.material.emissive.setHex(0xff55cc); // 仙氣櫻粉紫
            } else {
                card.material.emissive.setHex(0xffd700); // 璀璨聖光金
            }
            card.material.emissiveIntensity = 0.8 + ease * 1.8 + Math.sin(t * 24) * 0.25;

            // 更新飛升星塵光環與螺旋粒子特效
            if (this.ascensionFX) {
                const fx = this.ascensionFX;
                fx.light.position.set(curX, curY, curZ);
                fx.light.intensity = 1.0 + ease * 2.8;
                fx.light.color.setHex(p < 0.5 ? 0x00f2fe : 0xffd700);

                // 雙層神聖光環隨卡牌擴散上升
                fx.ring1.position.y = curY * 0.65;
                fx.ring1.scale.setScalar(0.35 + ease * 1.85);
                fx.ring1.rotation.z += delta * 4.5;
                fx.ring1.material.opacity = (1 - p * 0.65) * 0.85;

                fx.ring2.position.y = curY;
                fx.ring2.scale.setScalar(0.25 + ease * 1.35);
                fx.ring2.rotation.z -= delta * 6.0;
                fx.ring2.material.opacity = Math.sin(p * Math.PI) * 0.9;

                // 螺旋星塵粒子向上噴湧環繞
                const posAttr = fx.pGeo.attributes.position;
                for (let i = 0; i < fx.count; i++) {
                    const ph = fx.phases[i];
                    const ang = ph.angle + t * ph.spinSpeed;
                    const r = ph.radius * (1.1 - ease * 0.45);
                    const py = ((ph.baseY + t * ph.ySpeed) % 1.65);
                    posAttr.setXYZ(i, Math.cos(ang) * r, py, Math.sin(ang) * r);
                }
                posAttr.needsUpdate = true;
            }
        } else {
            // 【階段 B：飛升頂點聖光綻放 -> 彈出神諭籤詩彈窗 -> 卡牌優雅歸位】
            if (!anim.revealed) {
                anim.revealed = true;
                this._revealOracleModal();
            }

            const returnP = Math.min(1, (t - anim.ascendDuration) / (anim.totalDuration - anim.ascendDuration));
            const inv = 1 - returnP;

            card.position.set(
                card.userData.baseX * returnP,
                1.28 * inv,
                card.userData.baseZ * returnP
            );
            const s = 1.0 + inv * 1.15;
            card.scale.set(s, s, 1);
            card.material.emissiveIntensity = 0.45 + inv * 1.8;

            if (this.ascensionFX) {
                this.ascensionFX.light.intensity = inv * 2.5;
                this.ascensionFX.ring1.material.opacity = inv * 0.4;
                this.ascensionFX.ring2.material.opacity = inv * 0.5;
            }

            if (t >= anim.totalDuration) {
                this._resetAllCards();
                this.cardDrawAnim = null;
            }
        }
    }

    // 祈願靈樹日常隨風搖曳 ＆ 掛上心願時的「靈樹變色覺醒・雙環升空・櫻花星雨」動畫
    _updateTreeBlessingAnim(delta, elapsed) {
        // 讓樹上所有祈願星果與靈箋隨風輕柔擺動
        if (this.treeOrbsGroup) {
            const boost = this.treeBlessingAnim ? 2.6 : 1.0;
            this.treeOrbsGroup.children.forEach((node, idx) => {
                const ph = node.userData.phase || idx;
                node.position.y = (node.userData.baseY || 2.4) + Math.sin(elapsed * 2.2 * boost + ph) * 0.045;
                if (node.userData.plaque) {
                    node.userData.plaque.rotation.z = Math.sin(elapsed * 2.8 * boost + ph) * (0.12 * boost);
                    node.userData.plaque.rotation.y = elapsed * 0.9 + ph;
                }
                // 新掛上的祈願星果彈性放大綻放動畫
                if (node.userData.isNew && node.userData.bornTimer < 1.2) {
                    node.userData.bornTimer += delta;
                    const bp = Math.min(1, node.userData.bornTimer / 1.0);
                    // 彈性超越曲線 (Overshoot bounce)
                    const elastic =
                        bp < 0.6
                            ? (bp / 0.6) * 1.65
                            : 1.65 - ((bp - 0.6) / 0.4) * 0.45;
                    node.scale.setScalar(elastic);
                }
            });
        }

        if (!this.treeBlessingAnim || !this.wishTreeFX) return;

        const anim = this.treeBlessingAnim;
        anim.timer += delta;
        const t = anim.timer;
        const p = Math.min(1, t / anim.duration);
        const fx = this.wishTreeFX;
        const pulse = Math.sin(p * Math.PI);

        // 1. 千年祈願靈樹樹冠變色覺醒（柔粉 -> 璀璨聖光金 -> 仙氣極光櫻 -> 柔和粉櫻）與呼吸縮放
        if (fx.canopyMat) {
            if (p < 0.35) {
                fx.canopyMat.emissive.setHex(0xffb700); // 黃金聖光覺醒
            } else if (p < 0.7) {
                fx.canopyMat.emissive.setHex(0xff55cc); // 極光櫻粉盛開
            } else {
                fx.canopyMat.emissive.setHex(0x661a55);
            }
            fx.canopyMat.emissiveIntensity = 0.4 + pulse * 1.85;
        }
        if (fx.treeGroup) {
            const treeScale = 1.0 + Math.sin(p * Math.PI * 2) * (1 - p) * 0.065;
            fx.treeGroup.scale.set(treeScale, 1.0 + pulse * 0.05, treeScale);
        }

        // 2. 樹冠中心聖光點光源閃耀
        fx.light.intensity = pulse * 3.8;
        fx.light.color.setHex(p < 0.45 ? 0xffd700 : 0xff80df);

        // 3. 雙層祈願光環自樹根向樹冠螺旋升起並向外擴散
        const ringCycle = (p * 1.6) % 1.0;
        fx.ring1.position.y = 0.15 + ringCycle * 3.3;
        fx.ring1.scale.setScalar(0.5 + ringCycle * 2.35);
        fx.ring1.rotation.z += delta * 5.0;
        fx.ring1.material.opacity = (1 - ringCycle) * pulse * 0.95;

        const ringCycle2 = ((p * 1.6) + 0.45) % 1.0;
        fx.ring2.position.y = 0.15 + ringCycle2 * 3.3;
        fx.ring2.scale.setScalar(0.4 + ringCycle2 * 2.05);
        fx.ring2.rotation.z -= delta * 6.5;
        fx.ring2.material.opacity = (1 - ringCycle2) * pulse * 0.9;

        // 4. 漫天櫻花星雨自樹冠旋舞飄落
        const posAttr = fx.petalGeo.attributes.position;
        for (let i = 0; i < fx.petalCount; i++) {
            const ph = fx.petalPhases[i];
            const ang = ph.angle + t * ph.swirlSpeed;
            const r = ph.radius + Math.sin(t * 3 + i) * ph.drift;
            let py = ph.startY - t * ph.fallSpeed;
            if (py < 0.15) py += 3.6;
            posAttr.setXYZ(i, Math.cos(ang) * r, py, Math.sin(ang) * r);
        }
        posAttr.needsUpdate = true;

        // 5. 在靈樹盛開最高潮時（約 1.35 秒），自動彈出祈願靈樹心願紀錄彈窗
        if (!anim.modalShown && t >= 1.35) {
            anim.modalShown = true;
            this.renderTreeWishList(true);
            const modalTree = document.getElementById('modalTree');
            if (modalTree) {
                modalTree.style.display = 'block';
                modalTree.classList.remove('oracle-reveal-anim');
                void modalTree.offsetWidth;
                modalTree.classList.add('oracle-reveal-anim');
            }
            showToast('🌳 心願已化為星光靈箋永駐祈願靈樹！');
        }

        // 6. 動畫結束收尾還原
        if (t >= anim.duration) {
            fx.fxGroup.visible = false;
            fx.light.intensity = 0;
            if (fx.canopyMat) {
                fx.canopyMat.emissive.setHex(0x661a55);
                fx.canopyMat.emissiveIntensity = 0.4;
            }
            if (fx.treeGroup) {
                fx.treeGroup.scale.set(1, 1, 1);
            }
            this.treeBlessingAnim = null;
        }
    }

    commandHeroToStation(stationName) {
        closeAllModals();
        document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
        const btns = document.querySelectorAll('.nav-btn');

        if (stationName === 'sanctuary') {
            if (btns[0]) btns[0].classList.add('active');
            this.setCameraTarget(new THREE.Vector3(0, 5.8, 16.8), new THREE.Vector3(0, 1.5, 1.5));
            showToast('🏛️ 環視聖域全景 — 點擊地面或按 WASD 可控制主角自由漫步');
        } else if (stationName === 'pool') {
            if (btns[1]) btns[1].classList.add('active');
            showToast('🚶 主角正走向「許願星泉」準備稟報心事...');
            this.setCameraTarget(new THREE.Vector3(0, 2.6, 10.6), new THREE.Vector3(0, 0.9, 6.2));
            this.hero.walkTo(
                new THREE.Vector3(0, 0, 7.6),
                () => {
                    document.getElementById('modalPool').style.display = 'block';
                },
                new THREE.Vector3(0, 0, 6.2)
            );
        } else if (stationName === 'altar') {
            if (btns[2]) btns[2].classList.add('active');
            showToast('🚶 主角正走向「獨角獸主祭壇」前請示聖意...');
            this.setCameraTarget(new THREE.Vector3(0, 2.7, 4.6), new THREE.Vector3(0, 1.9, -1.8));
            this.hero.walkTo(
                new THREE.Vector3(0, 0, 1.0),
                () => {
                    document.getElementById('divinationResult').innerHTML = '';
                    document.getElementById('goOracleBtn').style.display = 'none';
                    if (this.currentWishContent) {
                        document.getElementById('currentWishDisplay').innerHTML =
                            `主角稟報的心事：<span style="color:#ffd700;">「${this.currentWishContent}」</span><br>請點擊下方按鈕，祈請獨角獸以星光共鳴回應聖意：`;
                    }
                    document.getElementById('modalAltar').style.display = 'block';
                },
                new THREE.Vector3(0, 0, -1.8)
            );
        } else if (stationName === 'oracle') {
            if (btns[3]) btns[3].classList.add('active');
            showToast('🃏 主角正走向「神諭靈籤陣」— 點擊任一浮空卡牌即可觸發變色飛升抽籤！');
            this.setCameraTarget(new THREE.Vector3(6.8, 2.4, 6.5), new THREE.Vector3(6.8, 1.4, 2.2));
            this.hero.walkTo(new THREE.Vector3(5.3, 0, 3.3), null, new THREE.Vector3(6.8, 0, 2.2));
        } else if (stationName === 'tree') {
            if (btns[4]) btns[4].classList.add('active');
            showToast('🌳 主角正走向「千年祈願靈樹」...');
            this.setCameraTarget(new THREE.Vector3(-7.2, 2.9, 7.0), new THREE.Vector3(-7.2, 2.0, 1.8));
            this.hero.walkTo(
                new THREE.Vector3(-5.4, 0, 3.2),
                () => {
                    this.renderTreeWishList();
                    document.getElementById('modalTree').style.display = 'block';
                },
                new THREE.Vector3(-7.2, 0, 1.8)
            );
        } else if (stationName === 'fire_domain') {
            if (btns[5]) btns[5].classList.add('active');
            showToast('🔥 主角正踏上黑曜熔岩參道，走進「赤焰獨角獸・火元素領域」...');
            this.setCameraTarget(new THREE.Vector3(17.6, 3.9, 0.2), new THREE.Vector3(22.0, 2.1, -7.2));
            this.hero.walkTo(
                new THREE.Vector3(19.4, 0, -5.4),
                () => {
                    const quoteEl = document.getElementById('fireBlessingQuote');
                    if (quoteEl) quoteEl.style.display = 'none';
                    const modalEl = document.getElementById('modalFireDomain');
                    if (modalEl) {
                        modalEl.style.display = 'block';
                        modalEl.classList.remove('oracle-reveal-anim');
                        void modalEl.offsetWidth;
                        modalEl.classList.add('oracle-reveal-anim');
                    }
                    showToast('🌋 已抵達「赤焰獨角獸領域」！感受太陽聖火與破局行動之力');
                },
                new THREE.Vector3(22.0, 0, -7.2)
            );
        } else if (stationName === 'water_domain') {
            if (btns[6]) btns[6].classList.add('active');
            showToast('💧 主角正踏上琉璃水月星橋，走進「滄溟獨角獸・琉璃星海水元素領域」...');
            this.setCameraTarget(new THREE.Vector3(-17.6, 3.9, 0.2), new THREE.Vector3(-22.0, 2.1, -7.2));
            this.hero.walkTo(
                new THREE.Vector3(-19.4, 0, -5.4),
                () => {
                    const quoteEl = document.getElementById('waterBlessingQuote');
                    if (quoteEl) quoteEl.style.display = 'none';
                    const modalEl = document.getElementById('modalWaterDomain');
                    if (modalEl) {
                        modalEl.style.display = 'block';
                        modalEl.classList.remove('oracle-reveal-anim');
                        void modalEl.offsetWidth;
                        modalEl.classList.add('oracle-reveal-anim');
                    }
                    showToast('🌊 已抵達「琉璃星海・水元素領域」！感受深海潮汐的淨化與靈感共鳴');
                },
                new THREE.Vector3(-22.0, 0, -7.2)
            );
        } else if (stationName === 'wind_domain') {
            if (btns[7]) btns[7].classList.add('active');
            showToast('🍃 主角正踏上青雲碧玉階梯，走進「蒼穹獨角獸・靈風元素領域」...');
            this.setCameraTarget(new THREE.Vector3(0, 4.4, -15.8), new THREE.Vector3(0, 2.1, -23.5));
            this.hero.walkTo(
                new THREE.Vector3(0, 0, -21.2),
                () => {
                    const quoteEl = document.getElementById('windBlessingQuote');
                    if (quoteEl) quoteEl.style.display = 'none';
                    const modalEl = document.getElementById('modalWindDomain');
                    if (modalEl) {
                        modalEl.style.display = 'block';
                        modalEl.classList.remove('oracle-reveal-anim');
                        void modalEl.offsetWidth;
                        modalEl.classList.add('oracle-reveal-anim');
                    }
                    showToast('🌀 已抵達「蒼穹靈風・風元素領域」！感受長空息吹的通透與自由共鳴');
                },
                new THREE.Vector3(0, 0, -23.5)
            );
        }
    }

    renderTreeWishList(highlightFirst = false) {
        const box = document.getElementById('treeWishList');
        if (!box) return;
        box.innerHTML = this.savedWishes
            .map((w, idx) => {
                const isJustHung = highlightFirst && idx === 0;
                const rowStyle = isJustHung
                    ? 'border:1px solid rgba(255,215,0,0.65); background:linear-gradient(90deg,rgba(255,215,0,0.18),rgba(255,120,210,0.12)); border-radius:8px; padding:8px 10px; margin-bottom:6px; box-shadow:0 0 14px rgba(255,215,0,0.25);'
                    : 'border-bottom:1px solid rgba(255,255,255,0.12); padding:6px 0;';
                const badge = isJustHung
                    ? '<span style="background:#ffd700; color:#1a0d2a; font-size:10.5px; font-weight:bold; padding:1px 6px; border-radius:10px; margin-right:5px;">✨ 剛掛上樹梢</span>'
                    : '';
                return `<div style="${rowStyle}">
                        ${badge}<span style="color:#ffd700; font-weight:bold;">[${w.cat}]</span> ${w.text}
                        <span style="float:right; color:#88aacc; font-size:11px;">${w.time}</span>
                    </div>`;
            })
            .join('');
    }

    _bindGlobalCallbacks() {
        window.closeAllModals = closeAllModals;
        window.commandHeroToStation = (stationName) => this.commandHeroToStation(stationName);
        window.downloadOracleGuardianCard = () => this.downloadOracleGuardianCard();

        window.selectCategory = (el, cat) => {
            document.querySelectorAll('.cat-pill').forEach((p) => p.classList.remove('selected'));
            el.classList.add('selected');
            this.currentCategory = cat;
        };

        window.submitWishToPool = () => {
            const txt = document.getElementById('wishText')?.value.trim() || '祈求心靈平靜與順遂指引';
            this.currentWishContent = txt;
            closeAllModals();

            showToast('✨ 主角將心事化為星光投入泉中，正飛向獨角獸主祭壇...');
            this.spawnFlyingWishOrb(
                new THREE.Vector3(0, 0.8, 6.2),
                new THREE.Vector3(0, 2.2, -1.8),
                () => {
                    this.unicorn.triggerBlessingPulse();
                    showToast('🦄 獨角獸已收到稟報！主角正前往主祭壇進行「光之共鳴」...');
                    setTimeout(() => this.commandHeroToStation('altar'), 1000);
                }
            );
        };

        window.castLightResonance = () => {
            this.unicorn.triggerBlessingPulse();
            const resEl = document.getElementById('divinationResult');
            resEl.innerHTML = '⏳ 黃金獨角正在凝聚月光共鳴...';

            setTimeout(() => {
                const roll = Math.random();
                if (roll < 0.82) {
                    resEl.innerHTML = '🌟 【聖光共鳴（聖杯）】獨角獸展開溫暖金光，應允賜予主角今日的神諭指引！';
                    document.getElementById('goOracleBtn').style.display = 'inline-block';
                } else {
                    resEl.innerHTML = '🍃 【微風微笑（笑杯）】獨角獸溫柔眨眼，建議深呼吸把問題想得更具體後，再點一次共鳴！';
                }
            }, 900);
        };

        window.hangWishOnTree = () => {
            closeAllModals();
            const recordText = this.currentWishContent || '祈求星光庇佑，身心平安順遂。';
            this.savedWishes.unshift({
                cat: this.currentCategory,
                text: recordText,
                time: new Date().toLocaleDateString()
            });
            try {
                localStorage.setItem('sanctuary_wishes_v1', JSON.stringify(this.savedWishes.slice(0, 30)));
            } catch (e) {}

            // 激活底部導覽列「🌳 祈願靈樹」按鈕狀態
            document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
            const btns = document.querySelectorAll('.nav-btn');
            if (btns[4]) btns[4].classList.add('active');

            this.setCameraTarget(new THREE.Vector3(-4.8, 3.2, 8.2), new THREE.Vector3(-5.8, 2.2, 1.5));
            this.hero.walkTo(new THREE.Vector3(-5.4, 0, 3.2), null, new THREE.Vector3(-7.2, 0, 1.8));
            showToast('🌟 獨角獸賜福完成！心願正化為「祈願流蘇靈箋」拖曳星軌飛往千年祈願靈樹...');

            this.spawnFlyingWishOrb(
                new THREE.Vector3(0, 2.2, -1.8),
                new THREE.Vector3(-7.2, 2.8, 1.8),
                () => {
                    this._triggerTreeBlessingCeremony();
                },
                true
            );
        };

        window.triggerDewOffering = () => {
            closeAllModals();
            this.hero.walkTo(
                new THREE.Vector3(0, 0, 1.0),
                () => {
                    this.unicorn.triggerBlessingPulse();
                    showToast('✨ 主角向獨角獸獻上純淨森林晨露，全森林星塵正為您閃耀賜福！');
                },
                new THREE.Vector3(0, 0, -1.8)
            );
        };

        window.triggerFireUnicornAwakening = () => {
            if (this.fireDomainFX && this.fireDomainFX.triggerAwakening) {
                this.fireDomainFX.triggerAwakening();
            }
            const quoteEl = document.getElementById('fireBlessingQuote');
            if (quoteEl) {
                const pick = FIRE_ORACLE_QUOTES[Math.floor(Math.random() * FIRE_ORACLE_QUOTES.length)];
                quoteEl.innerHTML = pick;
                quoteEl.style.display = 'block';
            }
            this.setCameraTarget(new THREE.Vector3(18.5, 3.3, -1.2), new THREE.Vector3(22.0, 2.3, -7.2));
            showToast('🔥 赤焰獨角獸展開太陽聖火雙翼！熾熱的破局與行動能量正環繞全身！');
        };

        window.triggerWaterUnicornAwakening = () => {
            if (this.waterDomainFX && this.waterDomainFX.triggerAwakening) {
                this.waterDomainFX.triggerAwakening();
            }
            const quoteEl = document.getElementById('waterBlessingQuote');
            if (quoteEl) {
                const pick = WATER_ORACLE_QUOTES[Math.floor(Math.random() * WATER_ORACLE_QUOTES.length)];
                quoteEl.innerHTML = pick;
                quoteEl.style.display = 'block';
            }
            this.setCameraTarget(new THREE.Vector3(-18.5, 3.3, -1.2), new THREE.Vector3(-22.0, 2.3, -7.2));
            showToast('💧 滄溟獨角獸揚起琉璃星海潮汐！溫柔澄澈的淨化與靈感正環繞全身！');
        };

        window.triggerWindUnicornAwakening = () => {
            if (this.windDomainFX && this.windDomainFX.triggerAwakening) {
                this.windDomainFX.triggerAwakening();
            }
            const quoteEl = document.getElementById('windBlessingQuote');
            if (quoteEl) {
                const pick = WIND_ORACLE_QUOTES[Math.floor(Math.random() * WIND_ORACLE_QUOTES.length)];
                quoteEl.innerHTML = pick;
                quoteEl.style.display = 'block';
            }
            this.setCameraTarget(new THREE.Vector3(0, 3.5, -16.2), new THREE.Vector3(0, 2.2, -23.5));
            showToast('🍃 蒼穹靈風獨角獸展翅召喚長空清嵐！思維通透與自由豁達的靈風正環繞全身！');
        };
    }
}
