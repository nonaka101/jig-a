// textarea
const c01_textArea = document.querySelector('#c01js_inputArea');

// paste from clipboard
const c01_btnPasteFromClipboard = document.querySelector('#c01js_pasteFromClipboard');
c01_btnPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
  .readText()
  .then((clipText) => {
		/* innerText と value の扱いは違う（InnerTextだと、改行コードが <br> に変換された状態に？）
		console.log(clipText.search(/\n/msu));
		*/
		c01_textArea.value = '';
		c01_textArea.value = clipText;
		feedbackOK();
	})
	.catch(e => {
		console.error(e);
		feedbackNG();
	});
})

// calculate text count
const c01_output = document.querySelector('#c01js_output');
const c01_btnCalc = document.querySelector('#c01js_countBtn');
c01_btnCalc.addEventListener('click', ()=>{
	// 準備（既存のテーブルを消す）
	c01_output.value = '';

	// 入力値を整形
	const inputText = c01_textArea.value;
	const inputTextArray = inputText.split(/\n/gmsu);

	// 各種計算値を格納するための変数
	let counterAllChars = 0;
	let counterEmptyRow = 0;
	let counterMaxChars = 0;

	const regex = /\s/gui;
	let counterSpace = 0;

	// 各行毎に、各種計算値を求めていく
	for(let t of inputTextArray){
		if(t==='') counterEmptyRow += 1;
		const chars = [...new Intl.Segmenter('ja', {granularity: 'grapheme'}).segment(t)].length;
		counterAllChars += chars;
		if(chars > counterMaxChars) counterMaxChars = chars;

		let matches = t.match(regex);
		if(matches) counterSpace += matches.length;
	}

	// 計算結果を配列にまとめる
	let dataArray = [['項目', '数']];
	dataArray.push(['文字', counterAllChars]);
	dataArray.push(['文字（空白除く）', counterAllChars - counterSpace]);
	dataArray.push(['空白文字', counterSpace]);
	dataArray.push(['最大文字（行単位）', counterMaxChars]);
	dataArray.push(['行', inputTextArray.length]);
	dataArray.push(['空行', counterEmptyRow]);

	// Table 要素として出力
	c01_output.appendChild(createTable(dataArray, TABLE_STYLE.horizontal));
	feedbackOK();
})

// クリアボタン（テキストエリアと計算結果を消す）
const c01_btnClear = document.querySelector('#c01js_clearTextArea');
c01_btnClear.addEventListener('click', ()=>{
	c01_textArea.value = '';
	c01_output.value = '';
	feedbackOK();
})
