/**
 * 和暦に関する諸情報を管理するためのオブジェクト
 */
const wareki = {
	// ID 値は配列インデックスと一致させ、対応するデータを取り出しやすくしている
	// 例：`wareki.eras[wareki.getEraIdByDate(new Date(2000,1,23))]` ≒ `wareki.eras[3]` で目的となる平成データ
	eras: [
		{ id: 0, name: "明治", startDate: new Date("1868-01-25") },
		{ id: 1, name: "大正", startDate: new Date("1912-07-30") },
		{ id: 2, name: "昭和", startDate: new Date("1926-12-25") },
		{ id: 3, name: "平成", startDate: new Date("1989-01-08") },
		{ id: 4, name: "令和", startDate: new Date("2019-05-01") },
	],

	/**
	 * 日付から、対応している和暦(ID)を返す
	 *
	 * @param {date} date - 調べる日付
	 * @returns {int} eras で管理されてる ID 値
	 */
	getEraIdByDate: function(date) {
		if(!(date instanceof Date)) throw new Error('引数は Date 型である必要があります');
		for (let i = this.eras.length - 1; i >= 0; i--) {
			if (date >= this.eras[i].startDate) return this.eras[i].id;
		}

		throw new Error('明治以前の日付データです');
	},

	/**
	 * IDと和暦年数から、西暦での年数を返す（平成32年 -> 2020 のように、実在しない部分にも対応）
	 *
	 * @param {int} id - erasで管理されてるID値（例：令和x年 -> 5）
	 * @param {int} eraYear - 和暦年数（例：令和2年 -> 2）
	 * @returns
	 */
	getYearByEra: function(id, eraYear) {
		const era = this.eras.find(e => e.id === id);
		if (!era) throw new Error("無効なIDです");

		return era.startDate.getFullYear() + eraYear - 1;
	}
};

// 使用例
// console.log(wareki.eras[wareki.getEraIdByDate(new Date(2000,1,23))]);



/**
 * 生年月日から、年齢を計算する（時間基準）
 *
 * @param {date} dateBirth - 生年月日
 * @param {date} dateBase - 計算基準日（今日）
 * @returns {int} - 満年齢
 */
function calcAge(dateBirth, dateBase = new Date()){
	// 型チェック
	if(!(dateBirth instanceof Date && dateBase instanceof Date)) throw new Error('引数は Date 型でなければなりません');

	const age = dateBase.getFullYear() - dateBirth.getFullYear();

	// 加齢タイミング（計算基準年）は、誕生日の前日24時
	const timeBoundaryForAging = new Date(
		dateBase.getFullYear(),
		dateBirth.getMonth(),
		dateBirth.getDate() - 1,
		24
	);

	// 満年齢は、加齢タイミングを まだ越えていない場合、デクリメントして返す
	if(timeBoundaryForAging > dateBase){
		return age - 1;
	} else {
		return age;
	}
}



/**
 * ２つの日付間にある日数（絶対値）を算出
 *
 * @param {date} date1 - 日付１
 * @param {date} date2 - 日付２
 * @returns {int} 期間内の日数（余剰の時間は切り捨て）
 */
function dateDiff(date1, date2) {
	// 型チェック
	if(!(date1 instanceof Date && date2 instanceof Date)) throw new Error('引数は Date 型でなければなりません');

	// ミリ秒単位での期間を求め、日数単位にして返す
	const ms = Math.abs(date1.getTime() - date2.getTime());
	return Math.floor(ms / (1000 * 60 * 60 * 24));
}



/**
 * 年月日を表す文字列が、適正かを判断
 *
 * @param {string} dateString - 'yyyy-MM-dd' 形式の文字列
 * @returns {boolean} 存在しうる日付かの判定
 */
function isDateFormat(dateString) {
	// 正規表現による形式チェック（yyyy-MM-dd）
	const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/
	if (!dateString.match(dateFormatRegex)) return false;

	// 簡易的な月日の妥当性チェック（月の範囲は1〜12か、日の範囲は1〜31か）
	const [year, month, day] = dateString.split('-').map(Number);
	if(
		!(month >= 1 && month <= 12) ||
		!(day >= 1 && day <= 31)
	) return false;

	// date 型による妥当性チェック（入力値が `2/31` といった存在しない日付だったり、閏日により実際の日付とズレてないか）
	const date = new Date(year, month - 1, day);
	if (
		date.getFullYear() !== year ||
		date.getMonth() + 1 !== month ||
		date.getDate() !== day
	) return false;

	return true;
}
