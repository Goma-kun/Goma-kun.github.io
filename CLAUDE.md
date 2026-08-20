# CLAUDE.md — このリポジトリで作業する Claude への引き継ぎ

ニシラさんのポートフォリオサイト（https://nishira.jp ／ GitHub Pages）。
Chrome 拡張・デスクトップアプリの紹介サイトで、トップのカードと各詳細ページ（works/*.html）で構成。

## 現在の主なタスク：デモ動画のサイト掲載

ニシラさんがアプリの画面収録（mov/mp4）をチャットに添付してくるので、
**手順キャプションを焼き込んで、トップのカードと詳細ページに掲載する**のが定型作業。
ならべるくん・まもるくん・SmartShot で実施済み。**未対応: おさむくん／デスクトップ版まもるくん／SmartShot Mac 版／しゃべるくん**（静止画でも可: おさむくん・しゃべるくん）。

### 作業手順（確立済み）

1. **環境準備**: `pip install imageio-ffmpeg pillow fonttools brotli`。
   ffmpeg は `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` のものを使う
   （Playwright 付属の /opt/pw-browsers のffmpegは h264 を扱えないので不可）。
2. **フォント取得**（Google Fonts css2 を UA なし curl で叩くと ttf が返る）:
   - キャプション用: Noto Sans JP **Bold(700)**
   - 中央テロップ用: Noto Sans JP **Black(900)**
   - ※丸ゴシック（M PLUS Rounded 等）は「子供っぽい」と却下済み。サイトの書体（ヒラギノ/Noto系）に合わせること
3. **動画の内容把握**: ffmpeg で `fps=1`（細部は fps=2）のフレームを抽出し、PIL でコンタクトシートを作って Read で目視。
   各場面（何秒に何が起きるか）を特定してからキャプション文とタイミングを決める。
4. **キャプション焼き込み**（PIL で PNG を作り ffmpeg overlay。drawtext は使えないビルド）:
   - **下部の手順ピル**: 濃紺角丸 `rgba(10,15,28,216)`＋白細枠、白文字、`① 〜` の番号付き4段階程度。
     文字サイズは動画幅1920pxで56、760pxで30 目安。位置は下部中央 `(W-w)/2:H-h-26`（UI要素と重なるなら上へ逃がす）
   - **中央の大テロップ**（見どころの瞬間だけ）: Noto Sans JP Black・白文字＋濃紺縁取り(16,26,48)・ぼかし影。
     `-loop 1 -t n -i title.png` を `format=rgba,fade=...:alpha=1` でフェードイン/アウトし `setpts=PTS+開始秒/TB`、
     overlay は `eof_action=pass`。**黄色や「！」は使わない（白統一・落ち着いたトーンが好み）**
5. **エンコード**: `libx264 -crf 22〜23 -pix_fmt yuv420p -movflags +faststart -an`（音声は除去）。1本1〜2MB目安。
6. **カード用の横型版**: トップのカード枠は 16:10（.wcard-media）。
   - 縦長・正方形の動画は 1520x950 のぼかし背景合成を作る:
     `split → 背景: scale=1520:950:force_original_aspect_ratio=increase,crop,boxblur=26:2,eq=brightness=-0.1 → 前景: scale=-2:950 を中央 overlay`
   - 長い動画は中間部を `trim`+`setpts/3`+`concat` で早送りして 30 秒前後に（まもるくんカードで実施、テロップは出力後の時間で合わせる）
7. **HTML への組み込み**:
   - トップ `index.html`: 該当カードの `.wcard-media` を `<video src=... autoplay loop muted playsinline preload="metadata" aria-label="...">` に。チップ `<span class="chip">デモ動画あり</span>` を追加
   - 詳細 `works/*.html`: `<video ... controls muted playsinline>` ＋ `<p class="videonote">説明</p>`。
     ページ内に `<!-- デモ映像を追加する場所 -->` のコメントがあればそこへ。
     **縦長動画は `class="portrait"` を付ける**（CSS: `.detail-body video.portrait`）
8. **検証（必須）**: 出力動画からフレームを抜いて目視確認。ページは
   `/opt/pw-browsers/chromium-*/chrome-linux/chrome --headless=new --no-sandbox --screenshot --window-size=390,844`
   でスマホ幅も確認（過去に CSS が効かず動画がはみ出す事故あり）。
9. **デプロイ**: 作業ブランチにコミット→push→ `main` へマージ→push（ニシラさんは都度 main 反映を了承済みだが、初回は一言確認するとよい）。
   **マージ前に必ず `git fetch origin main`**。別セッション（ローカルの Claude Code）が並行で main を進めていることがある。

### その他の約束事

- CSS を変えたら全 HTML の `style.css?v=YYYYMMDD` の番号を上げる（キャッシュ対策）
- 元動画は上書き前のものが git 履歴にある。作り直すときは `git show <commit>:assets/xxx.mp4` で原本を取り出し、二重エンコードを避ける
- キャプション文はやさしい話し言葉で簡潔に。仕上げ前に検証フレームを見せて認識合わせをするとスムーズ
- ファビコンは確定済み（ツールタイル案）。触らない
- やり取りは日本語。ニシラさんはプログラミング専門ではないので、専門用語は噛み砕いて説明する
