/* ≡≡≡ ▀▄ 関数 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		全体で共有できる関数集
---------------------------------------------------------------------------- */

/**
 * HTML文を含む文字列を、エンティティに変換する
 *
 * @param {string} str - HTML文を含む文字列
 */
function sanitizeHtml(str) {
	if(typeof str === 'string'){
		const htmlEntities = str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#x27;")
			.replace(/\//g, "&#x2F;");
		return htmlEntities;
	}
}










// Templateタグが、ブラウザ対応しているか
const isEnabledTemplate = !!("content" in document.createElement("template"));

/**
 * Template要素を指定した要素に挿入する
 *
 * @param {Element} templateElement - Template要素
 * @param {Element} outputElement - 出力先となる要素
 * @param {boolean} isFirst - 最初の子要素として挿入（初期値True）
 */
function insertTemplate(templateElement, outputElement, isFirst=true) {
	if (isEnabledTemplate) {
		const tempContent = templateElement.content.cloneNode(true);

		// isFirstが有効かつ出力先に子要素がある場合に、最前方に挿入を試みる
		if(isFirst && outputElement.firstChild) {
			outputElement.insertBefore(tempContent, outputElement.firstChild);
		} else {
			outputElement.appendChild(tempContent);
		}
	} else {
		// Template タグが非対応
		console.error('template タグが未対応です');
		/* TODO: Templateが使えない場合の代替処理（急ぎではない）
		 * 現在の利用は 子要素全てを使うのでなく、SVGなどの単体要素を想定している。
		 * よって、ラベル要素のような重要なものはテンプレート化からは外している。
		 * そのため非対応でもラベルがなくなったり、子要素がなくなり操作不能になるといった、
		 * 致命的な状況にはならないと考えている。
		 */
	}
}










/**
 * テーブルスタイルを enum 風に管理
 */
const TABLE_STYLE = Object.freeze({
	none: 0,							// ベース
	horizontal: 1,				// 水平（行方向に重きを置く表）
	vertical: 2,					// 垂直（列方向に重きを置く表）
	cross: 3,							// クロス（行列組み合わせた表）
	noneWide: 4,					// ベース＋ワイド（列数が多めで、横方向へスクロールするスタイルの幅が広め）
	horizontalWide: 5,
	verticalWide: 6,
	crossWide: 7,
	noneWideEx: 8,				// ベース＋EXワイド（列数が更に多く、ワイドよりも更に広め）
	horizontalWideEx: 9,
	verticalWideEx: 10,
	crossWideEx: 11,
});

/**
 * 2次元配列をテーブルに変換し、div.bl_table でラップした要素を返す
 *
 * @param {[any]} dataArray - 表となる2次元配列
 * @param {number} tableStyle - TABLE_STYLEで規定したスタイル値（初期値 0:none）
 */
function createTable(dataArray, tableStyle=0) {
	const styleWidth = Math.floor(tableStyle / 4);
	const styleDirection = tableStyle % 4;

	// テーブルのラップ要素 div の生成
	const tableWrapper = document.createElement('div');
	let classes = ['bl_table'];
	switch (styleDirection) {
		case 0:
			break;
		case 1:
			classes.push('bl_table__horizontal');
			break;
		case 2:
			classes.push('bl_table__vertical');
			break;
		case 3:
			classes.push('bl_table__cross');
			break;
	}
	switch (styleWidth) {
		case 0:
			break;
		case 1:
			classes.push('bl_table__wide');
			break;
		case 2:
			classes.push('bl_table__exWide');
			break;
	}
	tableWrapper.classList.add(...classes);

  const table = document.createElement('table');
  tableWrapper.appendChild(table);


  // ヘッダー部を作成
  const tableHeaderRow = table.createTHead().insertRow();
	const arrayHeader = dataArray.shift();
	let isFirstCell = true;	// クロス表の表側頭で scope をつけないためのもの
	for(const cell of arrayHeader){
		const th = document.createElement('th');
		th.textContent = cell;

		// 表形式が 垂直 または クロスかつ表側頭セル以外の場合、スコープ付与
		if((styleDirection === 2) || (styleDirection === 3 && isFirstCell === false)) {
			th.scope = 'col';
		}
		tableHeaderRow.appendChild(th);
		isFirstCell = false;
	}

  // ボディ部を作成
	const tableBody = table.createTBody();
  for (const arrayRow of dataArray) {
		const row = tableBody.insertRow();

		// 初回のみ th 要素
		const thCell = arrayRow.shift();
		const th = document.createElement('th');
		th.textContent = thCell;
		if(styleDirection === 1 || styleDirection === 3) {
			th.scope = 'row';
		}
		row.appendChild(th);

		// 2列目以降は td 要素
		for(const tdCell of arrayRow){
			const cell = row.insertCell();
			cell.textContent = tdCell;
		}
  }

  // テーブル要素を格納した div.bl_table 要素を返す
	return tableWrapper;
}









const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

function beepNG(){
	// 未対応または機能にチェックしてなければ、鳴らさない
	if ((chkEnableSound.checked === false)||(isEnabledSound === false)) return;

	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();

	// oscillatorをgainに接続する
	oscillator.connect(gain);

	// gainをaudioContextの出力に接続する
	gain.connect(audioContext.destination);

	oscillator.type = 'square';
	oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
	oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
	gain.gain.setValueAtTime(1, audioContext.currentTime);

	// ビープ音の開始
	oscillator.start(audioContext.currentTime);

	// ビープ音の停止
	setTimeout(() => {
		oscillator.stop(audioContext.currentTime);
	}, 200);
}

function beepOK(){
	// 未対応または機能にチェックしてなければ、鳴らさない
	if ((chkEnableSound.checked === false)||(isEnabledSound === false)) return;

	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();

	// oscillatorをgainに接続する
	oscillator.connect(gain);

	// gainをaudioContextの出力に接続する
	gain.connect(audioContext.destination);

	oscillator.type = 'square';
	oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
	gain.gain.setValueAtTime(1, audioContext.currentTime);

	// ビープ音の開始
	oscillator.start(audioContext.currentTime);

	// ビープ音の停止
	setTimeout(() => {
		oscillator.stop(audioContext.currentTime);
	}, 50);
}









function vibrateOK(){
	// 未対応または機能にチェックしてなければ、鳴らさない
	if ((chkEnableVibration.checked === false)||(isEnabledVibrate === false)) return;

	if(window.navigator.vibrate){
		window.navigator.vibrate(50);
	}else if(window.navigator.mozVibrate){
		window.navigator.mozVibrate(50);
	}else if(window.navigator.webkitVibrate){
		window.navigator.webkitVibrate(50);
	}else{
		console.error('エラー：振動機能');
	}
}

function vibrateNG(){
	// 未対応または機能にチェックしてなければ、鳴らさない
	if ((chkEnableVibration.checked === false)||(isEnabledVibrate === false)) return;

	const pattern = [100, 100, 100];
	if(window.navigator.vibrate){
		window.navigator.vibrate(pattern);
	}else if(window.navigator.mozVibrate){
		window.navigator.mozVibrate(pattern);
	}else if(window.navigator.webkitVibrate){
		window.navigator.webkitVibrate(pattern);
	}else{
		console.error('エラー：振動機能');
	}
}




/**
 * 振動・音によるフィードバック
 */
function feedbackOK(){
	beepOK();
	vibrateOK();
}

/**
 * 振動・音によるフィードバック
 */
function feedbackNG(){
	beepNG();
	vibrateNG();
}









/* ≡≡≡ ▀▄ 共通設定 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		全体に共通する機能の設定値を、セッションストレージで保管する。各設定値は、下記とする。
		1. colorMode -> [0:default, 1:light, 2:dark]
		2. fontSize -> [0:default, 10〜32:該当のpx値]
		3. isLeft -> [false:右, true:左]
		4. enableSound -> [false:off, true:on]
		5. enableVibration -> [false:off, true:on]
---------------------------------------------------------------------------- */

/**
 * セッション中に維持保存される、カラーモード設定情報
 *
 * @param {boolean} isShow - 機能が有効化されているか
 * @param {boolean} isDark - ダークモード設定か
 */
let settingState;
if (sessionStorage.getItem('settingState')){
	settingState = sessionStorage.getItem('settingState');
	settingState = JSON.parse(settingState);
} else {
	settingState = {
		colorMode: 0,
		fontSize: 0,
		isLeft: false,
		enableSound: false,
		enableVibration: false,
	}
}








/**
 * カラーモード機能の手動切り替え
 *
 * bodyへのクラス付与とCSSによって、カラーモードを手動操作
 *
 * @param {string} colorMode - [0:defalut, 1:light, 2:dark]
 */
function changeColorMode(colorMode) {
	switch (parseInt(colorMode)) {
		case 0:
			document.documentElement.classList.remove("is_darkMode");
			document.documentElement.classList.remove("is_lightMode");
			break;
		case 1:
			document.documentElement.classList.remove("is_darkMode");
			document.documentElement.classList.add("is_lightMode");
			break;
		case 2:
			document.documentElement.classList.remove("is_lightMode");
			document.documentElement.classList.add("is_darkMode");
			break;
		default:
			console.log(`不明な設定値が検出されました [colorMode : ${colorMode}]`);
	}
}

const selColorMode = document.querySelector('#js_setting_colorMode');
selColorMode.addEventListener("change", (e) => {
	const val = e.target.value;
	changeColorMode(val);
	settingState.colorMode = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
selColorMode.value = settingState.colorMode;
changeColorMode(settingState.colorMode);





/**
 * フォントサイズの手動切り替え
 *
 * bodyへのスタイル付与によって、フォントサイズを手動操作
 *
 * @param {string} fontSize - 0でdefalut、それ以外の数値は対応するpx値とする
 */
function changeFontSize(fontSize) {
	let size = parseInt(fontSize);
	if (size === 0) {
		document.documentElement.style.fontSize = null;
	} else {
		if (typeof size === "number"){
			document.documentElement.style.fontSize = size + 'px';
		} else {
			console.log(`不明な設定値が検出されました [fontSize : ${fontSize}]`);
		}
	}
}

const selFontSize = document.querySelector('#js_setting_fontSize');
selFontSize.addEventListener("change", (e) => {
	const val = e.target.value;
	changeFontSize(val);
	settingState.fontSize = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
selFontSize.value = settingState.fontSize;
changeFontSize(settingState.fontSize);





/**
 * 左利きモードへの切り替え
 *
 * bodyへのクラス付与によって、左利き用のスタイルに変更
 *
 * @param {boolean} isLeft - true で左利きモード
 */
function changeLeftMode(isLeft) {
	if (isLeft) {
		document.documentElement.classList.add("is_leftMode");
	} else {
		document.documentElement.classList.remove("is_leftMode");
	}
}

const chkIsLeft = document.querySelector('#js_setting_isLeft');
chkIsLeft.addEventListener("change", (e) => {
	const val = e.target.checked;
	changeLeftMode(val);
	settingState.isLeft = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
chkIsLeft.checked = settingState.isLeft;
changeLeftMode(settingState.isLeft);





/**
 * サウンドモードへの切り替え
 *
 * bodyへのクラス付与によって、音有りのスタイルに変更（暫定）
 *
 * @param {boolean} enableSound - true で音有りモード
 */
function changeSoundMode(enableSound) {
	if (enableSound) {
		document.documentElement.classList.add("is_soundMode");
	} else {
		document.documentElement.classList.remove("is_soundMode");
	}
}

const chkEnableSound = document.querySelector('#js_setting_enableSound');
chkEnableSound.addEventListener("change", (e) => {
	const val = e.target.checked;
	changeSoundMode(val);
	settingState.enableSound = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
chkEnableSound.checked = settingState.enableSound;
changeSoundMode(settingState.enableSound);

// 振動機能
var isEnabledSound = false;
if((window.AudioContext || window.webkitAudioContext) === undefined) {
	// AudioContext による ビープ生成 未対応
	chkEnableSound.parentElement.lastChild.textContent = 'この機器は未対応です'
	chkEnableSound.disabled = true;
} else {
	isEnabledSound = true;
}





/**
 * 振動モードへの切り替え
 *
 * bodyへのクラス付与によって、振動有りのスタイルに変更（暫定）
 *
 * @param {boolean} enableVibration - true で振動有りモード
 */
function changeVibrationMode(enableVibration) {
	if (enableVibration) {
		document.documentElement.classList.add("is_vibrationMode");
	} else {
		document.documentElement.classList.remove("is_vibrationMode");
	}
}

const chkEnableVibration = document.querySelector('#js_setting_enableVibration');
chkEnableVibration.addEventListener("change", (e) => {
	const val = e.target.checked;
	changeVibrationMode(val);
	settingState.enableVibration = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
chkEnableVibration.checked = settingState.enableVibration;
changeVibrationMode(settingState.enableVibration);


// 振動機能
var isEnabledVibrate = false;
if((window.navigator.vibrate || window.navigator.mozVibrate || window.navigator.webkitVibrate) === undefined) {
	// 振動モード未対応
	chkEnableVibration.parentElement.lastChild.textContent = 'この機器は振動モード未対応です'
	chkEnableVibration.disabled = true;
} else {
	isEnabledVibrate = true;
}






/*
 * 「ダイアログを開くボタン」に機能を付与
 *  1. button 要素には `js_btnDialog` クラスが必要
 *  2. button 要素には、操作先 dialog のID名が入った aria-controls 属性が必要
 */
const dialogBtns = document.querySelectorAll('.js_btnShowDialog');
for (const btn of dialogBtns) {
	const dialogId = btn.getAttribute('aria-controls');
	if(dialogId){
		const targetDialog = document.querySelector(`#${dialogId}`);
		if(targetDialog){
			btn.addEventListener('click', ()=>{
				targetDialog.showModal();
			});
			targetDialog.addEventListener('click', (e) => {
				if(e.target === targetDialog){
					targetDialog.close();
				}
			});
		}
	}
}

/**
 * 要素の、直近の親となるダイアログを閉じる
 *
 * @param {Element} ele - ダイアログ内にある要素
 */
function closeDialog(ele) {
	if(!(ele instanceof Element)) throw new Error('引数に Element が必要です');
	ele.closest('dialog').close();
	// Memo : HTML要素に `onclick="closeDialog(this)"` と記述すれば、直接利用が可能
}

// 「ダイアログを閉じるボタン」に機能を付与（ button 要素に `js_btnCloseDialog` クラスが必要）
const tempSvgCross = document.querySelector('#tempSvg_cross');
const dialogCloseBtns = document.querySelectorAll('.js_btnCloseDialog');
for (const btn of dialogCloseBtns) {
	// SVG「✕」を挿入
	insertTemplate(tempSvgCross, btn, true);

	// 対象ダイアログ（≒ 直近の親 dialog）と結びつけ、閉じる機能を実装
	btn.addEventListener('click', ()=>{
		closeDialog(btn);
	});
}











/* ≡≡≡ ▀▄ Template処理 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		テンプレート化した要素（SVGなど多様するもの）を、insertTemplate() を使って処理
	■ 内容
		1. bl_accordion_summary : arrowDown を要素後方に
---------------------------------------------------------------------------- */

const tempSvgArrowDown = document.querySelector('#tempSvg_arrowDown');
const accordionSummaries = document.querySelectorAll('.bl_accordion_summary');
for (const summary of accordionSummaries) {
	insertTemplate(tempSvgArrowDown, summary, false);
}
