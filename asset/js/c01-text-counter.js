const c01_textArea = document.querySelector('#c01js_inputArea');
const c01_output = document.querySelector('#c01js_output');
const c01_btnCalc = document.querySelector('#c01js_countBtn');

// paste from clipboard
const c01_btnPasteFromClipboard = document.querySelector('#c01js_pasteFromClipboard');
c01_btnPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
  .readText()
  .then((clipText) => {
		// innerText と value の扱いは違う（InnerTextだと、改行コードが <br> に変換された状態に？）
		c01_textArea.value = '';
		c01_textArea.value = clipText;
		c01_textArea.rows = clipText.split(/\n/gmsu).length;
		c01_btnCalc.focus();
		feedbackOK();
	})
	.catch(e => {
		console.error(e);
		feedbackNG();
	});
})

c01_btnCalc.addEventListener('click', ()=>{
	// 準備（既存のテーブルを消す）
	c01_output.value = '';

	// 入力値を整形
	const inputText = c01_textArea.value;
	const inputTextArray = inputText.split(/[\r|\n|\r\n]+/gmsu);

	// 各種計算値を格納するための変数
	let counterAllChars = 0;
	let counterEmptyRow = 0;
	let counterMaxChars = 0;

	const regexWhiteSpace = /\s/gui;
	let counterWhiteSpace = 0;
	const regexTab = /\t/gui;
	let counterTab = 0;
	const regexSpace = /[ |　]/gui;
	let counterSpace = 0;

	// 各行毎に、各種計算値を求めていく
	for(let t of inputTextArray){
		if(t==='') counterEmptyRow += 1;
		const chars = [...new Intl.Segmenter('ja', {granularity: 'grapheme'}).segment(t)].length;
		counterAllChars += chars;
		if(chars > counterMaxChars) counterMaxChars = chars;

		const matchesWhiteSpace = t.match(regexWhiteSpace);
		if(matchesWhiteSpace) counterWhiteSpace += matchesWhiteSpace.length;
		const matchesTab = t.match(regexTab);
		if(matchesTab) counterTab += matchesTab.length;
		const matchesSpace = t.match(regexSpace);
		if(matchesSpace) counterSpace += matchesSpace.length;
	}

	// 計算結果を配列にまとめる
	let dataArray = [['項目', '数']];
	dataArray.push(['文字', counterAllChars]);
	dataArray.push(['文字（空白除く）', counterAllChars - counterWhiteSpace]);
	dataArray.push(['空白文字', counterWhiteSpace]);
	dataArray.push(['Tab文字', counterTab]);
	dataArray.push(['スペース', counterSpace]);
	dataArray.push(['最大文字（行単位）', counterMaxChars]);
	dataArray.push(['行', inputTextArray.length]);
	dataArray.push(['空行', counterEmptyRow]);

	// Table 要素として出力
	c01_output.appendChild(createTable(dataArray, TABLE_STYLE.vertical));
	feedbackOK();
})

// クリアボタン（テキストエリアと計算結果を消す）
const c01_btnClear = document.querySelector('#c01js_clearTextArea');
c01_btnClear.addEventListener('click', ()=>{
	c01_output.value = '';
	c01_textArea.value = '';
	c01_textArea.rows = null;
	feedbackOK();
})
