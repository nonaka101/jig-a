# カンバン

## TODO

### b01-calculator のキー操作受け付け

`dialog` 要素の `open` 状態を監視（※下記コード参照）する手法を使い、Calculator ダイアログの起動中のみ「数値キー」「演算子」「イコール（エンター？）」キーを受け入れることを考える。  
起動中のみと限定するのは、使用するキーがスクリーンリーダーのユーザーにとって別のショートカットキーに割り振られている可能性を考慮しての判断。

```javascript
const dialogEle = document.querySelector("#dialog");
let intervalId;

// MutationObserverでdialog要素の属性の変化を監視
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList){
    if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
      if (dialogEle.open) {
        intervalId = setInterval(updateTime, 1000);
      } else {
        clearInterval(intervalId);
      }
    }
  }
});

// open属性の変化を監視
observer.observe(dialogEle, {
  attributes: true,
  attributeFilter: ["open"],
});
```

---

## 保留中

### Self-Contained版での `webmanifest` について

`webmanifest` を使って PWA 化するにはアイコンデータが必要となる。1ファイルで完結させるにはインラインSVGを使うしかなさそうだが、エスケープ処理を施しても動作がかなり不安定になる？

`data:` スキームを使った URL で HTML 内に埋め込むことができる。下記はエスケープ処理を挟んだJSONデータとなる。

```html
<link rel="manifest" href="data:application/manifest+json,{&quot;lang&quot;: &quot;ja&quot;,&quot;dir&quot;: &quot;ltr&quot;,&quot;name&quot;: &quot;JIG-A:簡易ツール集&quot;,&quot;short_name&quot;: &quot;JIG-A&quot;,&quot;scope&quot;: &quot;/&quot;,&quot;start_url&quot;: &quot;.&quot;,&quot;display&quot;: &quot;standalone&quot;}">
```

上記を html ファイル内に入れてブラウザで開くと、アイコンがない関係で機能しないことが確認できる。

---

## 解決済み

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

### `bl_table` でレイアウトが壊れるケースについて２（解消済）

ルートフォントサイズが 32px と大きく、携帯端末のように画面幅が小さい場合、高さを `75dvh` までに制限している表において、なぜか高さが狭い（ひどい場合だと線になっている）ケースが発生している。

原因は、`.ly_dialog_body` の `height: 100dvh` とレイアウトの高さが指定されていたため。それに合わせて全体が収まるよう、テーブルが小さくなっていた。  
ダイアログ外をクリックすると閉じる機能があるため、最小の高さを `100dvh` としつつ中身に応じて可変になるよう、`min-height` に変更。

```css
.ly_dialog_body {
  position: absolute;
  top: 0;
  padding: 8px;
  width: 100dvw;
  min-height: 100dvh;  /* ←変更箇所 */
  display: flex;
  flex-flow: column nowrap;
}
```

### `feedbackOK` の使用法について（一部解決済み）

音や振動で操作結果を返すよう、フィードバックする関数を導入しているが、その使い方に改良の余地がある状態。現状、クリップボード操作に使っているが、それがオブジェクト同士の結びつきを変に高めている感じがある。

例えばB01の `Calculator`　クラスは、自身とそのファイル内で作成した専用関数があれば動作するようになっていた。だがクリップボード操作を中に入れており、それが別ファイルにある `feedbackOK` 関数に依存するようになった。コピー機能をクラスから除外するか、何か別の対処が必要？

### b01-calculator の計算操作について（解決済み）

現状は、`Infinity` や `NaN` を弾くようにはしていない（例：`1/0=` で計算すると、`Infinity` となる）。なので、操作によっては不具合が起こり得るかもしれない。
