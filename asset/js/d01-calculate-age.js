/* ≡≡≡ ▀▄ HTML要素郡 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		各種入力ボタンや、出力先のラベルなどを管理する
---------------------------------------------------------------------------- */

const d01DateInput = document.querySelector('#d01js_inputBirthday');	// This value has the required format "yyyy-MM-dd".
// Example : `d01DateInput.value = '2000-01-23';`

const d01Output = document.querySelector('#d01js_output');
const d01CalcBtn = document.querySelector('#d01js_calcBtn');

/* 和暦サブダイアログ */
const d01WarekiName = document.querySelector('#d01js_wareki_name');
const d01WarekiNum = document.querySelector('#d01js_wareki_num');
const d01WarekiBtn = document.querySelector('#d01js_wareki_submit');










/* ≡≡≡ ▀▄ 機能関連 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		「計算」ボタンの活性/非活性操作（処理に必要な有効な日付が用意されているか）
---------------------------------------------------------------------------- */

function d01EnableCalcBtn(){
	if(isDateFormat(d01DateInput.value)){
		d01CalcBtn.disabled = false;
	} else {
		d01CalcBtn.disabled = true;
	}
}

// 初回起動した後、input要素に紐づけ
d01EnableCalcBtn();
d01DateInput.addEventListener('input', d01EnableCalcBtn);











/* ≡≡≡ ▀▄ 和暦入力 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		サブダイアログ上に入力された数値をチェックし、和暦情報を西暦にした上でインプットへ入力
---------------------------------------------------------------------------- */

d01WarekiBtn.addEventListener('click', ()=> {
	// エラーラベルの生成
	const label = document.querySelector(`label[for="${d01WarekiNum.id}"]`);
	const paragraph = label.querySelector('p') || label.appendChild(document.createElement('p'));
	paragraph.tabIndex = -1;
	paragraph.innerHTML = null;

	const warekiID = parseInt(d01WarekiName.value);
	const warekiString = d01WarekiNum.value;

	// 年月日文字列のチェック（eeMMdd：和暦2桁 + 月2桁 + 日2桁）
	if(warekiString.match(/^([0-9]{2})(0[1-9]|1[0-2])([0-2][0-9]|3[01])$/)){
		const warekiYear = parseInt(warekiString.substring(0, 2));
		const year = wareki.getYearByEra(warekiID, warekiYear);
		const dateString = `${year}-${warekiString.substring(2, 4)}-${warekiString.substring(4)}`;

		// 適正な日付形式かをチェック
		if(isDateFormat(dateString) === false) throw new Error('和暦→西暦日付への変換に失敗しました');

		// 入力ボックスに結果を入れ、ダイアログを閉じる
		d01DateInput.value = dateString;
		closeDialog(d01WarekiBtn);

		// 後処理: 結果を格納したボックスにフォーカス（スクリーンリーダー用）し、ボタンの活性状態を更新
		d01DateInput.focus();
		d01EnableCalcBtn();
	} else {
		// バリデーションエラーをユーザーに通知
		const spanEmoji = document.createElement('span');
		spanEmoji.textContent = '⚠';
		spanEmoji.ariaHidden = true;
		spanEmoji.className = 'hp_warningColor';
		paragraph.appendChild(spanEmoji);
		const spanText = document.createElement('span');
		spanText.textContent = '入力値は6桁の年月日文字列でなければなりません';
		spanText.className = 'hp_warningColor';
		paragraph.appendChild(spanText);
		paragraph.focus();
	}
});










/* ≡≡≡ ▀▄ 年齢等計算 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		満年齢と経過日数を計算し、テーブル要素として出力
---------------------------------------------------------------------------- */

d01CalcBtn.addEventListener('click', ()=> {
	const dateString = d01DateInput.value;
	if(isDateFormat(dateString) === false) throw new Error('入力値が適正でありません');
	const dateParts = dateString.split('-');
	const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));

	// 年齢算出
	const age = calcAge(date);

	// 現年齢の加齢タイミング（≒誕生日前日24時）
	const timeAgingInThisYear = new Date(
		date.getFullYear() + age,
		date.getMonth(),
		date.getDate() - 1,
		24
	);

	// 経過日数を算出
	const days = dateDiff(timeAgingInThisYear, new Date());

	// 計算結果を配列にまとめて、テーブルとして出力
	let dataArray = [['項目', '値']];
	const today = new Date();
	dataArray.push(['今日', `${today.getFullYear()}年 ${today.getMonth() + 1}月 ${today.getDate()}日`]);
	dataArray.push(['満年齢', `${age}歳`]);
	dataArray.push(['日数', `${days}日`]);
	d01Output.value = '';
	d01Output.appendChild(createTable(dataArray, TABLE_STYLE.cross));
});
