# nishira.jp

Nishira のポートフォリオサイト（静的1ページ）。

- 公開URL: https://nishira.jp/ （DNS設定後）／ https://goma-kun.github.io/
- ホスティング: GitHub Pages（このリポジトリの main ブランチ）
- 外部リソースへの依存なし。CSSは `index.html` にインライン、アイコンは `assets/` に同梱

## 更新のしかた

`index.html` を編集して push すると、1〜2分で反映されます。

拡張機能を追加するときは `index.html` の `<section>`（Published）の中に
`<article class="card">` をひとつ増やし、アイコンを `assets/` に置きます。

## DNS（nishira.jp を GitHub Pages に向ける設定）

ドメイン管理元（GMO）の DNS に以下を登録します。

| ホスト | 種別 | 値 |
|---|---|---|
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | goma-kun.github.io. |

反映後、GitHub のリポジトリ設定 → Pages → Custom domain に `nishira.jp` を入力し、
`Enforce HTTPS` にチェックを入れます（証明書の発行に数分〜数時間かかります）。
