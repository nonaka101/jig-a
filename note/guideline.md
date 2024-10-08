# ガイドライン

## 構成・設計方針

### 命名規則

#### 使用する表記法について

各項目に対し 主として使用する表記法は、下表のようになる。

|項目名|表記法|備考|
|---|---|---|
|ファイル名|ケバブケース|理由としては、正規表現を利用しやすくしつつ、マイナスと誤認されにくいため|
|CSSクラスやID名|ローワーキャメルケース＋スネークケース|[PRECSS](https://precss.io/ja/)を参考にしたもの（※後述）|
|JavaScript変数名|（基本）ローワーキャメル|一部にスネークケースも使用（※後述）|

#### 各種機能の管理

機能は、その親として**分類**に属するものとする。分類はアルファベット1文字で表現し、機能は分類文字＋連番2桁の「管理番号」で管理されるものとする。

上記より、各機能は基本的に「b01」「c01」のように 1番から開始される。「b00」「c00」のような 0番は、分類全体に適用される汎用機能を管理するものとする。

よって、分類と機能は下記のようになる。  
（※分類 A は、万が一のための予約分とする）

- b(00):計算
  - b01:簡易電卓
- c(00):テキスト
  - c01:文字列カウンター
  - c02:表形式データ→Markdown
  - c03:Markdown→表形式データ
- d(00):暦・日付・期間
  - d01:年齢計算
  - d02:時計
  - d99:西暦↔和暦 早見表
- e(00):単位・変換・換算
  - e98:用紙サイズ 早見表
  - e99:用紙間縮尺 早見表

※ 単なるテーブル要素だけなど、JavaScript を用いないものに関しては番号を99から前方へと付与している。  
　 これはJSファイル名に割り振っている管理番号が、穴あきにならないようするためである（ミス防止の観点から）

##### 管理番号の利用先

この管理番号の利用先は、例えば下記である。

- CSS のファイル名、及び内部のクラスやID名
- JavaScript のファイル名、及び変数名

これは本リポジトリの特徴 **self-contained：自己完結** によるものである。1ファイル上で全ての要素・スクリプトを管理する関係上、名前の重複を避ける意図から こうしている。

##### 管理番号の巻き上げ

スタイル、スクリプト両者で共通するものとして、個別部品が汎用部品へと巻き上げられるケースがある。

「b01」のような個別部品として設計したものが、同分類内で流用できると判明したとき、分類内汎用部品として「b00」へ巻き上げられる。

更に「b00」内で使っている部品が、他の分類にも流用できると判明したとき、汎用部品として管理番号から外れる。

#### CSSの命名規則

- 基本として、部品は[PRECSS](https://precss.io/ja/)ライクの命名規則を使用する
- 接頭辞、部品名、子部品名、モディファイア の 4 項目で表現し、各項目は `_` で区切る
- 接頭辞（最初の2文字）はモジュールレベルを示す
  - `ly_`：レイアウト（部品を格納するレイアウトの大枠）
  - `el_`：エレメント（単一要素で1つの部品）
  - `bl_`：ブロック（複数要素で1つの部品）
  - `js_`：スクリプトの操作対象を想定
  - `is_`：フラグとして、スクリプトの条件分岐に用いることを想定
- 接頭辞と部品名を `{接頭辞}_{部品名}` の形式で組み合わせ、これを基本形とする
- ブロックなど子部品がある場合は、上記形式の後ろに繋げる（`{接頭辞}_{部品名}_{子部品名}`）
- 部品に特殊な振る舞いを追加する場合はモディファイアを設ける
- モディファイアは `{部品}__{モディファイア名}` とアンダースコア2つで区別させる
- 専用部品は接頭辞を下記内容に従い 5 桁で管理し、他は基本と同じとする
  - 「機能管理番号（分類文字＋連番2桁）」の後ろに、基本ルールのモジュールレベルの接頭辞をつける
  - 例：`b01bl_btnArray` → `b01`（電卓）＋`bl_btnArray`（ボタン配列）

※専用部品として接頭辞が 5桁になる例としては、一つしかあり得ないことが確定しているものである。例えばそのダイアログ内にしかないフォーム要素のID名など（？）を考えている。

#### JavaScriptの命名規則

基本的には、ローワーキャメルケースを用いる。機能専用でトップレベルにくる変数名に関しては、重複を避けることを重視する。

必要であれば接頭辞として機能管理番号をスネークケースで繋げる形を用いる（例：`b01_calcBtn`）。一つしかあり得ないことが確定しているもの、例えばダイアログ内にあるフォーム要素などを想定している。

### 読み出し順

#### CSSの読み出し順

下記は Self-Contained 版 を想定したものである。基本的には、コンテンツの順番と適用順が一致しているので問題ない。

1. `head` 内 `style` タグで、ノーマライズ適用
2. `head` 内 `style` タグで、汎用部品等のスタイル
3. `h3` 後 `style` タグで、カテゴリ内汎用部品のスタイル
4. `dialog` 後 `style` タグで、機能専用部品のスタイル

#### JavaScriptの読み出し順

下記は 分割版 を想定した、コンテンツ順に沿った `script` タグである。

1. `h3` 後に、カテゴリ内汎用部品のスクリプト（※ `defer` 付与）
2. `dialog` 後に、機能専用部品のスクリプト（※ `defer` 付与）
3. `body` 閉じる直前に、汎用部品等のスクリプト

これにより順番は下記のようになり、基本的にコードの依存関係は解決されるものと考える。

1. `</body>` 直前の汎用部品
2. `h3` 後のカテゴリ汎用部品（`defer`-1）
3. `dialog` 後の機能専用部品（`defer`-2）

問題は、Self-Contained 版 でスクリプトがインラインになった場合である。`defer` が効かない場合、`</body>` 直前で全ての順番を管理して配置する必要があると考える。

### リリースバージョンについて

`0.1.0` のように 3つの数字で管理され、これは `Major.Minor.Patch` の形式を表している。基本的には、新規に機能を追加した際 `Minor` をインクリメントし、修正・改修の際 `Patch` をインクリメントする。

## スタイル

## アクセシビリティ

### インタラクティブ

#### ボタン

タッチ可能なための最小サイズを規定し、それ以下にならないように設計すること。

また これは単純な `button` 要素にとどまらず、様々なケースにも当てはめること。  
例えば `input[type="number"]` を考える。ブラウザのデフォルトで備わっているスピンボタンは そのままだと かなり小さく、正確なタップ操作はほぼできない。なので機能を拡張し、左右にステッパーボタンを用意することが想定されるが、この `button` にも最小サイズは適用されるべきである。  
（ステッパーの場合は 1行に並べる関係上、`clamp()` を使って最大サイズも規定することが考えられる）
