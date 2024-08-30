# JIG-A

![本リポジトリのロゴ 「治具A（J I G - A）」](./note/misc/jig-a-logo-2.svg)

## 概要

本リポジトリは、日常で利用できるような「ちょっとしたツール」を、**環境や状況を問わずブラウザのみで動作する**ことを目標としたものです。

### 機能

現在、下記の機能を扱っています。

- **算術**
  - 簡易電卓
- **テキスト**
  - 文字列カウンタ
  - 表形式データを `markdown` テーブルに変換
  - `markdown` テーブルを表形式データに変換
- **暦・日付・期間**
  - 年齢計算
  - 西暦と和暦の早見表
- **単位**（**換算・変換**）
  - 用紙サイズ早見表
  - 用紙間 縮尺 早見表

### 特徴

本リポジトリは**JavaScriptが動作するブラウザがあれば、環境・状況を選ばず動作する**ことを目的とし、下記の特徴を持ちます。

#### デバイスを選ばない

モバイル・デスクトップ端末両方で利用できるようします。

#### 接続状況を選ばない

オフラインでも動作するようにします。

そのため 単一の `html` 内にスタイル・スクリプト等を詰めた自己完結的なファイルを別途用意します。ローカル上にこのファイルを保存することで、オフラインでも利用できることを想定しています。

#### 人を選ばない

簡素な設計に留め、利用者側に合ったデザインになるようします。

OS側が持つ フォントサイズ や カラーモード 情報を拾う、可変性のあるデザインとなっています。またマシンリーダブルな構造や WAI-ARIA を使いキーボードやスクリーンリーダーでも利用できるようすることを目指しています。

## 利用について・ライセンス

本リポジトリは様々な形で利用できるよう設計しております。ローカル上に保存して使ったりと、基本的に自由に利用していただいて構いません。

ただし、下記の 2 点についてご了承ください。

1. 著作権は放棄していません、これを偽るような利用はお辞めください
2. 利用で生じる何かしら（不利益含む）に対し、責任を負うことはできません

いろんな環境や状況で利用できるよう設計してますが、検証ができてるわけではないので不具合等が想定されます。利用の際には、ご自身で試していただき、ご自身の責任でご利用ください。

誤り等は issue を通して連絡いただければ助かります。ケースによっては対応に時間がかかることが想定されます、ご了承いただければ幸いです。

### ライセンスについて

本リポジトリは[MITライセンス](./LICENSE)となっています。

なお、本リポジトリは下記を使用しております。

#### `normalize.css`

ノーマライズCSSとして、[Normalize.css](https://necolas.github.io/normalize.css/)を使用しています。こちらは[MITライセンス](https://github.com/necolas/normalize.css/blob/master/LICENSE.md)となっています。
