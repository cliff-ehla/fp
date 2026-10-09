import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '$lib/firebase.js';
import { FP5_SEED } from '$lib/fp5-seed.js';

export const FP5_COLLECTION = 'fp5_events';

// Keep in sync with isAdmin() in firestore.rules and storage.rules.
export const ADMIN_EMAILS = [
	'andiolai@gmail.com',
	'contact@studioleung.com',
	'fukkuen.work@gmail.com',
	'hatch.mm@gmail.com',
	'hugoymh@gmail.com',
	'johnchow0829@gmail.com',
	'kinlam8@gmail.com',
	'kmcheng212@gmail.com',
	'knellmc@yahoo.com.hk',
	'lailindach@gmail.com',
	'lauhoc@gmail.com',
	'lisankitandy@gmail.com',
	'ngsing519@gmail.com',
	'sinyichoi89@gmail.com',
	'smhect@cityu.edu.hk',
	'smllai@cityu.edu.hk',
	'waileunglai2014@gmail.com',
	'winsome.wd@gmail.com',
	'wongchunhoi9@gmail.com',
	'yanwywinnie@gmail.com'
];

export function isAdminEmail(email) {
	return !!email && ADMIN_EMAILS.includes(String(email).toLowerCase());
}

/** Firebase email/password account that the access-token login uses. */
export const TOKEN_LOGIN_EMAIL = 'smllai@cityu.edu.hk';

/** Card face copy shown on the timeline (date line + short blurb). */
export const FP5_FACE = {
	mayfung: { date: '2026.10.17 · 日期已定', short: 'Fountain Teatime 開幕場 — 馮美華以 Maya Deren 對照自己嘅實驗人生' },
	halloween1: { date: '2026.10.30（6:30–9:30pm）· 日期已定', short: 'Halloween Apocalypse 第一晚 — 1978，George A. Romero' },
	halloween2: { date: '2026.10.31（5:00–9:00pm）· 日期已定', short: 'Halloween Apocalypse 第二晚 — Don Siegel 同 Philip Kaufman 兩個版本對照' },
	halloween3: { date: '2026.11.07（5:00–9:00pm）· 日期已定', short: 'Halloween Apocalypse 第三晚 — 1975，Bryan Forbes' },
	mediaarch1a: { date: '2026.11.21（3–6pm）· 日期已定', short: '講座＋工作坊開課 — 前人嘅欲望點樣催生仲未有名嘅媒體' },
	mediaarch1b: { date: '2026.11.28（3–6pm）· 日期已定', short: '個案逐個講 — 遠程臨場、永生不朽、光與火、指頭的故事' },
	widescreen: { date: '2026.12.05（3:00–5:30pm）· 日期已定', short: 'Hector · 寬銀幕電影與畫框的性質 — soft matte / open matte' },
	teatime2: { date: '2026.12.12（3–6pm）· 日期已定', short: 'Fountain Teatime 第二場 — Jen Lee 談超越人類世界裡嘅存在、經驗、感知同認知' },
	xmasghost: { date: '2026.12.26（5:00–9:00pm）· 日期已定', short: '公開場 OPEN TO ALL — John Hough 1973 gothic horror' },
	mediaarch1c: { date: '2027.01.30（3–6pm）· 日期已定', short: '由研究嘅視野行向藝術創作嘅視野' },
	mediaarch1d: { date: '2027.02.06（3–6pm）· 日期已定', short: '收結一節 — 為 Club-MA Phase 2「除草接枝施肥」鋪路' },
	teatime: { date: '', short: '請唔同嘉賓嚟講 being / living / doing / survival — 2026–2029 持續' },
	cineclub: { date: '', short: 'Private cine club — 幾部 CRT 電視同步播同一畫面，觀眾散落空間各角' },
	adminnight: { date: '2026.10.02–04 · 試局', short: '開放門口一齊做事務：覆 email、寫申請、整檔案，夾雜小型分享' },
	spatial: { date: '', short: '聲音表演試煉場 — 俾未夠經驗嘅 sound artist 落場' },
	workshop: { date: '', short: 'Device-making 四節系列＋一至兩日 AI 起藝術家個人網站' },
	modular: { date: '', short: '唔係活動，係 play room — 上嚟玩聲、錄聲' },
	mediaarch: { date: '', short: 'Club Media Archaeology — 三個 phase 加 pop-up 展，由此入' },
	stc: { date: '', short: '由三個字嘅重新排列衍生活動 — 刻意保持流動、未定形' },
	platform: { date: '', short: 'JCCAC L3-06D 嘅寄賣角 — 全期常設' },
	halloween2027: { date: '2027.10.30–31（Sat–Sun）· 待確認', short: 'LaserFrames 第二年萬聖放映 — 片單待確認' },
	vcd: { date: '', short: '用 FP 嘅 VCD 收藏創作：徵集 → 比賽 → 放映 → 書寫' },
	fkinstall: { date: '', short: 'Motion gesture tracking 聲音裝置展 — Fuk-kuen 個展' },
	crtwall: { date: '', short: '流動影像 CRT 牆裝置 — Sing 個展，帶參與式成分' },
	mnemonic: { date: '', short: 'Hugo Yeung 個展 — 回應當下機器學習數據文化' },
	board: { date: '', short: '自己鬥木整嘅康樂棋 — 有山、草地、障礙物同特別規則' },
	jazz: { date: '', short: '爵士對實驗聲音・三個演出單元，其中一個做 FP Manual' },
	mediaarch2: { date: '', short: '三節工作坊：影像圖譜、工具發明背後嘅慾望、追溯自己嘅創作係譜' },
	mediaarch3: { date: '2028.03 · 月份已定', short: '在地爆發展覽 — 把 Club-MA 1–2 所獲化為展出' },
	ml: { date: '', short: 'FP5.0 標誌性總結系列・12 週兩軌課程，配前後公開講座' },
	essaying: { date: '', short: '公開徵集 2028.04–06 → 評審 → 2029.03 開門講演式表演' },
	toy: { date: '', short: 'FP 招牌研究型項目第四輯 — 觀眾可以用手觸碰嘅玩具機器展' },
	tsundoku: { date: '2029.04 · 待確認', short: '書山堆喺 FP 空間 — 開放周末做裝置同再創造' }
};

export const FP5_PEOPLE = [
	{ id: 'L', name: 'Linda Chiu-han Lai 黎肖嫻' },
	{ id: 'H', name: 'Hector Rodriguez' },
	{ id: 'A', name: 'LAI Chung-man Andio 黎仲民' },
	{ id: 'FK', name: 'WONG Fuk-kuen 黃福權' },
	{ id: 'W', name: 'LAI Wai-leung 黎偉亮' },
	{ id: 'S', name: 'NG Sing-yiu Stanley 伍昇耀' },
	{ id: 'HC', name: 'LAU Ho-chi 劉浩知' },
	{ id: 'HG', name: 'Hugo Yeung 楊鳴謙' },
	{ id: 'MF', name: 'May Fung 馮美華' },
	{ id: 'JL', name: 'Jen Lee' },
	{ id: 'FP', name: 'FP 集體' }
];

export const FP5_CATEGORIES = [
	{ id: 'opendoor', en: 'Regular Open Door', zh: '定期打開門' },
	{ id: 'clubs', en: 'Clubs & Series', zh: '閉門研習｜實作系列' },
	{ id: 'opencall', en: 'OPEN CALL', zh: '公開徵集' },
	{ id: 'playroom', en: 'PLAY ROOM + Artefact Corner', zh: '玩樂場' },
	{ id: 'solos', en: 'FP (Collective) SOLOs', zh: '據點成員個展' },
	{ id: 'accumulation', en: 'Accumulation', zh: '集少成多' }
];

export const FP5_CLUBS = [
	{ id: 'laserframes', en: 'LaserFrames Cine Club', zh: '雷射視盤' },
	{ id: 'clubma', en: 'Club-MA', zh: '媒體考古' }
];

export const FP5_CAT_OF = {
	adminnight: 'opendoor',
	mayfung: 'clubs',
	halloween1: 'clubs',
	halloween2: 'clubs',
	halloween3: 'clubs',
	widescreen: 'clubs',
	xmasghost: 'clubs',
	halloween2027: 'clubs',
	teatime: 'clubs',
	teatime2: 'clubs',
	cineclub: 'clubs',
	spatial: 'clubs',
	workshop: 'clubs',
	mediaarch: 'clubs',
	mediaarch1a: 'clubs',
	mediaarch1b: 'clubs',
	mediaarch1c: 'clubs',
	mediaarch1d: 'clubs',
	mediaarch2: 'clubs',
	mediaarch3: 'clubs',
	stc: 'clubs',
	ml: 'clubs',
	jazz: 'clubs',
	toy: 'clubs',
	modular: 'playroom',
	board: 'playroom',
	vcd: 'opencall',
	essaying: 'opencall',
	fkinstall: 'solos',
	crtwall: 'solos',
	mnemonic: 'solos',
	platform: 'accumulation',
	tsundoku: 'accumulation'
};

export const FP5_CLUB_OF = {
	halloween1: 'laserframes',
	halloween2: 'laserframes',
	halloween3: 'laserframes',
	widescreen: 'laserframes',
	xmasghost: 'laserframes',
	halloween2027: 'laserframes',
	cineclub: 'laserframes',
	mediaarch: 'clubma',
	mediaarch1a: 'clubma',
	mediaarch1b: 'clubma',
	mediaarch1c: 'clubma',
	mediaarch1d: 'clubma',
	mediaarch2: 'clubma',
	mediaarch3: 'clubma'
};

export const FP5_KEYWORDS = [
	{ id: 'commoning', zh: '共有實踐', en: 'Commoning' },
	{ id: 'coindiv', zh: '共同個體化', en: 'Co-individuation' },
	{ id: 'contrib', zh: '貢獻經濟', en: 'Contributive Economics' },
	{ id: 'reactivate', zh: '資源活化', en: 'Reactivation' },
	{ id: 'archaeology', zh: '媒體考古', en: 'Media Archaeology' },
	{ id: 'datacult', zh: '數據文化', en: 'Data Culture' }
];

export const FP5_KW_OF = {
	mayfung: ['commoning', 'reactivate'],
	halloween1: ['archaeology', 'reactivate', 'contrib'],
	halloween2: ['archaeology', 'reactivate', 'contrib'],
	halloween3: ['archaeology', 'reactivate', 'contrib'],
	widescreen: ['archaeology', 'reactivate'],
	xmasghost: ['archaeology', 'reactivate', 'contrib'],
	halloween2027: ['archaeology', 'reactivate', 'contrib'],
	teatime: ['commoning', 'coindiv'],
	teatime2: ['commoning'],
	cineclub: ['archaeology', 'reactivate', 'contrib'],
	adminnight: ['commoning', 'contrib'],
	spatial: ['commoning', 'coindiv'],
	workshop: ['commoning', 'reactivate'],
	modular: ['commoning', 'contrib'],
	mediaarch: ['archaeology', 'reactivate'],
	mediaarch1a: ['archaeology'],
	mediaarch1b: ['archaeology'],
	mediaarch1c: ['archaeology'],
	mediaarch1d: ['archaeology'],
	mediaarch2: ['archaeology', 'coindiv'],
	mediaarch3: ['archaeology', 'coindiv'],
	stc: ['coindiv'],
	ml: ['datacult', 'reactivate'],
	vcd: ['archaeology', 'reactivate'],
	fkinstall: ['datacult'],
	crtwall: ['archaeology', 'reactivate'],
	board: ['coindiv', 'commoning'],
	toy: ['archaeology', 'reactivate'],
	jazz: ['coindiv', 'commoning'],
	mnemonic: ['datacult'],
	essaying: ['commoning', 'coindiv'],
	platform: ['contrib', 'reactivate', 'archaeology'],
	tsundoku: ['commoning', 'coindiv', 'reactivate']
};

export const FP5_IDS = Object.keys(FP5_SEED);

export function cloneFp5Seed() {
	const data = JSON.parse(JSON.stringify(FP5_SEED));
	for (const id of Object.keys(data)) {
		const face = FP5_FACE[id] || {};
		data[id].date = face.date || '';
		data[id].short = face.short || '';
		data[id].pics = Array.isArray(data[id].pics) ? data[id].pics.slice() : [];
		data[id].category = FP5_CAT_OF[id] || '';
		data[id].club = FP5_CLUB_OF[id] || '';
		data[id].keywords = (FP5_KW_OF[id] || []).slice();
	}
	return data;
}

export function descToText(desc) {
	if (Array.isArray(desc)) return desc.join('\n\n');
	return desc || '';
}

export function textToDesc(text) {
	const parts = (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
	if (parts.length <= 1) return parts[0] || '';
	return parts;
}

export function editableFields(card) {
	return {
		title: card.title || '',
		meta: card.meta || '',
		date: card.date || '',
		short: card.short || '',
		desc: descToText(card.desc),
		pics: Array.isArray(card.pics) ? card.pics.slice() : [],
		category: card.category || '',
		club: card.club || '',
		keywords: Array.isArray(card.keywords) ? card.keywords.slice() : []
	};
}

function asStringArray(value) {
	if (!Array.isArray(value)) return null;
	return value.map((v) => String(v)).filter(Boolean);
}

export function applyFp5Override(base, remote) {
	if (!remote) return base;
	const next = { ...base };
	if (typeof remote.title === 'string') next.title = remote.title;
	if (typeof remote.meta === 'string') next.meta = remote.meta;
	if (typeof remote.date === 'string') next.date = remote.date;
	if (typeof remote.short === 'string') next.short = remote.short;
	if (remote.desc !== undefined) next.desc = remote.desc;
	const pics = asStringArray(remote.pics);
	if (pics) next.pics = pics;
	if (typeof remote.category === 'string') next.category = remote.category;
	if (typeof remote.club === 'string') next.club = remote.club;
	const keywords = asStringArray(remote.keywords);
	if (keywords) next.keywords = keywords;
	return next;
}

export function fp5WritePayload(fields) {
	return {
		title: fields.title || '',
		meta: fields.meta || '',
		date: fields.date || '',
		short: fields.short || '',
		desc: fields.desc !== undefined && typeof fields.desc !== 'string' ? fields.desc : textToDesc(fields.desc),
		pics: Array.isArray(fields.pics) ? fields.pics.filter(Boolean) : [],
		category: fields.category || '',
		club: fields.club || '',
		keywords: Array.isArray(fields.keywords) ? fields.keywords.filter(Boolean) : [],
		updatedAt: serverTimestamp()
	};
}

export async function fetchFp5Events() {
	const snap = await getDocs(collection(db, FP5_COLLECTION));
	const out = {};
	snap.forEach((d) => {
		out[d.id] = d.data();
	});
	return out;
}

export function mergeFp5Data(seed, remote) {
	const data = seed;
	for (const id of Object.keys(data)) {
		if (remote[id]) data[id] = applyFp5Override(data[id], remote[id]);
	}
	return data;
}

export async function fetchFp5Event(id) {
	const snap = await getDoc(doc(db, FP5_COLLECTION, id));
	return snap.exists() ? snap.data() : null;
}

export async function saveFp5Event(id, fields) {
	await setDoc(doc(db, FP5_COLLECTION, id), fp5WritePayload(fields), { merge: true });
}

export async function seedFp5EventsIfEmpty() {
	const existing = await fetchFp5Events();
	const seed = cloneFp5Seed();
	const missing = FP5_IDS.filter((id) => !existing[id]);
	if (!missing.length) return { seeded: 0, total: FP5_IDS.length };
	const batch = writeBatch(db);
	for (const id of missing) {
		const card = seed[id];
		batch.set(doc(db, FP5_COLLECTION, id), fp5WritePayload({
			title: card.title || '',
			meta: card.meta || '',
			date: card.date || '',
			short: card.short || '',
			desc: card.desc,
			pics: card.pics,
			category: card.category,
			club: card.club,
			keywords: card.keywords
		}));
	}
	await batch.commit();
	return { seeded: missing.length, total: FP5_IDS.length };
}
