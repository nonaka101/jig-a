# 設計メモ

## 各種機能

### B:計算

#### b01-calculator

簡易電卓、基本的な四則演算ができる。

設計の際の課題は、下記の2点。

- 少数の計算の際、丸め誤差が生じる
- 計算式の入力位置によって、入力できる内容が変化する

##### 少数計算の丸め誤差について

少数を含む計算はそのままでは不都合だったので、整数での計算に置き換える必要がある。
なので、一度少数は整数へと変換する措置を施し、計算後にその措置を逆算する形で、少数での計算結果に戻す。

##### 計算式の位置に応じた入力内容について

状態遷移の考えをベースとして、入力の整合性をチェックする。

まずは下記のような計算式の位置に応じたステートを用意、状態を管理できるようにする。

|State名|数値|説明|
|:---|:---:|:---|
|Start|0|初期状態|
|NegativeNum1|1|左辺：マイナス符号を入力|
|OperandZero1|2|左辺：ゼロ入力状態|
|OperandInteger1|3|左辺：整数モード|
|OperandDecimal1|4|左辺：少数モード|
|Operator|5|演算子入力|
|NegativeNum2|6|右辺：マイナス符号を入力|
|OperandZero2|7|右辺：ゼロ入力状態|
|OperandInteger2|8|右辺：整数モード|
|OperandDecimal2|9|右辺：少数モード|
|Result|10|計算結果|

上記ステートで入力できる内容と、入力後に遷移するステートを表すと、下表のようになる。

| 状態名 / 取りうる値 | 0 | 1-9 | . | - | +, *, / | = |
|----------------------|---|-----|---|---|---------------|---|
| Start                | OperandZero1 | OperandInteger1 | OperandDecimal1 | NegativeNum1 | - | - |
| NegativeNum1         | OperandZero1 | OperandInteger1 | OperandDecimal1 | - | - | - |
| OperandZero1         | - | OperandInteger1 | OperandDecimal1 | Operator | Operator | - |
| OperandInteger1      | OperandInteger1 | OperandInteger1 | OperandDecimal1 | Operator | Operator | - |
| OperandDecimal1      | OperandDecimal1 | OperandDecimal1 | - | Operator | Operator | - |
| Operator             | OperandZero2 | OperandInteger2 | OperandDecimal2 | NegativeNum2 | - | - |
| NegativeNum2         | OperandZero2 | OperandInteger2 | OperandDecimal2 | - | - | - |
| OperandZero2         | - | OperandInteger2 | OperandDecimal2 | Operator(*) | Operator(*) | Result |
| OperandInteger2      | OperandInteger2 | OperandInteger2 | OperandDecimal2 | Operator(*) | Operator(*) | Result |
| OperandDecimal2      | OperandDecimal2 | OperandDecimal2 | - | Operator(*) | Operator(*) | Result |
| Result               | OperandZero1 | OperandInteger1 | OperandDecimal1 | Operator | Operator | - |

(*): 一度 Result を経由して Operator に移行する

### C:テキスト

#### c01-text-counter

入力されたテキストの文字列をカウントする機能。

設計の際の課題は、下記となる

- 絵文字やサロゲートペアも1文字として検出する必要がある

##### 1文字としてカウントすることについて

マルチバイト文字を利用する環境下では、単純な `String().length` では文字数をカウントできない場合がある。下表は、絵文字やサロゲートペア文字に対し、いくつかの方法で長さを求めた結果である。

|文字|`String().length`|`String().match(/\S/gui).length` / `Array.from().length`|
|:---:|:---:|:---:|
|𩸽|2|1|
|🍎|2|1|
|🏴󠁧󠁢󠁥󠁮󠁧󠁿|14|7|
|🇯🇵|4|2|
|👨🏻‍💻|7|4|

これに対し、`Intl.Segmenter` を使うと、全て1文字としてカウントしてくれるようになった。

#### c02-excel2md

Excel や Google Sheet などの表形式データ（`\t`, `\n` により区切られているデータ）を、`markdown` のテーブル形式に変換する機能。

#### c03-md2excel

**c02** とは逆に `markdown` テーブルを、表形式データに変換する機能

### D:暦・日付・期間

#### d00

汎用なものとして、下記を準備

- 和暦に関する諸情報を管理するためのオブジェクト `wareki`
- 生年月日から、年齢を計算する `calcAge()`
- ２つの日付間にある日数（絶対値）を算出 `dateDiff()`
- 日付文字列が適正な日付かを判定 `isDateFormat()`

#### d01-calculate-age

生年月日から、年齢（＋経過日数）を算出する機能。

設計の際の課題は、下記の通り。

- 加齢タイミングについて（閏日前後が生年月日の場合にも対応）

※一部の書類では満年齢の他に「◯歳◯ヶ月」と記入するものもあり、月数を算出する需要がある。しかし日数と違い月数は *時期により 28-31 と日数が散らばっている* 関係から実装する難度が跳ね上がってしまう問題があった。そのため、算出しやすい日数のみ導入することに。

##### 加齢タイミングは、誕生日前日24時

本件において、加齢するタイミングをどこに引くかが大きな要点となる。例えば「**閏年の2/29日**に生まれた人が、4年に1度しか歳を取らない」といった事態は避けなければならない。

また（概算値ならともかく）「誕生日から365日ずつ回して算出する」という手法も適切でない。閏年により1年の日数は変わるし、今回は経過日数も必要となるので（ある程度の）精度を持つ値が必要である。

そこで『[年齢計算ニ関スル法律 | e-Gov 法令検索](https://laws.e-gov.go.jp/law/135AC1000000050)』より、**誕生日前日の24時**のタイミングで加齢する考えを持ってきている。この場合、閏日前後が誕生日となる場合は下表のようになる。

|誕生日|加齢時（閏年でない場合）|加齢時（閏年の場合）|
|:---:|:---|:---|
|2/29|2/28 24:00(≒ 3/1 0:00)|2/28 24:00(≒ 2/29 0:00)|
|3/1|2/28 24:00(≒ 3/1 0:00)|2/29 24:00(≒ 3/1 0:00)|

### E:単位（変換・換算）
