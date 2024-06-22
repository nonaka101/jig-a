function createTable(containerId, dataArray) {
  const container = document.getElementById(containerId);
  const table = document.createElement('table');

  // ヘッダー行を作成
  const tableHeader = table.createTHead();
	const tableHeaderRow = tableHeader.insertRow();
	tableHeaderRow.insertCell().textContent = '項目';
	tableHeaderRow.insertCell().textContent = '数';

  // データ行を作成
	const tableBody = table.createTBody();
  for (const [key, value] of dataArray) {
    const row = tableBody.insertRow();
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    cell1.textContent = key;
    cell2.textContent = value;
  }

  // テーブルをコンテナ要素に追加
  container.appendChild(table);
}





// textarea
const textCounterTextArea = document.querySelector('#c01js_inputArea');

// paste from clipboard
const btnTextCounterPasteFromClipboard = document.querySelector('#c01js_pasteFromClipboard');
btnTextCounterPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
  .readText()
  .then((clipText) => {
		/* innerText と value の扱いは違う（InnerTextだと、改行コードが <br> に変換された状態に？）
		console.log(clipText.search(/\n/msu));
		*/
		textCounterTextArea.value = '';
		textCounterTextArea.value = clipText;
	})
	.catch(e => {
		console.error(e);
	});
})

// calculate text count
const textCounterOutput = document.querySelector('#c01js_output');
const textCounterCountBtn = document.querySelector('#c01js_countBtn');
textCounterCountBtn.addEventListener('click', ()=>{
	// 準備（既存のテーブルを消す）
	textCounterOutput.value = '';

	// 入力値を整形
	const inputText = textCounterTextArea.value;
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
	let dataArray = [];
	dataArray.push(['文字', counterAllChars]);
	dataArray.push(['文字（空白除く）', counterAllChars - counterSpace]);
	dataArray.push(['空白文字', counterSpace]);
	dataArray.push(['最大文字（行単位）', counterMaxChars]);
	dataArray.push(['行', inputTextArray.length]);
	dataArray.push(['空行', counterEmptyRow]);

	// Table 要素として出力
	createTable('c01js_output', dataArray);
})

// クリアボタン（テキストエリアと計算結果を消す）
const textCounterClear = document.querySelector('#c01js_clearTextArea');
textCounterClear.addEventListener('click', ()=>{
	textCounterTextArea.value = '';
	textCounterOutput.value = '';
})
