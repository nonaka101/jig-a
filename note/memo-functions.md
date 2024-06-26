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

### D:暦・日付・期間

### E:単位（変換・換算）
