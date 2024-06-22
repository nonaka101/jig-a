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

const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext === undefined){
	chkEnableSound.parentElement.lastChild.textContent = 'この機器は未対応です'
	chkEnableSound.disabled = true;
} else {
	const audioContext = new AudioContext();

	function beepNG(){
		if (chkEnableSound.checked === false) return;	// フラグ立ってなければ鳴らさない
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
		if (chkEnableSound.checked === false) return;	// フラグ立ってなければ鳴らさない
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

const TYPE_VIBRATE = Object.freeze({
	NONE: 0,
	NORMAL: 1,
	MOZ: 2,
	WEBKIT: 3,
});

function typeVibrate(){
	if(window.navigator.vibrate !== undefined){
		return TYPE_VIBRATE.NORMAL;
	} else if(window.navigator.mozVibrate !== undefined){
		return TYPE_VIBRATE.MOZ;
	} else if(window.navigator.webkitVibrate !== undefined){
		return TYPE_VIBRATE.WEBKIT;
	} else {
		return TYPE_VIBRATE.NONE;
	}
}

if(typeVibrate() === TYPE_VIBRATE.NONE){
	chkEnableVibration.parentElement.lastChild.textContent = 'この機器は振動モード未対応です'
	chkEnableVibration.disabled = true;
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
			})
		}
	}
}

/*
 * 「ダイアログを閉じるボタン」に機能を付与
 *  1. button 要素には `js_btnCloseDialog` クラスが必要
 *  2. button 要素には、操作先 dialog のID名が入った aria-controls 属性が必要
 */
const dialogCloseBtns = document.querySelectorAll('.js_btnCloseDialog');
for (const btn of dialogCloseBtns) {
	const dialogId = btn.getAttribute('aria-controls');
	if(dialogId){
		const targetDialog = document.querySelector(`#${dialogId}`);
		if(targetDialog){
			btn.addEventListener('click', ()=>{
				targetDialog.close();
			})
		}
	}
}
