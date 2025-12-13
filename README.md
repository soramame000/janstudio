# JAN Studio ホームページ

このリポジトリは、JAN Studio（屋号：JAN）のシンプルな静的サイト雛形です。  
まず `index.html` のテキストを差し替えるだけで公開できます。

## まず決めたいこと（回答を教えてください）

1. 事業名の表記：`JAN` / `JAN Studio` / 併記の希望
2. 主力プロダクトの説明文（短く1行 + もう少し詳しく2〜3行）
   - メンタルマップ: https://mentalmap.app/
   - tottemi: https://tottemi.onrender.com
3. 画像素材：ロゴの有無、スクショ掲載可否、OGP画像の文言
4. お問い合わせ導線：メールのみ / フォーム / LINE / SNS（Instagram, X など）
5. 対応エリア、営業時間、料金目安（公開の有無）
6. ドメイン（例：`janstudio.jp`）と公開先（GitHub Pages / Netlify / さくら / etc）
7. 会社情報として載せる項目（住所、電話、適格請求書発行事業者番号 等）
8. トーン：シンプル / 高級感 / ポップ / ミニマル（参考サイトがあればURL）

## ローカルで確認

- ブラウザで `index.html` を直接開いてもOK
- 画像やOGPの確認をするなら簡易サーバがおすすめ：
  - `python3 -m http.server 8000`
  - `open http://localhost:8000`

## ファイル構成

- `index.html` トップ（1ページ完結）
- `styles.css` デザイン
- `main.js` ちょっとした動き（テーマ切替・年表示など）
- `assets/` アイコン等
- `robots.txt` / `sitemap.xml` 検索向け（ドメインは差し替え）

## 次の作業

README冒頭の「まず決めたいこと」に回答いただければ、原稿（文章）と構成を確定して、実績ページやお問い合わせフォームなど必要なページを追加します。

## 公開（例）

**GitHub Pages**
1. GitHubにpush
2. リポジトリ設定 → Pages → Branch（`main` / `/root`）を選択
3. 公開URLが発行されたら、`index.html` / `robots.txt` / `sitemap.xml` の `https://janstudio.app/` を実URLへ差し替え（ドメインが違う場合）
4. カスタムドメイン運用（`janstudio.app`）の場合は `Settings → Pages → Custom domain` に設定（本リポジトリは `CNAME` を同梱）

**DNS（apex ドメイン `janstudio.app` の例）**
- A: `185.199.108.153`
- A: `185.199.109.153`
- A: `185.199.110.153`
- A: `185.199.111.153`
- AAAA: `2606:50c0:8000::153`
- AAAA: `2606:50c0:8001::153`
- AAAA: `2606:50c0:8002::153`
- AAAA: `2606:50c0:8003::153`

**Netlify**
1. Netlifyで「New site from Git」
2. Buildコマンド無し（空）/ Publish directory はルート
3. 公開後、同様に `https://janstudio.app/` を差し替え（ドメインが違う場合）

## すでに反映済み

- お問い合わせメール：`contact@janstudio.app`
- SNS/運営者名の掲載：なし（現時点）
- サイトURL（OGP/サイトマップ）：`https://janstudio.app/`（違う場合は差し替え）
