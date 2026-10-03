<script>
	import { onMount } from 'svelte';
	import './timeline.css';

	onMount(() => {
		const cleanups = [];
		const onWindow = (type, fn, opts) => {
			window.addEventListener(type, fn, opts);
			cleanups.push(() => window.removeEventListener(type, fn, opts));
		};
		const onDocument = (type, fn, opts) => {
			document.addEventListener(type, fn, opts);
			cleanups.push(() => document.removeEventListener(type, fn, opts));
		};


		const CDN = 'https://fpchk.s3.ap-southeast-1.amazonaws.com/';
		const ICONS = {
		  mayfung:   '/fp5icon/teatime-removebg-preview.png',
		  teatime:   '/fp5icon/teatime-removebg-preview.png',
		  cineclub:  '/fp5icon/LaserFrames_series_Hector_1_-removebg-preview.png',
		  halloween1:'/fp5icon/HalloweenApocalypse2026_Hector-removebg-preview.png',
		  halloween2:'/fp5icon/HalloweenApocalypse2026_Hector-removebg-preview.png',
		  halloween3:'/fp5icon/HalloweenApocalypse2026_Hector-removebg-preview.png',
		  crtwall:   '/fp5icon/cine_club-removebg-preview.png',
		  mediaarch: '/fp5icon/media_archeology-removebg-preview.png',
		  mediaarch1a:'/fp5icon/media_archeology-removebg-preview.png',
		  mediaarch1b:'/fp5icon/media_archeology-removebg-preview.png',
		  mediaarch1c:'/fp5icon/media_archeology-removebg-preview.png',
		  mediaarch1d:'/fp5icon/media_archeology-removebg-preview.png',
		  mediaarch2:'/fp5icon/media_archeology-removebg-preview.png',
		  mediaarch3:'/fp5icon/media_archeology-removebg-preview.png',
		  teatime2:  '/fp5icon/teatime-removebg-preview.png',
		  platform:  '/fp5icon/FloatingPlatform-at-FP_zines-books-media-removebg-preview.png',
		  mnemonic:  '/fp5icon/Mnemonic-Catastrophe_Hugo-removebg-preview.png',
		  essaying:  '/fp5icon/OpenCall_Essaying-w-Sight-y-Sound__a_lecture_pe_182491-removebg-preview.png',
		  adminnight:'/fp5icon/admin_night-removebg-preview.png',
		  spatial:   '/fp5icon/spacial_calibration-removebg-preview.png',
		  workshop:  '/fp5icon/workshop-removebg-preview.png',
		  modular:   '/fp5icon/synth_onsite_rental-removebg-preview.png',
		  stc:       '/fp5icon/subject_to_change-removebg-preview.png',
		  ml:        '/fp5icon/ML_serius-removebg-preview.png',
		  vcd:       '/fp5icon/vcd_found_footage-removebg-preview.png',
		  fkinstall: '/fp5icon/motion_tracking_sound_installation-removebg-preview.png',
		  board:     '/fp5icon/chess-removebg-preview.png'
		};
		const SVG_ICON = svgId => '<svg><use href="#'+svgId+'"/></svg>';
		function iconHTML(id, svgId){
		  const img = ICONS[id];
		  if(!img) return SVG_ICON(svgId);
		  // a missing PNG degrades to the line-art symbol instead of a broken-image glyph
		  return '<img src="'+img+'" alt="" data-fallback="'+svgId+'"'
		    + ' onerror="const p=this.parentElement;p.classList.remove(\'img-icon\');'
		    + 'p.innerHTML=\'<svg><use href=&quot;#\'+this.dataset.fallback+\'&quot;/></svg>\';">';
		}
		function setIcon(el, id, svgId){
		  el.classList.toggle('img-icon', !!ICONS[id]);
		  el.innerHTML = iconHTML(id, svgId);
		}
		const PEOPLE = {
		  L:  {name:'Linda Chiu-han Lai 黎肖嫻', init:'L',  photo:CDN+'2015/07/B-W_Linda_London2015_square.jpg'},
		  H:  {name:'Hector Rodriguez', init:'H',        photo:'/fp5icon/hector.jpg'},
		  A:  {name:'LAI Chung-man Andio 黎仲民', init:'A', photo:'/fp5icon/andio.jpg'},
		  FK: {name:'WONG Fuk-kuen 黃福權', init:'FK',      photo:'/fp5icon/fukkuen.jpeg'},
		  W:  {name:'LAI Wai-leung 黎偉亮', init:'W',       photo:CDN+'2015/08/Wai_image02_sq-bw.jpg'},
		  S:  {name:'NG Sing-yiu Stanley 伍昇耀', init:'S', photo:CDN+'Stan_Ng_profile_image_026a672b60.jpg'},
		  HC: {name:'LAU Ho-chi 劉浩知', init:'HC',         photo:CDN+'Lau_Hochi_profile_1_8e5de784b5.jpg'},
		  HG: {name:'Hugo Yeung 楊鳴謙', init:'HG',         photo:CDN+'2015/07/Profile_BW_RGB-300dpi.jpg'},
		  MF: {name:'May Fung 馮美華', init:'馮'},
		  JL: {name:'Jen Lee', init:'JL'},
		  FP: {name:'FP 集體', init:'FP', photo:'https://floatingprojectscollective.net/fp-icon.png'}
		};
		function avHTML(k){
		  const p = PEOPLE[k];
		  if(!p) return '';
		  const img = p.photo ? '<img src="'+p.photo+'" alt="" loading="lazy" onerror="this.remove()">' : '';
		  return '<span class="av" data-person="'+k+'" title="'+p.name+'">'+p.init+img+'</span>';
		}

		const DATA = {
		  mayfung: {icon:'ic-teacup', title:'May Fung amid Meshes of The Afternoon',
		    meta:'<b>2026.10.17</b> · Fountain Teatime 開幕場 · 日期已確定',
		    tags:['社群連結','標誌系列','講座'],
		    desc:'馮美華借 Maya Deren 嘅實驗短片《Meshes of the Afternoon》做參照，回望自己一路行過嚟嘅生活同存在方式 — 有時真實、有時超現實嘅一連串夢，交纏成一個以實驗精神為軸嘅存在。佢會放自己第一條短片《The Sea》（super 8，4 分鐘，數碼檔播放）打開話題。',
		    pics:['MF','L']},
		  halloween1: {icon:'ic-disc', title:'《活死人黎明 Dawn of the Dead》',
		    meta:'<b>2026.10.30（6:30–9:30pm）</b> · Halloween Apocalypse 萬聖末日啟示 · Laser Frames 第一輯 · 日期已確定',
		    tags:['有收入','社群連結','放映','媒體考古'],
		    desc:['George A. Romero 1978 年嘅《活死人黎明 Dawn of the Dead》。Hector 從佢嘅 laserdisc 收藏揀恐怖片，以 private cine club 形式放映，需要預先登記。',
		      '三晚系列嘅第一晚，共同問題：我哋有幾人類？ How human are we? 每場都有導讀、分析同討論。',
		      '技術上跟足 D1 規格 — 用分配放大器推幾部 CRT，唔用被動分線，保住每部電視都收到足電壓嘅訊號。'],
		    pics:['H']},
		  halloween2: {icon:'ic-disc', title:'《變形邪魔 Invasion of the Body Snatchers》兩版連放',
		    meta:'<b>2026.10.31（5:00–6:00pm）</b> · Halloween Apocalypse 萬聖末日啟示 · Laser Frames 第一輯 · 日期已確定',
		    tags:['有收入','社群連結','放映','媒體考古'],
		    desc:['1956 年（Don Siegel）同 1978 年（Philip Kaufman）兩個版本連放，一次過對照兩個年代點樣講同一個恐懼。',
		      '三晚系列嘅第二晚，共同問題：我哋有幾人類？ How human are we? 每場都有導讀、分析同討論。',
		      'Private cine club 形式，需要預先登記。技術上跟足 D1 規格 — 用分配放大器推幾部 CRT，唔用被動分線。'],
		    pics:['H']},
		  halloween3: {icon:'ic-disc', title:'《復製嬌妻 The Stepford Wives》',
		    meta:'<b>2026.11.07（5:00–9:00pm）</b> · Halloween Apocalypse 萬聖末日啟示 · Laser Frames 第一輯 · 日期已確定',
		    tags:['有收入','社群連結','放映','媒體考古'],
		    desc:['Bryan Forbes 1975 年嘅《復製嬌妻 The Stepford Wives》，三晚系列嘅收官一場。',
		      '共同問題：我哋有幾人類？ How human are we? 每場都有導讀、分析同討論。',
		      'Private cine club 形式，需要預先登記。技術上跟足 D1 規格 — 用分配放大器推幾部 CRT，唔用被動分線。'],
		    pics:['H']},
		  teatime: {icon:'ic-teacup', title:'Fountain Teatime 噴泉茶聚',
		    meta:'循環系列 · 雙月一次 · 2026–2029 持續',
		    tags:['社群連結','標誌系列','實驗性'],
		    desc:['請唔同嘉賓嚟傾 being、living、doing、survival 同 interdisciplinarity。FP 策劃，Linda Lai 統籌，雙月一次。',
		      '已確定場次：<b>2026.10.17</b> May Fung《May Fung amid Meshes of The Afternoon》；<b>2026.12.12</b> Jen Lee《Being, Experiencing, Perceiving, and Knowing in the More-Than-Human World》。',
		      '排期中：Lau Ho-chi 講展覽製作作為職業（2027，日期待定）；2027 尾或 2028 有《Name of the Will》遊戲開發者分享、Hugo Yeung 嘅項目，潛在合作者 Zeitgeist Studio（Mandy Wong 同 Jerry Chan）。'],
		    pics:['L','MF','JL']},
		  teatime2: {icon:'ic-teacup', title:'Being, Experiencing, Perceiving, and Knowing in the More-Than-Human World',
		    meta:'<b>2026.12.12</b>（3–6pm）· Fountain Teatime 第二場 · 日期已確定',
		    tags:['社群連結','標誌系列','講座'],
		    desc:'策展人、博士後研究員 Jen Lee 主講：喺一個「超越人類」嘅世界裡面，存在、經驗、感知同認知各自意味著咩。接住 10 月 May Fung 場，係噴泉茶聚第二場。',
		    pics:['JL','L']},
		  cineclub: {icon:'ic-crt', title:'LaserFrames Cine Club · 雷射視盤',
		    meta:'Clubs & Series · 循環系列 · 2026–2029 · 4 節 × 2 輯 · 需預先登記',
		    tags:['有收入','社群連結','實驗性','媒體考古'],
		    desc:['把賽璐珞電影轉上 laserdisc 唔止係保存一份拷貝。Laserdisc 唔同 VHS、VCD、DVD、Blu-ray 呢啲替代技術版本 — 佢係類比媒體，畫幀以連續流嘅方式存在，唔經數碼轉換。佢係一套獨特嘅儲存系統，而佢嘅消費者版本保留咗比 DVD 同其他數碼媒體更多關於電影製作嘅事實。',
		      '呢個以技術為本嘅系列會配合劇情長片放映（2006 年或之前）做現場導讀同討論 — 一邊睇舊片，一邊聽平時少有人講嘅製作真相。系列由「Halloween Apocalypse 2026」打頭陣。',
		      '放映形式唔係戲院式：三至四部舊 CRT 電視散落空間，同步播同一畫面，觀眾喺唔同角落各自圍住細電視睇 — 親密、可以傾偈、似裝置多過似戲院。以會員制 cine-club 結構運作（法律細節仍需本地確認）。'],
		    pics:['H']},
		  adminnight: {icon:'ic-laptop', title:'FP Open!「打開門」做吓事務局',
		    meta:'循環系列 · 每月 2–3 日 · <b>2026.10.02–04</b> 試局（2–8pm）',
		    tags:['社群連結','工作空間','自由定價'],
		    desc:['Admin night、chore settlement、面對面 hang out — 把非創作嘅事務（覆 email、申請 grant、整檔案）同創作活動接駁埋一齊。',
		      'Andio、Fuk-kuen 同 Sing 喺 FP 做嘢，公眾可以一齊上嚟做自己積落嘅嘢，中間夾雜小型分享。基調安靜，似自修室。歡迎 donation。',
		      '#工作空間 #學習 #閒聊 #自由定價'],
		    pics:['A','FK','S']},
		  spatial: {icon:'ic-speaker', title:'Spatial Calibration 空間校正',
		    meta:'循環系列 · 每季一次 · 2026–2029 · 聲音表演',
		    tags:['社群連結','實驗性','有收入'],
		    desc:'名字嚟自以前喺工廠大廈唔可以做公開演出，於是叫「聲壓測試」。重點係提供一個試煉場，俾經驗未夠嘅 sound artist 落場表演 — FP 負責場地、觀眾、海報設計同宣傳。',
		    pics:['A']},
		  workshop: {icon:'ic-chip', title:'Device-making Workshop Series',
		    meta:'循環系列 · 2026–2029 · 兩條軌道 · 日期待定',
		    tags:['有收入','實驗性','社群連結'],
		    desc:'兩條線：Andio 嘅 device-making，暫定四節系列（仍待佢確認），教藝術家落手做硬件；Fuk-kuen 嘅藝術家個人網站工作坊 — 仲月月俾錢 WIX？用 AI 自己起一個，一日內或最多連續兩日搞掂。呢條線係最直接嘅收入來源。',
		    pics:['A','FK']},
		  modular: {icon:'ic-knobs', title:'Synth / DAW / Modular 玩聲角',
		    meta:'Play room + Artefact Corner · 半年一次 · 2026–2029',
		    tags:['實驗性','有收入'],
		    desc:'唔算係一個活動 — 係一個 play room：FP 擺出器材（FK 會帶埋自己嘅 modular），俾人上嚟玩聲、錄聲。現場租器材同 donation 做收入。可以同 artefact corner 合埋一齊做。',
		    pics:['A','FK']},
		  mediaarch: {icon:'ic-cassette', title:'Club-MA 媒體考古 Club Media Archaeology',
		    meta:'Clubs & Series · 研究線 · 總覽 · 貫穿 2026–2029',
		    tags:['實驗性','標誌系列','媒體考古','Club-MA'],
		    desc:['Linda Lai 主持嘅 Club Media Archaeology（Club-MA）— Linda 學術書寫嘅延伸，唔係一個單一活動，而係一條貫穿全期嘅研究線，圍住「舊媒體、舊格式點樣喺當下仲有生命力」呢個大問題轉。',
		      'Club-MA 分三個 phase：Phase 1 講座（四節，日期已定）→ Phase 2 展覽製作工作坊 → Phase 3 在地群展。每 phase 有 3–4 次、每次 3 小時嘅聚會；成員可以揀參加一個、兩個或全部 phase。',
		      '另外仲有一個 <b>pop-up 展覽</b>（免費入場）：用返 Linda 自己舊作嘅材料重新編排展出，唔係新製作，係舊素材嘅新讀法 — 日期未定。',
		      '呢條線同 Hector 嘅 LaserFrames Cine Club / laserdisc 線，同埋 Angela Su 嘅香港媒體藝術調查出版計劃互相呼應扣連。'],
		    links:['mediaarch1a','mediaarch1b','mediaarch1c','mediaarch1d','mediaarch2','mediaarch3'],
		    pics:['L','H']},
		  solos: {icon:'ic-frame', title:'FP (Collective) SOLOs 據點成員個展',
		    meta:'2027–2028 · 個人展覽 · 一次性',
		    tags:['標誌系列','展覽'],
		    desc:['據點成員喺 FP5.0 周期內舉辦嘅個人展覽 — 每位成員一個獨立項目，展期通常 3–4 週。',
		      '目前排期：Fuk-kuen 動作追蹤聲音裝置（2027）、Sing CRT Wall 盒裝故事（2027 或 2028）、Hugo Yeung mnemonic catastrophe（2027 或 2028）。確實日期仍待確認。'],
		    links:['fkinstall','crtwall','mnemonic'],
		    pics:['FK','S','HG']},
		  stc: {icon:'ic-shuffle', title:'Subject to Change',
		    meta:'流動 · 未定形',
		    tags:['實驗性'],
		    desc:'Ho-chi 嘅開放式新計劃：由 "subject"、"to"、"change" 三個字嘅重新排列衍生活動。刻意保持流動、未定形 — 所以喺呢張地圖上只標到節奏，標唔到內容。',
		    pics:['HC']},
		  ml: {icon:'ic-net', title:'Poetics of ML Series 學習系統的詩學',
		    meta:'FP5.0 標誌性總結系列 · 2028–2029 · 12 週課程 · 待 ADC 批款（申請 2026.12 交）',
		    tags:['有收入','社群連結','標誌系列'],
		    desc:['兩條平行軌道：Track 1「基礎編程」（4週）打底，由零開始學 Python 同基本邏輯；Track 2「ML實作」（4週）進階到用 scikit-learn 同 PyTorch 訓練同操作實際模型。每節3小時，每軌大約24小時，用 Google Colab 做教學平台，上限30人，務求人人有機會落手做，唔係得個睇字。',
		      'Hector 係主教，貫穿成個課程嘅技術脈絡；但呢個唔止係一個 coding class — 前面有 Linda 嘅「影像作為數據」講座打頭陣，由非技術角度切入，講點樣睇「一張圖」變成「一堆數字」呢件事本身有咩文化含義，同埋帶學員做城市考察，將呢種思考帶出課室。課程中段有 Winnie Soon 同 Fiona Lau 嘅 lecture-performance「Generating dialogue, generating text」，用表演形式拆解人機對話同文本生成呢個題目。尾聲收喺 Hector 嘅公開講座「Poetics of Infrastructure」，將前面成套技術訓練拉返上去，問返「基礎建設本身有冇詩意」呢個大問題。',
		      '即係話成套嘢嘅骨架係編程訓練，但血肉係文化提問 — 技術同人文兩條線一齊教，先夠得上「學習系統的詩學」呢個名。（延伸版本預算約 HK$192,060，含10%行政費；12月前要交 ADC 申請。）'],
		    pics:['H','HG','L']},
		  vcd: {icon:'ic-film', title:'More than Found Footage 何止現成影音碎片咁簡單',
		    meta:'公開徵集 · 2027.04 開 → 2027.10 截 → 2028.03 發表',
		    tags:['社群連結','標誌系列','公開徵集'],
		    desc:['大約 300 套香港商業電影嘅 VCD 會開放俾申請者（按公佈名單揀）複製做再創作。同 Wai 嘅 VCD shop 同 zine 系列「Wanna watch again」係同一條線。',
		      '<ul><li><b>2027.04–10</b>：導論講座；四月開徵集，十月截止</li>'
		      +'<li><b>2027.11 – 2028.02</b>：評審選拔同宣傳</li>'
		      +'<li><b>2028.03</b>：發表 — 放映會加討論</li></ul>',
		      '合作單位待定。'],
		    pics:['L','W']},
		  fkinstall: {icon:'ic-motion', title:'Motion Gesture Tracking 動作追蹤聲音裝置',
		    meta:'一次性展覽 · 2027.09–10（待確認）· 展期 3–4 週',
		    tags:['實驗性'],
		    desc:'Motion gesture tracking 聲音裝置，可以同 modular 一齊展出。一次性展覽，大約一年之後先發生 — 確實日期未定，所以喺呢度只虛指住 2027 呢條地平線。',
		    pics:['FK']},
		  crtwall: {icon:'ic-wall', title:'CRT Wall 盒裝故事',
		    meta:'一次性展覽 · 2027 或 2028（待確認）· 展期 3–4 週',
		    tags:['實驗性','社群連結'],
		    desc:'Sing 嘅流動影像 CRT 牆，帶參與式成分，FP 提供場地同 CRT。排期要留意：同 Private Cine Club 用緊同一批電視機 — 展覽霸機嗰段時間，放映要停或改單一投影。',
		    pics:['S']},
		  board: {icon:'ic-board', title:'地形康樂棋 Topographic Carrom',
		    meta:'Play room · 一次性 · 2027 · 製作＋開玩',
		    tags:['社群連結','實驗性'],
		    desc:'自己鬥木整嘅康樂棋：棋盤唔係普通正方形 — 上面有山、草地、障礙物；唔止四個窿，中間仲有好多窿；另加特別規則，例如用三隻棋圍住對手中間會死。由 Ng Sing 同 Fuk-kuen 認頭做 lead。',
		    pics:['S','FK']},
		  toy: {icon:'ic-robot', title:'Toy as Medium #4',
		    meta:'一次性展覽 · 約 2028',
		    tags:['標誌系列','社群連結','有收入'],
		    desc:'FP 招牌研究型項目，2016–2023 已做三輯。第四輯強調跨學科同媒體考古視角 — 觀眾可以用手觸碰物件嘅玩具機器展，由硬件工作坊長出嚟。',
		    pics:['A']},
		  mediaarch1a: {icon:'ic-cassette', title:'Club-MA Phase 1 · 媒體考古…榕樹下（第一節）',
		    meta:'<b>2026.11.28（3–6pm）</b> · Club-MA Phase 1 · 四節之一 · 日期已確定',
		    tags:['實驗性','標誌系列','講座','媒體考古'],
		    desc:['Club-MA Phase 1 開課，講座加工作坊，一共四節，由 Linda Lai 主持。',
		      '前人的日常「欲望」驅策着「新」媒體同工具嘅出現，即使佢哋仲未有名。呢一輯就係由呢個問題行開去。',
		      '<ul><li>媒體考古個案逐個講：遠程臨場、永生不朽、光與火、指頭的故事、記憶同庫存…</li>'
		      +'<li>媒體考古點樣豐富我哋對媒體（藝術）實踐嘅理解 — 由研究嘅視野走到藝術創作嘅視野。</li></ul>'],
		    pics:['L']},
		  mediaarch1b: {icon:'ic-cassette', title:'Club-MA Phase 1 · 媒體考古…榕樹下（第二節）',
		    meta:'<b>2026.12.05（3–6pm）</b> · Club-MA Phase 1 · 四節之二 · 日期已確定',
		    tags:['實驗性','標誌系列','講座','媒體考古','Club-MA'],
		    desc:['Club-MA Phase 1 第二節，講座加工作坊，由 Linda Lai 主持。',
		      '延續日常生活中嘅媒體考古片段同時刻：遠程臨場、永生不朽、光與火、指頭的故事、記憶同庫存…'],
		    pics:['L']},
		  mediaarch1c: {icon:'ic-cassette', title:'Club-MA Phase 1 · 媒體考古…榕樹下（第三節）',
		    meta:'<b>2027.01.30（3–6pm）</b> · Club-MA Phase 1 · 四節之三 · 日期已確定',
		    tags:['實驗性','標誌系列','講座','媒體考古','Club-MA'],
		    desc:['Club-MA Phase 1 第三節，講座加工作坊，由 Linda Lai 主持。',
		      '由研究嘅視野行向藝術創作嘅視野：媒體考古點樣改寫我哋對媒體（藝術）實踐嘅理解。'],
		    pics:['L']},
		  mediaarch1d: {icon:'ic-cassette', title:'Club-MA Phase 1 · 媒體考古…榕樹下（第四節）',
		    meta:'<b>2027.02.06（3–6pm）</b> · Club-MA Phase 1 · 四節之四 · 日期已確定',
		    tags:['實驗性','標誌系列','講座','媒體考古','Club-MA'],
		    desc:['Club-MA Phase 1 嘅收結一節，講座加工作坊，由 Linda Lai 主持。',
		      '收攏四節嘅個案同討論，為 Phase 2「除草接枝施肥」嘅展覽製作工作坊鋪路。'],
		    pics:['L']},
		  mediaarch2: {icon:'ic-plant', title:'Club-MA Phase 2 · 媒體考古…除草接枝施肥',
		    meta:'2027–2028 · Club-MA Phase 2 · 3 節 × 3 小時 · 日期待定',
		    tags:['實驗性','標誌系列','工作坊','媒體考古','Club-MA'],
		    desc:['Club-MA Phase 2 轉入展覽製作（exhibition-making），三節工作坊：',
		      '<ul><li><b>工作坊 (1)</b>：建構影像圖譜 — 由日常物品構成嘅想像樹狀網絡。</li>'
		      +'<li><b>工作坊 (2)</b>：追尋驅動工具發明嘅「慾望」，由呢個角度重新理解科技史。</li>'
		      +'<li><b>工作坊 (3)</b>：追溯個人嘅藝術／創作脈絡 — 整理成一份屬於自己嘅作品係譜。</li></ul>'],
		    pics:['L']},
		  mediaarch3: {icon:'ic-tree', title:'Club-MA Phase 3 · 媒體考古…奇異叢林',
		    meta:'<b>2028.03</b> · Club-MA Phase 3 · 在地群展 · 月份已確定',
		    tags:['實驗性','標誌系列','展覽','媒體考古','Club-MA'],
		    desc:'Club-MA 最後一個 phase：同 Phase 1、2 嘅講座／工作坊參加者合作，把兩 phase 所獲化為一個在地群展。',
		    pics:['L']},
		  jazz: {icon:'ic-note', title:'Jazz vs Experimental Sound',
		    meta:'2027 或 2028（待確認）· 三個演出單元',
		    tags:['實驗性','社群連結','表演'],
		    desc:'爵士同實驗聲音嘅演出。目標三個演出單元，其中一個會以製作一份 FP Manual 為目標。Sing 正邀請「Fountain de Chopin 翻騰三周半」同其他爵士樂愛好者做潛在合作者。日期未定。',
		    pics:['S']},
		  mnemonic: {icon:'ic-chip', title:'mnemonic catastrophe',
		    meta:'2027 或 2028（待確認）· 個人展覽',
		    tags:['實驗性','數據文化'],
		    desc:'Hugo Yeung 嘅展覽，回應當下機器學習生態裡面由數據文化衍生出嚟嘅問題。確實日期待定。',
		    pics:['HG']},
		  essaying: {icon:'ic-mic', title:'Essaying with Sight and Sound 聲影散文探索：講演式表演系列',
		    meta:'公開徵集 · 2028.04 開 → 2028.06 截 → 2029.03 發表',
		    tags:['社群連結','公開徵集','表演'],
		    desc:['公開徵集提案加導論講座，申請要交：題目、論點、媒介範圍、素材來源、演出流程（大綱）。',
		      '<ul><li><b>2028.04–06</b>：四月開徵集，六月截止收提案</li>'
		      +'<li><b>2028.07 – 2029.11</b>：評審選拔同行政安排</li>'
		      +'<li><b>2029.03</b>：發表 — 開門講演式表演系列</li></ul>',
		      '合作單位待定。'],
		    pics:['L']},
		  platform: {icon:'ic-shop', title:'FLOATING PLATFORM 據㸃浮台',
		    meta:'常設 · 2026–2029 · JCCAC L3-06D',
		    tags:['有收入','社群連結','常設'],
		    desc:'FP 喺 JCCAC L3-06D 嘅寄賣角（sales corner），全期常設。由 Lai Wai-leung 負責。',
		    pics:['W']},
		  tsundoku: {icon:'ic-books', title:'Tsundoku 負載讀取',
		    meta:'一次性 · 開放周末 · 約 2028–29',
		    tags:['社群連結'],
		    desc:'「積書」：一座書山堆喺 FP 空間度。開放周末做現場裝置；再嚟嘅周末做再創造 — 分類、堆山丘、另類閱讀方法、造新書。可以做 JCCAC 合作項目。',
		    pics:['L','FP']}
		};

		/* FP5.0 program categories (from the FP5.0 brief) */
		const CATEGORIES = [
		  {id:'opendoor', en:'Regular Open Door', zh:'定期打開門'},
		  {id:'clubs', en:'Clubs & Series', zh:'閉門研習｜實作系列'},
		  {id:'opencall', en:'OPEN CALL', zh:'公開徵集'},
		  {id:'playroom', en:'PLAY ROOM + Artefact Corner', zh:'玩樂場'},
		  {id:'solos', en:'FP (Collective) SOLOs', zh:'據點成員個展'},
		  {id:'accumulation', en:'Accumulation', zh:'集少成多'}
		];
		const CAT_OF = {
		  adminnight:  'opendoor',
		  mayfung:     'clubs',
		  halloween1:  'clubs',
		  halloween2:  'clubs',
		  halloween3:  'clubs',
		  teatime:     'clubs',
		  teatime2:    'clubs',
		  cineclub:    'clubs',
		  spatial:     'clubs',
		  workshop:    'clubs',
		  mediaarch:   'clubs',
		  mediaarch1a: 'clubs',
		  mediaarch1b: 'clubs',
		  mediaarch1c: 'clubs',
		  mediaarch1d: 'clubs',
		  mediaarch2:  'clubs',
		  mediaarch3:  'clubs',
		  stc:         'clubs',
		  ml:          'clubs',
		  jazz:        'clubs',
		  toy:         'clubs',
		  modular:     'playroom',
		  board:       'playroom',
		  vcd:         'opencall',
		  essaying:    'opencall',
		  solos:       'solos',
		  fkinstall:   'solos',
		  crtwall:     'solos',
		  mnemonic:    'solos',
		  platform:    'accumulation',
		  tsundoku:    'accumulation'
		};
		const catOf = id => CAT_OF[id] || null;
		const CLUBS = {
		  laserframes: {
		    en:'LaserFrames Cine Club', zh:'雷射視盤',
		    desc:[
		      'In the form of a private cine club, visitors register for an FP private club membership to join discussion and media sharing events. They may join by season to participate in all events.',
		      '以 private cine club 形式運作：參加者須預先登記會籍，方可參與討論同 media sharing。可以按季加入，參與該季全部場次。放映用三至四部 CRT 電視散落空間同步播放，似裝置多過似戲院。'
		    ]
		  },
		  clubma: {
		    en:'Club-MA', zh:'媒體考古',
		    desc:[
		      'Club Media Archaeology proceeds in 3 phases: (1) lectures as tale-telling; (2) workshops with research and an introspective look at one\'s own artistic journeys; (3) a group exhibition of two-year learning. Each phase has 3–4 three-hour meetings. Members may join one, two, or all three phases.',
		      'Club-MA 由 Linda Lai 主持，分三個 phase：講座 → 展覽製作工作坊 → 在地群展。每個 phase 3–4 次、每次 3 小時；可以揀參加一個、兩個或全部 phase。'
		    ]
		  }
		};
		const CLUB_OF = {
		  halloween1: 'laserframes', halloween2: 'laserframes', halloween3: 'laserframes',
		  cineclub: 'laserframes',
		  mediaarch: 'clubma', mediaarch1a: 'clubma', mediaarch1b: 'clubma',
		  mediaarch1c: 'clubma', mediaarch1d: 'clubma', mediaarch2: 'clubma', mediaarch3: 'clubma'
		};
		const CAT_ITEMS = {};
		Object.keys(CAT_OF).forEach(id=>{
		  if(!DATA[id]) return;
		  const c = CAT_OF[id];
		  (CAT_ITEMS[c] = CAT_ITEMS[c] || []).push(id);
		});

		/* recurring-series bracket: span from its own row down to the last card of the section */
		(function(){
		  const mark = document.querySelector('.spanmark');
		  const endRow = document.getElementById('rec-end');
		  if(!mark || !endRow) return;
		  const fit = ()=>{
		    const start = mark.parentElement.getBoundingClientRect().top;
		    const end = endRow.getBoundingClientRect().bottom;
		    mark.style.height = Math.max(0, end - start + 6) + 'px';
		  };
		  fit();
		  onWindow('resize', fit);
		  onWindow('load', fit);
		  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
		})();

		const overlay = document.getElementById('overlay');
		const mIcon = document.getElementById('m-icon');
		const mTitle = document.getElementById('m-title');
		const mMeta = document.getElementById('m-meta');
		const mDesc = document.getElementById('m-desc');
		const mClub = document.getElementById('m-club');
		const mLinks = document.getElementById('m-links');
		const mKw = document.getElementById('m-kw');
		const mCat = document.getElementById('m-cat');
		const mPics = document.getElementById('m-pics');
		let lastFocus = null;

		function openModal(id){
		  const d = DATA[id];
		  if(!d) return;
		  setIcon(mIcon, id, d.icon);
		  mTitle.textContent = d.title;
		  mMeta.innerHTML = d.meta;
		  mDesc.innerHTML = Array.isArray(d.desc) ? d.desc.map(p=>'<p>'+p+'</p>').join('') : '<p>'+d.desc+'</p>';
		  const clubKey = CLUB_OF[id];
		  const club = clubKey && CLUBS[clubKey];
		  const isClubOverview = id === 'cineclub' || id === 'mediaarch';
		  if(club && !isClubOverview){
		    mClub.innerHTML = '<div class="club-desc-lab">'+club.en+'</div>'
		      + club.desc.map(p=>'<p>'+p+'</p>').join('');
		  } else {
		    mClub.innerHTML = '';
		  }
		  const cat = CATEGORIES.find(x=>x.id===catOf(id));
		  mCat.innerHTML = cat
		    ? '<span class="cat-of-lab">Program 分類</span><button class="cat-tag" type="button" data-cat="'+cat.id+'">'+cat.zh+'</button>'
		    : '';
		  mCat.querySelector('.cat-tag')?.addEventListener('click', ()=>{
		    closeModal();
		    setTimeout(()=>openCategoryModal(cat.id), 50);
		  });
		  const kwHTML = kwChipsHTML(id);
		  mKw.innerHTML = kwHTML ? '<span class="kw-of-lab">所屬關鍵詞</span>'+kwHTML : '';
		  mKw.querySelectorAll('.kw-tag').forEach(btn=>{
		    btn.addEventListener('click', ()=>{
		      const k = btn.dataset.kw;
		      closeModal();
		      setTimeout(()=>openKeywordModal(k), 50);
		    });
		  });
		  mLinks.innerHTML = (d.links || []).filter(t=>DATA[t]).map(t=>
		    '<button class="person-item" type="button" data-target="'+t+'">'
		    + '<span class="pi-icon">'+iconHTML(t, DATA[t].icon)+'</span>'
		    + '<span class="pi-title">'+DATA[t].title+'</span>'
		    + '</button>').join('');
		  mLinks.querySelectorAll('.person-item').forEach(btn=>{
		    btn.addEventListener('click', ()=>{
		      const target = btn.dataset.target;
		      closeModal();
		      setTimeout(()=>{ scrollToCard(target); openModal(target); }, 50);
		    });
		  });
		  mPics.innerHTML = d.pics.map(k=>{
		    const p = PEOPLE[k];
		    return '<span class="person">'+avHTML(k)+'<span>'+p.name+'</span></span>';
		  }).join('');
		  lastFocus = document.activeElement;
		  overlay.classList.add('open');
		  document.getElementById('m-close').focus();
		  document.body.style.overflow = 'hidden';
		}
		function closeModal(){
		  overlay.classList.remove('open');
		  document.body.style.overflow = '';
		  if(lastFocus) lastFocus.focus();
		}

		document.querySelectorAll('.card').forEach(c=>{
		  const id = c.dataset.id;
		  const d = DATA[id];
		  const picsEl = c.querySelector('.pics');
		  if(d && picsEl){
		    picsEl.innerHTML = d.pics.map(avHTML).join('');
		    let wrap = picsEl.parentElement;
		    if(!wrap.classList.contains('people')){
		      wrap = document.createElement('div');
		      wrap.className = 'people';
		      picsEl.parentNode.insertBefore(wrap, picsEl);
		      wrap.appendChild(picsEl);
		    }
		    let namesEl = wrap.querySelector('.names');
		    if(!namesEl){
		      namesEl = document.createElement('div');
		      namesEl.className = 'names';
		      wrap.appendChild(namesEl);
		    }
		    namesEl.innerHTML = d.pics.map(k=>{
		      const p = PEOPLE[k];
		      return '<span>'+(p ? p.name : k)+'</span>';
		    }).join('');
		  }
		  const iconEl = c.querySelector('.icon');
		  if(d && iconEl && ICONS[id]) setIcon(iconEl, id, d.icon);
		  const cat = CATEGORIES.find(x=>x.id===catOf(id));
		  if(cat){
		    let catEl = c.querySelector('.cat-pill');
		    const titleEl = c.querySelector('.top > div h3');
		    if(!catEl && titleEl){
		      catEl = document.createElement('span');
		      catEl.className = 'cat-pill cat-'+cat.id;
		      titleEl.insertAdjacentElement('afterend', catEl);
		    }
		    catEl.textContent = cat.zh;
		    catEl.title = cat.en;
		  }
		  const clubKey = CLUB_OF[id];
		  if(clubKey){
		    const club = CLUBS[clubKey];
		    let folder = c.querySelector('.club-folder');
		    if(!folder){
		      folder = document.createElement('div');
		      folder.className = 'club-folder club-folder-'+clubKey;
		      folder.setAttribute('aria-hidden', 'true');
		      c.insertBefore(folder, c.firstChild);
		    }
		    folder.innerHTML = '<span class="club-folder-en">'+club.en+'</span>';
		    c.classList.add('has-club-folder');
		  }
		  c.addEventListener('click', ()=>openModal(c.dataset.id));
		  c.addEventListener('keydown', e=>{
		    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openModal(c.dataset.id); }
		  });
		});
		document.getElementById('m-close').addEventListener('click', closeModal);
		overlay.addEventListener('click', e=>{ if(e.target===overlay) closeModal(); });

		/* ============ artist bar + person modal ============ */
		const PERSON_ITEMS = {};
		Object.keys(DATA).forEach(id=>{
		  (DATA[id].pics || []).forEach(k=>{
		    (PERSON_ITEMS[k] = PERSON_ITEMS[k] || []).push(id);
		  });
		});

		const pOverlay = document.getElementById('p-overlay');
		const pIcon = document.getElementById('p-icon');
		const pTitle = document.getElementById('p-title');
		const pMeta = document.getElementById('p-meta');
		const pList = document.getElementById('p-list');
		let lastFocusP = null;

		function scrollToCard(id){
		  const card = document.querySelector('.card[data-id="'+id+'"]');
		  if(!card) return;
		  card.scrollIntoView({behavior:'smooth', block:'center'});
		  card.classList.remove('flash');
		  // restart animation even if triggered twice in a row
		  void card.offsetWidth;
		  card.classList.add('flash');
		  setTimeout(()=>card.classList.remove('flash'), 1500);
		}

		function openPersonModal(k){
		  const p = PEOPLE[k];
		  const ids = PERSON_ITEMS[k] || [];
		  if(!p || !ids.length) return;
		  pIcon.innerHTML = p.photo ? '<img src="'+p.photo+'" alt="'+p.name+'" onerror="this.remove()">' : '';
		  pTitle.textContent = p.name;
		  pMeta.textContent = ids.length + ' 個相關節目';
		  pList.innerHTML = ids.map(id=>{
		    const d = DATA[id];
		    return '<button class="person-item" type="button" data-target="'+id+'">'
		      + '<span class="pi-icon">'+iconHTML(id, d.icon)+'</span>'
		      + '<span class="pi-title">'+d.title+'</span>'
		      + '</button>';
		  }).join('');
		  pList.querySelectorAll('.person-item').forEach(btn=>{
		    btn.addEventListener('click', ()=>{
		      const target = btn.dataset.target;
		      closePersonModal();
		      setTimeout(()=>scrollToCard(target), 50);
		    });
		  });
		  lastFocusP = document.activeElement;
		  pOverlay.classList.add('open');
		  document.getElementById('p-close').focus();
		  document.body.style.overflow = 'hidden';
		}
		function closePersonModal(){
		  pOverlay.classList.remove('open');
		  document.body.style.overflow = '';
		  if(lastFocusP) lastFocusP.focus();
		}
		document.getElementById('p-close').addEventListener('click', closePersonModal);
		pOverlay.addEventListener('click', e=>{ if(e.target===pOverlay) closePersonModal(); });

		const artistAvs = document.getElementById('artist-avs');
		Object.keys(PEOPLE).forEach(k=>{
		  const p = PEOPLE[k];
		  if(!p.photo || !(PERSON_ITEMS[k] || []).length) return;
		  const btn = document.createElement('button');
		  btn.type = 'button';
		  btn.className = 'artist-av';
		  btn.title = p.name;
		  btn.setAttribute('aria-label', p.name);
		  btn.innerHTML = '<img src="'+p.photo+'" alt="'+p.name+'" loading="lazy" onerror="this.closest(\'.artist-av\').remove()">';
		  btn.addEventListener('click', ()=>openPersonModal(k));
		  artistAvs.appendChild(btn);
		});


		/* ============ FP5.0 keywords ============ */
		const KEYWORDS = [
		  {id:'commoning', icon:'ic-net', zh:'共有實踐', en:'Commoning',
		    title:'Commoning', sub:'共有實踐，社群共造',
		    points:[
		      '一個社會經濟過程 — a social-economic process',
		      '共同協作以創造、管理同保護共享資源嘅社會過程',
		      '自主管理嘅資產：工具、知識、空間、技能與專長',
		      '受託守護重於所有權 — stewardship over ownership',
		      '積極練習、持續實踐 — active practice',
		      '開源：共享創作背後嘅知識同資源'],
		    ref:{label:'Commoning the city: Reinventing togetherness',
		      url:'https://culturalfoundation.eu/stories/commoning-the-city-reinventing-togetherness/'}},
		  {id:'coindiv', icon:'ic-board', zh:'共同個體化', en:'Co-individuation',
		    title:'Co-individuation', sub:'共同個體化，協作生成',
		    points:[
		      '「共有」嘅進一步 — 每個活躍成員都係一個自己嘅中心',
		      '個人 = 動態主體 — the individual as a dynamic subject',
		      '個體嘅意義源自於協作',
		      '「我」與「我們」：不可分割嘅現實',
		      '「我」與「我們」透過第三種要素 — 技術系統或共享工具 — 實現共同個體化',
		      '「存在」與「變化」嘅共同背景：工具、媒介同創藝，以擴張「藝術」嘅所指'],
		    ref:{label:'Gilbert Simondon、Bernard Stiegler'}},
		  {id:'contrib', icon:'ic-shop', zh:'貢獻經濟', en:'Contributive Economics',
		    title:'Contributive Economics', sub:'貢獻經濟',
		    points:[
		      '建基於「共有化」同「共同個體化」',
		      '個人係積極嘅貢獻者，模糊咗消費者同生產者之間嘅界線',
		      '實現「最低收入保障」嘅收入與支持體系 — 有別於營利或慈善公益機制 — 把投入研究、藝術及社區關懷嘅時間最大化',
		      '所有「能動者」都係租金嘅共同支付者，令 JCCAC 工作室可以服務朋友同藝術家',
		      '2026 年 10 月，據點有 10 位長年投入嘅成員；往後彈性會員制會歡迎「有嘢想一齊做」嘅朋友以季度或年度加入']},
		  {id:'reactivate', icon:'ic-plant', zh:'資源活化', en:'Reactivation',
		    title:'Reactivation of Resources', sub:'重新活化群體與個人資源',
		    points:[
		      '媒體硬體、媒體內容、研究成果',
		      '個人收藏、學術研究、專業技術專長',
		      '藝術素養、個人興趣與夢想',
		      '孵化、發展及創造新型藝術團體同獨立藝術空間嘅經驗',
		      '發表、表述同出版嘅經驗']},
		  {id:'archaeology', icon:'ic-cassette', zh:'媒體考古', en:'Media Archaeology',
		    title:'Media Archaeology: Retro-Futurism', sub:'媒體考古學：昨日之明天',
		    points:[
		      '探索過去嘅人哋如何構想未來',
		      '「昨日之明天」作為帶創造性嘅悖論：將過往或過時嘅美學應用於未來科技嘅構想',
		      '系列講座同工作坊：作為史學與研究方法嘅媒體考古學；作為藝術創作方法嘅媒體考古學',
		      '活化、重啟舊機器',
		      '發掘：揭露過時媒體嘅真相',
		      '「歸檔」作為展覽 — exhibition as archiving']},
		  {id:'datacult', icon:'ic-chip', zh:'數據文化', en:'Data Culture',
		    title:'Navigating the Data Culture', sub:'駕馭數據文化：從數據根基到實用機器學習',
		    points:[
		      '為藝術創作者而設嘅機器學習 — Machine Learning for Artists',
		      '理解「數據」：佢嘅歷史、本質，以及喺塑造當今人工智慧生態中扮演嘅角色',
		      '讓已具備基礎程式技能嘅創作人超越文法層面，探索數據文化嘅指向',
		      '透過一系列互動式機器學習工作坊，將數據哲學同現代人工智慧嘅實用工具結合'],
		    way:['Waypoint 1 · Roots — 數據歷史與本質',
		      'Waypoint 2 · The Milieu — 理解 AI 現實',
		      'Waypoint 3 · Horizons — 機器學習實作']}
		];

		/* Which keyword(s) each programme answers to. Tagged from the FP5.0
		   KEYWORDS brief: some are stated there outright (Laser Frames carries
		   [media archaeology]; the ML series repeats the Data Culture waypoints;
		   mnemonic catastrophe names the data culture; Toy as Medium and Floating
		   Platform both say they echo media archaeology), the rest read off what
		   each entry describes. Edit here to re-tag. */
		const KW_OF = {
		  mayfung:     ['commoning','reactivate'],
		  halloween1:  ['archaeology','reactivate','contrib'],
		  halloween2:  ['archaeology','reactivate','contrib'],
		  halloween3:  ['archaeology','reactivate','contrib'],
		  teatime:     ['commoning','coindiv'],
		  teatime2:    ['commoning'],
		  cineclub:    ['archaeology','reactivate','contrib'],
		  adminnight:  ['commoning','contrib'],
		  spatial:     ['commoning','coindiv'],
		  workshop:    ['commoning','reactivate'],
		  modular:     ['commoning','contrib'],
		  mediaarch:   ['archaeology','reactivate'],
		  mediaarch1a: ['archaeology'],
		  mediaarch1b: ['archaeology'],
		  mediaarch1c: ['archaeology'],
		  mediaarch1d: ['archaeology'],
		  mediaarch2:  ['archaeology','coindiv'],
		  mediaarch3:  ['archaeology','coindiv'],
		  stc:         ['coindiv'],
		  ml:          ['datacult','reactivate'],
		  vcd:         ['archaeology','reactivate'],
		  fkinstall:   ['datacult'],
		  crtwall:     ['archaeology','reactivate'],
		  board:       ['coindiv','commoning'],
		  toy:         ['archaeology','reactivate'],
		  jazz:        ['coindiv','commoning'],
		  mnemonic:    ['datacult'],
		  essaying:    ['commoning','coindiv'],
		  platform:    ['contrib','reactivate','archaeology'],
		  tsundoku:    ['commoning','coindiv','reactivate']
		};

		const KW_ORDER = KEYWORDS.map(k=>k.id);
		const kwOf = id => (KW_OF[id] || []).slice().sort((a,b)=>KW_ORDER.indexOf(a)-KW_ORDER.indexOf(b));
		/* the same table read the other way round, for the keyword dialog */
		const KW_ITEMS = {};
		Object.keys(KW_OF).forEach(id=>{
		  if(!DATA[id]) return;
		  kwOf(id).forEach(k=>{ (KW_ITEMS[k] = KW_ITEMS[k] || []).push(id); });
		});

		function kwChipsHTML(id){
		  return kwOf(id).filter(k=>KEYWORDS.some(x=>x.id===k)).map(k=>{
		    const kw = KEYWORDS.find(x=>x.id===k);
		    return '<button class="kw-tag" type="button" data-kw="'+k+'" title="'+kw.title+'">'+kw.zh+'</button>';
		  }).join('');
		}

		const kOverlay = document.getElementById('k-overlay');
		const kIcon = document.getElementById('k-icon');
		const kTitle = document.getElementById('k-title');
		const kMeta = document.getElementById('k-meta');
		const kPoints = document.getElementById('k-points');
		const kWay = document.getElementById('k-way');
		const kRef = document.getElementById('k-ref');
		const kList = document.getElementById('k-list');
		const kCount = document.getElementById('k-count');
		let lastFocusK = null;

		function openKeywordModal(id){
		  const k = KEYWORDS.find(x=>x.id===id);
		  if(!k) return;
		  kIcon.innerHTML = SVG_ICON(k.icon);
		  kTitle.textContent = k.title;
		  kMeta.textContent = k.sub;
		  kPoints.innerHTML = k.points.map(p=>'<li>'+p+'</li>').join('');
		  kWay.innerHTML = (k.way || []).map(w=>'<span>'+w+'</span>').join('');
		  const items = KW_ITEMS[k.id] || [];
		  kList.innerHTML = items.map(id=>
		    '<button class="person-item" type="button" data-target="'+id+'">'
		    + '<span class="pi-icon">'+iconHTML(id, DATA[id].icon)+'</span>'
		    + '<span class="pi-title">'+DATA[id].title+'</span>'
		    + '</button>').join('');
		  kCount.textContent = items.length ? items.length + ' 個相關節目' : '';
		  kList.querySelectorAll('.person-item').forEach(btn=>{
		    btn.addEventListener('click', ()=>{
		      const target = btn.dataset.target;
		      closeKeywordModal();
		      setTimeout(()=>{ scrollToCard(target); openModal(target); }, 50);
		    });
		  });
		  if(k.ref){
		    kRef.innerHTML = k.ref.url
		      ? '參考：<a href="'+k.ref.url+'" target="_blank" rel="noreferrer">'+k.ref.label+'</a>'
		      : '參考：'+k.ref.label;
		  } else {
		    kRef.innerHTML = '';
		  }
		  lastFocusK = document.activeElement;
		  kOverlay.classList.add('open');
		  document.getElementById('k-close').focus();
		  document.body.style.overflow = 'hidden';
		}
		function closeKeywordModal(){
		  kOverlay.classList.remove('open');
		  document.body.style.overflow = '';
		  if(lastFocusK) lastFocusK.focus();
		}
		document.getElementById('k-close').addEventListener('click', closeKeywordModal);
		kOverlay.addEventListener('click', e=>{ if(e.target===kOverlay) closeKeywordModal(); });

		const kwChips = document.getElementById('kw-chips');
		kwChips.innerHTML = KEYWORDS.map(k=>
		  '<button class="kw-chip" type="button" data-kw="'+k.id+'" aria-label="'+k.title+'">'
		  + '<span class="kw-chip-zh">'+k.zh+'</span>'
		  + '<span class="kw-chip-en">'+k.en+'</span>'
		  + '</button>').join('');
		kwChips.querySelectorAll('.kw-chip').forEach(btn=>{
		  btn.addEventListener('click', ()=>openKeywordModal(btn.dataset.kw));
		});

		const cOverlay = document.getElementById('c-overlay');
		const cTitle = document.getElementById('c-title');
		const cMeta = document.getElementById('c-meta');
		const cList = document.getElementById('c-list');
		const cCount = document.getElementById('c-count');
		let lastFocusC = null;

		function openCategoryModal(id){
		  const c = CATEGORIES.find(x=>x.id===id);
		  if(!c) return;
		  cTitle.textContent = c.en;
		  cMeta.textContent = c.zh;
		  const items = CAT_ITEMS[c.id] || [];
		  cList.innerHTML = items.map(pid=>
		    '<button class="person-item" type="button" data-target="'+pid+'">'
		    + '<span class="pi-icon">'+iconHTML(pid, DATA[pid].icon)+'</span>'
		    + '<span class="pi-title">'+DATA[pid].title+'</span>'
		    + '</button>').join('');
		  cCount.textContent = items.length ? items.length + ' 個相關節目' : '';
		  cList.querySelectorAll('.person-item').forEach(btn=>{
		    btn.addEventListener('click', ()=>{
		      const target = btn.dataset.target;
		      closeCategoryModal();
		      setTimeout(()=>{ scrollToCard(target); openModal(target); }, 50);
		    });
		  });
		  lastFocusC = document.activeElement;
		  cOverlay.classList.add('open');
		  document.getElementById('c-close').focus();
		  document.body.style.overflow = 'hidden';
		}
		function closeCategoryModal(){
		  cOverlay.classList.remove('open');
		  document.body.style.overflow = '';
		  if(lastFocusC) lastFocusC.focus();
		}
		document.getElementById('c-close').addEventListener('click', closeCategoryModal);
		cOverlay.addEventListener('click', e=>{ if(e.target===cOverlay) closeCategoryModal(); });

		const catChips = document.getElementById('cat-chips');
		catChips.innerHTML = CATEGORIES.map(c=>
		  '<button class="cat-chip" type="button" data-cat="'+c.id+'" aria-label="'+c.en+'">'
		  + '<span class="cat-chip-zh">'+c.zh+'</span>'
		  + '<span class="cat-chip-en">'+c.en+'</span>'
		  + '</button>').join('');
		catChips.querySelectorAll('.cat-chip').forEach(btn=>{
		  btn.addEventListener('click', ()=>openCategoryModal(btn.dataset.cat));
		});

		onDocument('keydown', e=>{
		  if(e.key !== 'Escape') return;
		  if(cOverlay.classList.contains('open')) closeCategoryModal();
		  else if(kOverlay.classList.contains('open')) closeKeywordModal();
		  else if(pOverlay.classList.contains('open')) closePersonModal();
		  else if(overlay.classList.contains('open')) closeModal();
		});


		return () => {
			cleanups.forEach((off) => off());
			// a modal left open had locked scrolling on the document
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>FP 5.0 三年活動地圖 — Floating Projects</title>
	<meta
		name="description"
		content="Floating Projects 5.0 — A Learning Centre, A Hub for Experiments. 2026 年秋到 2029 年嘅節目地圖。"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700;900&family=Noto+Sans+TC:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="fp5-timeline">
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
<symbol id="ic-teacup" viewBox="0 0 24 24"><path d="M4 10h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 7c0-1.2 1-1.4 1-2.6M12 7c0-1.2 1-1.4 1-2.6"/></symbol>
<symbol id="ic-crt" viewBox="0 0 24 24"><rect x="3" y="5" width="15" height="12" rx="2"/><rect x="5.5" y="7.5" width="10" height="7" rx="1"/><circle cx="20.2" cy="9" r="1"/><circle cx="20.2" cy="13" r="1"/><path d="M7 20h8M9 17v3M13 17v3"/></symbol>
<symbol id="ic-laptop" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="9" rx="1.4"/><path d="M3 18h18l-2-4H5l-2 4z"/><path d="M10.5 16.5h3"/></symbol>
<symbol id="ic-net" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="12" r="2"/><path d="M6.8 10.9 10.3 6.4M6.8 13.1l3.5 4.5M13.7 6.4l3.5 4.5M13.7 17.6l3.5-4.5"/></symbol>
<symbol id="ic-chip" viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10" y="10" width="4" height="4"/><path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M7 9H4M7 12H4M7 15H4M20 9h-3M20 12h-3M20 15h-3"/></symbol>
<symbol id="ic-speaker" viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"/></symbol>
<symbol id="ic-knobs" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="12" r="2.2"/><path d="M8 12l1.4-1.4"/><circle cx="16" cy="12" r="2.2"/><path d="M16 12v-2.2"/></symbol>
<symbol id="ic-cassette" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><path d="M9 12h6"/><path d="M6 18l1.5-2.5h9L18 18"/></symbol>
<symbol id="ic-disc" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.4"/><path d="M12 3.5A8.5 8.5 0 0 1 20.5 12" stroke-dasharray="2 2.4"/></symbol>
<symbol id="ic-motion" viewBox="0 0 24 24"><circle cx="8" cy="12" r="2.4"/><path d="M13.5 7.5a7 7 0 0 1 0 9M16.5 5a11 11 0 0 1 0 14"/><path d="M8 14.5v4M8 9.5v-3"/></symbol>
<symbol id="ic-wall" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></symbol>
<symbol id="ic-board" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="12" cy="12" r="1.6"/><circle cx="7.5" cy="7.5" r="1.2"/><circle cx="16.5" cy="7.5" r="1.2"/><circle cx="7.5" cy="16.5" r="1.2"/><circle cx="16.5" cy="16.5" r="1.2"/><path d="M13.5 6c1.6.8 2.8 2 3.4 3.6" stroke-dasharray="1.6 2"/></symbol>
<symbol id="ic-robot" viewBox="0 0 24 24"><rect x="6" y="8" width="12" height="10" rx="2.5"/><circle cx="10" cy="12.5" r="1.1"/><circle cx="14" cy="12.5" r="1.1"/><path d="M10.5 15.8h3"/><path d="M12 8V5.5M12 5.5a1.2 1.2 0 1 1 .1-2.4"/><path d="M6 12H4M20 12h-2"/></symbol>
<symbol id="ic-books" viewBox="0 0 24 24"><rect x="5" y="15.5" width="14" height="4" rx="1"/><rect x="7" y="10.5" width="12" height="4" rx="1" transform="rotate(-3 13 12.5)"/><rect x="6" y="5.5" width="11" height="4" rx="1" transform="rotate(2 11.5 7.5)"/></symbol>
<symbol id="ic-shuffle" viewBox="0 0 24 24"><path d="M4 7h4l8 10h4M4 17h4l2.5-3.1M13.5 10.1 16 7h4"/><path d="M18 5l2.5 2L18 9M18 15l2.5 2L18 19"/></symbol>
<symbol id="ic-film" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 5v14M16 5v14"/><path d="M4 9h4M4 13h4M4 17h4M16 9h4M16 13h4M16 17h4" stroke-width="1.1"/></symbol>
<symbol id="ic-note" viewBox="0 0 24 24"><circle cx="7" cy="17" r="2.6"/><circle cx="17" cy="15" r="2.6"/><path d="M9.6 17V6.5l9.8-2.1V15"/><path d="M9.6 9.4l9.8-2.1"/></symbol>
<symbol id="ic-mic" viewBox="0 0 24 24"><rect x="9.5" y="3" width="5" height="9" rx="2.5"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0"/><path d="M12 16.5V21M9 21h6"/></symbol>
<symbol id="ic-shop" viewBox="0 0 24 24"><path d="M4 9h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V9z"/><path d="M3 9l2.2-5.2h13.6L21 9"/><path d="M9.5 9v3M14.5 9v3"/></symbol>
<symbol id="ic-plant" viewBox="0 0 24 24"><path d="M12 21v-8"/><path d="M12 13c0-3.3-2.5-5.5-6-5.5 0 3.3 2.5 5.5 6 5.5z"/><path d="M12 13c0-3.9 2.5-6.5 6-6.5 0 3.9-2.5 6.5-6 6.5z"/><path d="M8.5 21h7"/></symbol>
<symbol id="ic-tree" viewBox="0 0 24 24"><path d="M12 21v-6"/><path d="M12 15 7.5 10.5h9L12 15z"/><path d="M12 11 8.5 6.5h7L12 11z"/><path d="M9 21h6"/><path d="M4.5 18.5c1.2-1 2-2.2 2.3-3.6M19.5 18.5c-1.2-1-2-2.2-2.3-3.6" stroke-dasharray="1.6 2"/></symbol>
<symbol id="ic-frame" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="1.5"/><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M4 8h16M4 16h16M8 4v16M16 4v16"/></symbol>
</defs>
</svg>

<header>
  <div class="kicker">Floating Projects Collective · 據點。句點</div>
  <h1>FP <span class="num">5.0</span> 三年活動地圖</h1>
  <p class="sub">A Learning Centre, A Hub for Experiments<br><span class="sub-zh">一個學習中心，實驗集散地 — 由 2026 年秋開始，向 2029 伸展。</span></p>
  <div class="mast-rule"><span>2026 → 2029 · JOCKEY CLUB CREATIVE ARTS CENTRE</span></div>
</header>

<div class="kw-rule"><span>PROGRAMS · 節目地圖</span></div>

<div class="kw-bar">
  <span class="kw-bar-label">FP5.0 關鍵詞</span>
  <div class="kw-chips" id="kw-chips"></div>
</div>

<div class="cat-bar">
  <span class="cat-bar-label">Program 分類</span>
  <div class="cat-chips" id="cat-chips"></div>
</div>

<div class="artist-bar">
  <span class="artist-bar-label">按人物睇節目</span>
  <div class="artist-avs" id="artist-avs"></div>
</div>

<div class="legend">
  <div class="it"><span class="swatch-line"></span><span class="dot solid"></span> 日期已確定，實線釘喺時間軸</div>
  <div class="it"><span class="swatch-dash"></span><span class="dot hollow"></span> 未定日期，虛線大約指向年份</div>
  <div class="it"><span class="pill rec">循環系列</span> 會不斷重複發生</div>
  <div class="it"><span class="pill once">一次性</span> 有頭有尾嘅項目</div>
  <div class="it"><span class="cat-pill cat-clubs">閉門研習｜實作系列</span> Program 分類標籤</div>
</div>

<div class="tl">
  <div class="spine" aria-hidden="true"></div>

  <!-- ====== 2026 ====== -->
  <div class="row tight">
    <div class="year"><span class="badge">2026</span></div>
    <div class="year-note">AUTUMN · FP5.0 開波</div>
  </div>

  <!-- anchored: May Fung -->
  <div class="row">
    <div class="card anchored side-l" data-id="mayfung" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-teacup"/></svg></div>
        <div>
          <div class="date">2026.10.17 · 日期已定</div>
          <h3>May Fung amid Meshes of The Afternoon</h3>
          <div class="short">Fountain Teatime 開幕場 — 馮美華以 Maya Deren 對照自己嘅實驗人生</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">馮</span><span class="av">L</span></div><span class="pill once">茶聚 · 第一場</span></div>
    </div>
    <div class="conn to-l"><span class="wire"></span><span class="pin"></span></div>
  </div>

  <!-- anchored: Halloween Apocalypse, night 1 -->
  <div class="row">
    <div class="conn to-r"><span class="wire"></span><span class="pin"></span></div>
    <div class="card anchored side-r" data-id="halloween1" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-disc"/></svg></div>
        <div>
          <div class="date">2026.10.30（6:30–9:30pm）· 日期已定</div>
          <h3>《活死人黎明 Dawn of the Dead》</h3>
          <div class="short">Halloween Apocalypse 第一晚 — 1978，George A. Romero</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">H</span></div><span class="pill once">放映 · 需登記</span></div>
    </div>
  </div>

  <!-- anchored: Halloween Apocalypse, night 2 -->
  <div class="row">
    <div class="card anchored side-l" data-id="halloween2" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-disc"/></svg></div>
        <div>
          <div class="date">2026.10.31（5:00–6:00pm）· 日期已定</div>
          <h3>《變形邪魔》1956 + 1978 兩版連放</h3>
          <div class="short">Halloween Apocalypse 第二晚 — Don Siegel 同 Philip Kaufman 兩個版本對照</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">H</span></div><span class="pill once">放映 · 需登記</span></div>
    </div>
    <div class="conn to-l"><span class="wire"></span><span class="pin"></span></div>
  </div>

  <!-- anchored: Halloween Apocalypse, night 3 -->
  <div class="row">
    <div class="conn to-r"><span class="wire"></span><span class="pin"></span></div>
    <div class="card anchored side-r" data-id="halloween3" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-disc"/></svg></div>
        <div>
          <div class="date">2026.11.07（5:00–9:00pm）· 日期已定</div>
          <h3>《復製嬌妻 The Stepford Wives》</h3>
          <div class="short">Halloween Apocalypse 第三晚 — 1975，Bryan Forbes</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">H</span></div><span class="pill once">放映 · 需登記</span></div>
    </div>
  </div>

  <!-- anchored: Club-MA Phase 1, session 1 -->
  <div class="row">
    <div class="card anchored side-l" data-id="mediaarch1a" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-cassette"/></svg></div>
        <div>
          <div class="date">2026.11.28（3–6pm）· 日期已定</div>
          <h3>Club-MA · 媒體考古…榕樹下（第一節）</h3>
          <div class="short">講座＋工作坊開課 — 前人嘅欲望點樣催生仲未有名嘅媒體</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">四節之一</span></div>
    </div>
    <div class="conn to-l"><span class="wire"></span><span class="pin"></span></div>
  </div>

  <!-- anchored: Club-MA Phase 1, session 2 -->
  <div class="row">
    <div class="conn to-r"><span class="wire"></span><span class="pin"></span></div>
    <div class="card anchored side-r" data-id="mediaarch1b" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-cassette"/></svg></div>
        <div>
          <div class="date">2026.12.05（3–6pm）· 日期已定</div>
          <h3>Club-MA · 媒體考古…榕樹下（第二節）</h3>
          <div class="short">個案逐個講 — 遠程臨場、永生不朽、光與火、指頭的故事</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">四節之二</span></div>
    </div>
  </div>

  <!-- anchored: Jen Lee teatime -->
  <div class="row">
    <div class="card anchored side-l" data-id="teatime2" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-teacup"/></svg></div>
        <div>
          <div class="date">2026.12.12（3–6pm）· 日期已定</div>
          <h3>More-Than-Human World 茶聚</h3>
          <div class="short">Fountain Teatime 第二場 — Jen Lee 談超越人類世界裡嘅存在、經驗、感知同認知</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">JL</span><span class="av">L</span></div><span class="pill once">茶聚 · 第二場</span></div>
    </div>
    <div class="conn to-l"><span class="wire"></span><span class="pin"></span></div>
  </div>

  <!-- the same lecture series carries on into the new year -->
  <div class="tl-sec"><span class="lab">2027 年初 — 日期已定</span></div>

  <!-- anchored: Club-MA Phase 1, session 3 -->
  <div class="row">
    <div class="conn to-r"><span class="wire"></span><span class="pin"></span></div>
    <div class="card anchored side-r" data-id="mediaarch1c" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-cassette"/></svg></div>
        <div>
          <div class="date">2027.01.30（3–6pm）· 日期已定</div>
          <h3>Club-MA · 媒體考古…榕樹下（第三節）</h3>
          <div class="short">由研究嘅視野行向藝術創作嘅視野</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">四節之三</span></div>
    </div>
  </div>

  <!-- anchored: Club-MA Phase 1, session 4 -->
  <div class="row">
    <div class="card anchored side-l" data-id="mediaarch1d" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-cassette"/></svg></div>
        <div>
          <div class="date">2027.02.06（3–6pm）· 日期已定</div>
          <h3>Club-MA · 媒體考古…榕樹下（第四節）</h3>
          <div class="short">收結一節 — 為 Club-MA Phase 2「除草接枝施肥」鋪路</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">四節之四</span></div>
    </div>
    <div class="conn to-l"><span class="wire"></span><span class="pin"></span></div>
  </div>

  <!-- ====== recurring series, pointing at year 1 ====== -->
  <div class="tl-sec"><span class="lab">循環系列 — 由第一年開始，不斷重複</span></div>

  <div class="row" style="min-height:120px">
    <div class="spanmark" style="top:-6px" aria-hidden="true"></div>
    <div class="card side-l" data-id="teatime" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-teacup"/></svg></div>
        <div>
          <h3>Fountain Teatime 噴泉茶聚</h3>
          <div class="short">請唔同嘉賓嚟講 being / living / doing / survival — 2026–2029 持續</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill rec">雙月 ×1</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="cineclub" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-crt"/></svg></div>
        <div>
          <h3>LaserFrames Cine Club · 雷射視盤</h3>
          <div class="short">Private cine club — 幾部 CRT 電視同步播同一畫面，觀眾散落空間各角</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">H</span></div><span class="pill rec">≈ 兩個月 ×1</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="adminnight" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-laptop"/></svg></div>
        <div>
          <div class="date">2026.10.02–04 · 試局</div>
          <h3>FP Open!「打開門」做吓事務局</h3>
          <div class="short">開放門口一齊做事務：覆 email、寫申請、整檔案，夾雜小型分享</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">A</span></div><span class="pill rec">每月 2–3 日</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="spatial" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-speaker"/></svg></div>
        <div>
          <h3>Spatial Calibration 空間校正</h3>
          <div class="short">聲音表演試煉場 — 俾未夠經驗嘅 sound artist 落場</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">A</span></div><span class="pill rec">≈ 三個月 ×1</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="workshop" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-chip"/></svg></div>
        <div>
          <h3>Device-making 工作坊</h3>
          <div class="short">Device-making 四節系列＋一至兩日 AI 起藝術家個人網站</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">A</span><span class="av">FK</span></div><span class="pill rec">不定期</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="modular" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-knobs"/></svg></div>
        <div>
          <h3>Synth / DAW / Modular 玩聲角</h3>
          <div class="short">唔係活動，係 play room — 上嚟玩聲、錄聲</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">A</span><span class="av">FK</span></div><span class="pill rec">≈ 半年 ×1</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="mediaarch" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-cassette"/></svg></div>
        <div>
          <h3>Club-MA 媒體考古</h3>
          <div class="short">Club Media Archaeology — 三個 phase 加 pop-up 展，由此入</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span><span class="av">H</span></div><span class="pill rec">研究線 · 總覽</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="stc" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-shuffle"/></svg></div>
        <div>
          <h3>Subject to Change</h3>
          <div class="short">由三個字嘅重新排列衍生活動 — 刻意保持流動、未定形</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">HC</span></div><span class="pill rec">流動</span></div>
    </div>
  </div>

  <div class="row" id="rec-end">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="platform" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-shop"/></svg></div>
        <div>
          <h3>FLOATING PLATFORM 據㸃浮台</h3>
          <div class="short">JCCAC L3-06D 嘅寄賣角 — 全期常設</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">W</span></div><span class="pill rec">常設 · 2026–29</span></div>
    </div>
  </div>

  <!-- ====== 2027 ====== -->
  <div class="row tight">
    <div class="year-note l">一次性項目 · 大約落喺呢一年</div>
    <div class="year"><span class="badge">2027</span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="vcd" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-film"/></svg></div>
        <div>
          <h3>More than Found Footage 何止現成影音碎片</h3>
          <div class="short">用 FP 嘅 VCD 收藏創作：徵集 → 比賽 → 放映 → 書寫</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">W</span><span class="av">L</span></div><span class="pill once">一次性項目</span></div>
    </div>
  </div>

  <div class="tl-sec"><span class="lab">FP (Collective) SOLOs · 據點成員個展</span></div>

  <div class="row">
    <div class="card side-l" data-id="solos" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-frame"/></svg></div>
        <div>
          <h3>據點成員個展</h3>
          <div class="short">FP5.0 周期內每位成員嘅個人展覽 — 由此睇三個項目</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">FK</span><span class="av">S</span><span class="av">HG</span></div><span class="pill once">總覽</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="fkinstall" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-motion"/></svg></div>
        <div>
          <h3>動作追蹤聲音裝置</h3>
          <div class="short">Motion gesture tracking 聲音裝置展 — Fuk-kuen 個展</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">FK</span></div><span class="pill once">展期 3–4 週</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="crtwall" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-wall"/></svg></div>
        <div>
          <h3>CRT Wall 盒裝故事</h3>
          <div class="short">流動影像 CRT 牆裝置 — Sing 個展，帶參與式成分</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">S</span></div><span class="pill once">展期 3–4 週</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="mnemonic" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-chip"/></svg></div>
        <div>
          <h3>mnemonic catastrophe</h3>
          <div class="short">Hugo Yeung 個展 — 回應當下機器學習數據文化</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">HG</span></div><span class="pill once">2027 或 2028</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="board" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-board"/></svg></div>
        <div>
          <h3>地形康樂棋</h3>
          <div class="short">自己鬥木整嘅康樂棋 — 有山、草地、障礙物同特別規則</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">S</span><span class="av">FK</span></div><span class="pill once">2027 · 製作＋開玩</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="jazz" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-note"/></svg></div>
        <div>
          <h3>Jazz vs Experimental Sound</h3>
          <div class="short">爵士對實驗聲音・三個演出單元，其中一個做 FP Manual</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">S</span></div><span class="pill once">2027 或 2028</span></div>
    </div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="mediaarch2" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-plant"/></svg></div>
        <div>
          <h3>Club-MA Phase 2 · 除草接枝施肥</h3>
          <div class="short">三節工作坊：影像圖譜、工具發明背後嘅慾望、追溯自己嘅創作係譜</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">3 節 × 3 小時</span></div>
    </div>
  </div>

  <!-- ====== 2028 ====== -->
  <div class="row tight">
    <div class="year"><span class="badge">2028</span></div>
    <div class="year-note">第二至第三年 · 招牌項目回歸</div>
  </div>

  <div class="row">
    <div class="card anchored side-l" data-id="mediaarch3" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-tree"/></svg></div>
        <div>
          <div class="date">2028.03 · 月份已定</div>
          <h3>Club-MA Phase 3 · 奇異叢林（在地展覽）</h3>
          <div class="short">Club-MA 最終 phase — 同 Phase 1、2 學員合作群展</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">群展</span></div>
    </div>
    <div class="conn to-l"><span class="wire"></span><span class="pin"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="ml" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-net"/></svg></div>
        <div>
          <h3>Poetics of ML 學習系統的詩學</h3>
          <div class="short">FP5.0 標誌性總結系列・12 週兩軌課程，配前後公開講座</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">H</span><span class="av">HG</span><span class="av">L</span></div><span class="pill once">2028–29 · 待批款</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="essaying" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-mic"/></svg></div>
        <div>
          <h3>聲影散文探索：講演式表演系列</h3>
          <div class="short">公開徵集 2028.04–06 → 評審 → 2029.03 開門講演式表演</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span></div><span class="pill once">公開徵集</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <div class="row">
    <div class="conn to-r"><span class="wire dash"></span><span class="pin approx"></span></div>
    <div class="card side-r" data-id="toy" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-robot"/></svg></div>
        <div>
          <h3>Toy as Medium #4</h3>
          <div class="short">FP 招牌研究型項目第四輯 — 觀眾可以用手觸碰嘅玩具機器展</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">A</span></div><span class="pill once">展覽</span></div>
    </div>
  </div>

  <div class="row">
    <div class="card side-l" data-id="tsundoku" tabindex="0" role="button">
      <div class="top">
        <div class="icon"><svg><use href="#ic-books"/></svg></div>
        <div>
          <h3>Tsundoku 負載讀取</h3>
          <div class="short">書山堆喺 FP 空間 — 開放周末做裝置同再創造</div>
        </div>
      </div>
      <div class="foot"><div class="pics"><span class="av">L</span><span class="av">FP</span></div><span class="pill once">開放周末</span></div>
    </div>
    <div class="conn to-l"><span class="wire dash"></span><span class="pin approx"></span></div>
  </div>

  <!-- ====== 2029 ====== -->
  <div class="row tight">
    <div class="year minor"><span class="badge">2029</span></div>
    <div class="year-note">三年 line-up 收尾 · 下一個循環</div>
  </div>

</div>

<footer>FLOATING PROJECTS 5.0 · 更新於 2026.09 · 內容按 FP 內部工作紙整理，日期以最新公佈為準</footer>

<!-- ============ modal ============ -->
<div class="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="m-title">
  <div class="modal">
    <button class="x" id="m-close" aria-label="關閉">✕</button>
    <div class="head">
      <div class="icon" id="m-icon"></div>
      <div>
        <h2 id="m-title"></h2>
        <div class="meta" id="m-meta"></div>
      </div>
    </div>
    <div id="m-desc" class="desc"></div>
    <div id="m-club" class="club-desc"></div>
    <div class="cat-of" id="m-cat"></div>
    <div class="kw-of" id="m-kw"></div>
    <div id="m-links" class="person-list"></div>
    <div class="pic-block">
      <div class="lab">PERSON(S) IN CHARGE</div>
      <div id="m-pics"></div>
    </div>
  </div>
</div>

<!-- ============ person modal ============ -->
<div class="overlay" id="p-overlay" role="dialog" aria-modal="true" aria-labelledby="p-title">
  <div class="modal">
    <button class="x" id="p-close" aria-label="關閉">✕</button>
    <div class="head">
      <div class="icon img-icon" id="p-icon"></div>
      <div>
        <h2 id="p-title"></h2>
        <div class="meta" id="p-meta"></div>
      </div>
    </div>
    <div id="p-list" class="person-list"></div>
  </div>
</div>

<!-- ============ category modal ============ -->
<div class="overlay" id="c-overlay" role="dialog" aria-modal="true" aria-labelledby="c-title">
  <div class="modal">
    <button class="x" id="c-close" aria-label="關閉">✕</button>
    <div class="head">
      <div>
        <h2 id="c-title"></h2>
        <div class="meta" id="c-meta"></div>
      </div>
    </div>
    <div class="cat-items">
      <div class="lab">相關節目 <span id="c-count"></span></div>
      <div id="c-list" class="person-list"></div>
    </div>
  </div>
</div>

<!-- ============ keyword modal ============ -->
<div class="overlay" id="k-overlay" role="dialog" aria-modal="true" aria-labelledby="k-title">
  <div class="modal">
    <button class="x" id="k-close" aria-label="關閉">✕</button>
    <div class="head">
      <div class="icon" id="k-icon"></div>
      <div>
        <h2 id="k-title"></h2>
        <div class="meta" id="k-meta"></div>
      </div>
    </div>
    <ul id="k-points" class="kw-points"></ul>
    <div id="k-way" class="kw-way"></div>
    <div id="k-ref" class="kw-ref"></div>
    <div class="kw-items">
      <div class="lab">相關節目 <span id="k-count"></span></div>
      <div id="k-list" class="person-list"></div>
    </div>
  </div>
</div>
</div>
