# カンバン

## メモ

### Self-Contained版での `webmanifest` について

`webmanifest` を使って PWA 化するにはアイコンデータが必要となる。1ファイルで完結させるにはインラインSVGを使うしかなさそうだが、エスケープ処理を施しても動作がかなり不安定になる？

`data:` スキームを使った URL で HTML 内に埋め込むことができる。下記はエスケープ処理を挟んだJSONデータとなる。

```html
<link rel="manifest" href="data:application/manifest+json,{&quot;lang&quot;: &quot;ja&quot;,&quot;dir&quot;: &quot;ltr&quot;,&quot;name&quot;: &quot;JIG-A:簡易ツール集&quot;,&quot;short_name&quot;: &quot;JIG-A&quot;,&quot;scope&quot;: &quot;/&quot;,&quot;start_url&quot;: &quot;.&quot;,&quot;display&quot;: &quot;standalone&quot;}">
```

上記を html ファイル内に入れてブラウザで開くと、アイコンがない関係で機能しないことが確認できる。
