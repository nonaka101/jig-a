# カンバン

## メモ

### Self-Contained版での `webmanifest` について

`webmanifest` を使って PWA 化するにはアイコンデータが必要となる。1ファイルで完結させるにはインラインSVGを使うしかなさそうだが、エスケープ処理を施しても動作がかなり不安定になる？

`data:` スキームを使った URL で HTML 内に埋め込むことができる。下記はエスケープ処理を挟んだJSONデータとなる。

```html
<link rel="manifest" href="data:application/manifest+json,{&quot;lang&quot;: &quot;ja&quot;,&quot;dir&quot;: &quot;ltr&quot;,&quot;name&quot;: &quot;JIG-A:簡易ツール集&quot;,&quot;short_name&quot;: &quot;JIG-A&quot;,&quot;scope&quot;: &quot;/&quot;,&quot;start_url&quot;: &quot;.&quot;,&quot;display&quot;: &quot;standalone&quot;}">
```

上記を html ファイル内に入れてブラウザで開くと、アイコンがない関係で機能しないことが確認できる。

### `bl_table` でレイアウトが壊れるケースについて（解消済）

ルートフォントサイズが 32px と大きい場合、画面幅が768pxより少し大きい状態だとセルの文字が重なって見えなくなる状況が起きうる。これは列が大量にある場合に発生する。

簡易的な対処としては、`bl_table__wide` といった列が多い用の新規モディファイアを設け、下記のようにメディアクエリの発動タイミングを ずらす方法が考えられる。

```css
@media screen and (max-width: 768px) {
.bl_table:not(.bl_table__wide){/* 既存のスタイル */}
}

@media screen and (max-width: 960px) {
.bl_table.bl_table__wide{/* 760pxの時と同じスタイル */}
}
```

### `feedbackOK` の使用法について

音や振動で操作結果を返すよう、フィードバックする関数を導入しているが、その使い方に改良の余地がある状態。現状、クリップボード操作に使っているが、それがオブジェクト同士の結びつきを変に高めている感じがある。

例えばB01の `Calculator`　クラスは、自身とそのファイル内で作成した専用関数があれば動作するようになっていた。だがクリップボード操作を中に入れており、それが別ファイルにある `feedbackOK` 関数に依存するようになった。コピー機能をクラスから除外するか、何か別の対処が必要？
