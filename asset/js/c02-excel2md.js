function excel2Markdown(excelStr) {
  // 改行コードを \n に統一
  const normalizedStr = excelStr.replace(/\r\n/g, '\n');

	// 行→列の順で、配列に分割
	const rows = normalizedStr.trim().split('\n');
	const table = rows.map(row => row.split('\t'));

	// 列数から、Markdown のセパレート文字列を生成
	const numColumns = table[0].length;
	const separateStr = `| ${Array(numColumns).fill('---').join(" | ")} |`;

	// 配列形式の列はもう不要なので、`|` で分割した文字列に再統合
	let result = [];
	for (let i = 0; i < table.length; i++) {
		result.push(`| ${table[i].join(" | ")} |`);
	}

	// セパレート行を2行目に挿入後、配列を改行文字列で繋げて返す
	result.splice(1, 0, separateStr);
	return result.join('\n');
}

/*
// 例:
const excelStr = `Header1\tHeader2\tHeader3
Data1-1\tData1-2\tData1-3
Data2-1\tData2-2\tData2-3`;

console.log(excel2Markdown(excelStr));
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
	const result = excel2Markdown(c02_textArea.value);

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
