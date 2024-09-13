function excel2markdown(excelStr) {
	// 改行コードを \n に統一
	const normalizedStr = excelStr.replace(/\r\n/g, '\n');

	// 行→列の順で、配列に分割
	const rows = normalizedStr.trim().split('\n');
	let table = rows.map(row => row.split('\t'));

	// 列数から、Markdown のセパレート文字列を生成
	const numColumns = table[0].length;
	const separateStr = `| ${Array(numColumns).fill('---').join(' | ')} |`;

	// 各行を `|` で分割した文字列に再統合
	let result;
	result = table.map(row => `| ${row.join(' | ')} |`);

	// セパレート行を2行目に挿入後、配列を改行文字列で繋げて返す
	result.splice(1, 0, separateStr);
	return result.join('\n');
}

function excel2markdownWithEscaped(excelStr) {
	const conversionTable = [
		{
			original: '|',
			evacuation: '@@PIPE@@',
			escaped: '\\|'
		},
	];

	// 退避用文字列に置換
	conversionTable.forEach(replacement => {
		excelStr = excelStr.split(replacement.original).join(replacement.evacuation);
	});

	// ベース処理
	excelStr = excel2markdown(excelStr);

	// 退避させてた文字列をエスケープ処理付きで復元
	conversionTable.forEach(replacement => {
		excelStr = excelStr.split(replacement.evacuation).join(replacement.escaped);
	});

	return excelStr;
}

/*
const test = '表\t列A\t列B\n行1\tセルA1\tセルB1\n行2\tセルA2\tセルB2';
console.log(excel2markdown(test));
// ↓ 出力結果
// | 表 | 列A | 列B |
// | --- | --- | --- |
// | 行1 | セルA1 | セルB1 |
// | 行2 | セルA2 | セルB2 |

const testWithPipe = '表\t列A\t列B\n行1\tセル|A1\tセル|B1\n行2\tセル|A2\tセルB2';
console.log(excel2markdownWithEscaped(testWithPipe));
// ↓ 出力結果
// | 表 | 列A | 列B |
// | --- | --- | --- |
// | 行1 | セル\\|A1 | セル\\|B1 |
// | 行2 | セル\\|A2 | セルB2 |
*/





const c02_textArea = document.querySelector('#c02js_inputArea');
const c02_output = document.querySelector('#c02js_output');
const c02_btnCalc = document.querySelector('#c02js_calcBtn');

// paste from clipboard
const c02_btnPasteFromClipboard = document.querySelector('#c02js_pasteFromClipboard');
c02_btnPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
	.readText()
	.then((clipText) => {
		// innerText と value の扱いは違う（InnerTextだと、改行コードが <br> に変換された状態に？）
		c02_textArea.value = '';
		c02_textArea.value = clipText;
		c02_textArea.rows = clipText.split(/\n/gmsu).length;
		c02_btnCalc.focus();
		feedbackOK();
	})
	.catch(e => {
		console.error(e);
		feedbackNG();
	});
})

c02_btnCalc.addEventListener('click', ()=>{
	// 準備（既存のデータを消す）
	c02_output.innerHTML = '';

	// 変換処理
	const result = excel2markdownWithEscaped(c02_textArea.value);

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
	c02_output.appendChild(copyBtn);

	// テキストエリア要素として出力
	const textarea = document.createElement('textarea');
	textarea.classList.add('bl_simpleForm_textArea');
	textarea.rows = result.split(/\n/gmsu).length;
	textarea.value = result;
	c02_output.appendChild(textarea);

	feedbackOK();
})

// クリアボタン（テキストエリアと計算結果を消す）
const c02_btnClear = document.querySelector('#c02js_clearTextArea');
c02_btnClear.addEventListener('click', ()=>{
	c02_output.innerHTML = '';
	c02_textArea.value = '';
	c02_textArea.rows = null;
	feedbackOK();
})
