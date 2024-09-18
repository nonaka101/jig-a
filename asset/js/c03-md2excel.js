function markdown2excel(mdTable) {
	// 改行コードを \n に統一
	const normalizedStr = mdTable.replace(/\r\n/g, '\n');

	// 改行ごとに分割して、行ごとの配列を作成（セパレート行は除去）
	const rows = normalizedStr.split('\n');
	rows.splice(1,1);

	// 行処理：文字列を '|' で区切り、最端要素を除去し、空白をトリムし、タブ文字で繋げた文字列に変換
	const excelRows = rows.map(row => {
		return row										// '| A | B | | C |'
			.split('|')								 // ["", " A ", " B ", " "," C ",""]
			.slice(1, -1)							 // [" A ", " B ", " "," C "]
			.map(cell => cell.trim())	 // ["A", "B", "","C"]
			.join('\t');								// 'A\tB\t\tC'
	});

	// 各行を改行でつなぎ合わせて最終結果を返す
	return excelRows.join('\n');
}

function markdown2excelWithEscaped(mdTable) {
	const conversionTable = [
		{
			original: '|',
			evacuation: '@@PIPE@@',
			escaped: '\\|'
		},
	];

	// 退避用文字列に置換
	conversionTable.forEach(replacement => {
		mdTable = mdTable.split(replacement.escaped).join(replacement.evacuation);
	});

	// ベース処理
	mdTable = markdown2excel(mdTable);

	// 退避させてた文字列をエスケープ処理付きで復元
	conversionTable.forEach(replacement => {
		mdTable = mdTable.split(replacement.evacuation).join(replacement.original);
	});

	return mdTable;
}

/* テスト文
const mdTable1 = '| 表 | 列A | 列B |\n| --- | --- | --- |\n| 行1 | セルA1 | セルB1 |\n| 行2 | セルA2 | セルB2 |';

// 揃え方向を指定したパターン
// const mdTable1 = '| 表 | 列A | 列B |\n| :---: | :--- | ---: |\n| 行1 | セルA1 | セルB1 |\n| 行2 | セルA2 | セルB2 |';

// スペースやハイフンで見栄えを調整したパターン
// const mdTable1 = '|  表 | 列A    | 列B   |\n| --- | ----- | ----- |\n| 行1 | セルA1 | セルB1 |\n| 行2 | セルA2 | セルB2 |';

console.log(markdown2excel(mdTable1));
// ↓ 出力結果
// 表	列A	列B
// 行1	セルA1	セルB1
// 行2	セルA2	セルB2

// エスケープシーケンスを生の文字列として使った検証データ
const mdTable2 = String.raw`| 表 | 列A | 列B |
| :---: | :--- | ---: |
| 行1 | セル\|A1 | セル\|B1 |
| 行2 | セル\|A2 | セルB2 |`;

console.log(markdown2excelWithEscaped(mdTable2));
// ↓ 出力結果
// 表	列A	列B
// 行1	セル|A1	セル|B1
// 行2	セル|A2	セルB2
*/





const c03_textArea = document.querySelector('#c03js_inputArea');
const c03_output = document.querySelector('#c03js_output');
const c03_btnCalc = document.querySelector('#c03js_calcBtn');

// paste from clipboard
const c03_btnPasteFromClipboard = document.querySelector('#c03js_pasteFromClipboard');
c03_btnPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
	.readText()
	.then((clipText) => {
		// innerText と value の扱いは違う（InnerTextだと、改行コードが <br> に変換された状態に？）
		c03_textArea.value = '';
		c03_textArea.value = clipText;
		c03_textArea.rows = clipText.split(/\n/gmsu).length;
		c03_btnCalc.focus();
		feedbackOK();
	})
	.catch(e => {
		console.error(e);
		feedbackNG();
	});
})

c03_btnCalc.addEventListener('click', ()=>{
	// 準備（既存のデータを消す）
	c03_output.innerHTML = '';

	// 変換処理
	const result = markdown2excelWithEscaped(c03_textArea.value);

	// コピーボタンの生成
	const copyBtn = document.createElement('button');
	copyBtn.type = 'button';
	copyBtn	.className = 'el_btn el_btn__secondary';
	copyBtn.style = 'margin-top: 0.5em';
	copyBtn.textContent = 'コピー';
	copyBtn.addEventListener('click', () => {
		navigator.clipboard
		.writeText(result)
		.then(
			feedbackOK()
		)
		.catch(e => {
			console.error(e);
			feedbackNG();
		});
	})
	c03_output.appendChild(copyBtn);

	// 二次元配列を準備し、テーブル要素として出力
	const tableArray = result
		.split('\n')
		.map(row => row.split('\t'));

	c03_output.appendChild(createTable(tableArray));

	// テキストエリア要素として出力
	const textarea = document.createElement('textarea');
	textarea.classList.add('bl_simpleForm_textArea');
	textarea.rows = result.split(/\n/gmsu).length;
	textarea.value = result;
	c03_output.appendChild(textarea);

	feedbackOK();
})

// クリアボタン（テキストエリアと計算結果を消す）
const c03_btnClear = document.querySelector('#c03js_clearTextArea');
c03_btnClear.addEventListener('click', ()=>{
	c03_output.innerHTML = '';
	c03_textArea.value = '';
	c03_textArea.rows = null;
	feedbackOK();
})
