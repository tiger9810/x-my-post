# Vercel デプロイメントガイド

このガイドでは、x-my-posts アプリケーションを Vercel にデプロイする手順を説明します。

## 前提条件

- [x] GitHubリポジトリにコードがプッシュ済み
- [ ] Vercelアカウント（https://vercel.com）
- [ ] Twitter Developer アカウントとアプリ設定

---

## デプロイ手順

### 1. Vercel にサインアップ/ログイン

1. https://vercel.com にアクセス
2. "Sign Up" または "Log In" をクリック
3. GitHubアカウントで認証

### 2. プロジェクトをインポート

1. Vercel ダッシュボードで "Add New..." → "Project" をクリック
2. GitHubリポジトリ `tiger9810/x-my-post` を選択
3. "Import" をクリック

### 3. プロジェクト設定

**Framework Preset**: Next.js（自動検出されます）

**Root Directory**: `x-my-posts`（サブディレクトリの場合）

**Build Command**: `npm run build`（デフォルト）

**Output Directory**: `.next`（デフォルト）

### 4. 環境変数の設定

以下の環境変数を設定してください：

```bash
# NextAuth.js
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<openssl rand -base64 32 で生成>

# Twitter OAuth 2.0
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# アプリケーション設定
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**重要**: `NEXTAUTH_URL` は Vercel がデプロイ後に提供する URL に設定してください。

### 5. Twitter アプリの設定を更新

Twitter Developer Portal で以下を更新：

**Callback URL**:
```
https://your-app.vercel.app/api/auth/callback/twitter
```

**Website URL**:
```
https://your-app.vercel.app
```

### 6. デプロイ

"Deploy" ボタンをクリックすると、自動的にビルドとデプロイが開始されます。

---

## デプロイ後の確認

### 1. セキュリティヘッダの確認

ブラウザの DevTools → Network タブで以下のヘッダを確認：

- ✅ `Strict-Transport-Security`
- ✅ `X-Frame-Options`
- ✅ `X-Content-Type-Options`
- ✅ `Content-Security-Policy`

### 2. Cookie設定の確認

DevTools → Application → Cookies で以下を確認：

- ✅ `HttpOnly`: ✓
- ✅ `Secure`: ✓
- ✅ `SameSite`: Lax
- ✅ Cookie名: `__Host-next-auth.session-token`

### 3. OGPの確認

[Twitter Card Validator](https://cards-dev.twitter.com/validator) でURLを入力して確認。

### 4. 機能テスト

- [ ] ログイン/ログアウト
- [ ] ツイート投稿
- [ ] ツイート削除
- [ ] ツイート一覧表示

---

## 自動デプロイ設定

Vercel は GitHub と連携しているため、以下の動作が自動的に行われます：

- **main ブランチへのプッシュ**: 本番環境に自動デプロイ
- **プルリクエスト**: プレビュー環境を自動作成
- **コミットごと**: ビルドステータスを GitHub に通知

---

## カスタムドメインの設定（オプション）

### 1. ドメインを追加

1. Vercel ダッシュボード → Settings → Domains
2. カスタムドメインを入力
3. DNS設定の指示に従う

### 2. 環境変数を更新

```bash
NEXTAUTH_URL=https://your-custom-domain.com
NEXT_PUBLIC_BASE_URL=https://your-custom-domain.com
```

### 3. Twitter アプリの Callback URL を更新

```
https://your-custom-domain.com/api/auth/callback/twitter
```

---

## トラブルシューティング

### ビルドエラー

**エラー**: `Module not found`
**解決**: `package.json` の依存関係を確認し、`npm install` を実行

### 認証エラー

**エラー**: `Unauthorized` または `Invalid callback URL`
**解決**: 
1. Twitter Developer Portal の Callback URL を確認
2. `NEXTAUTH_URL` 環境変数を確認
3. `NEXTAUTH_SECRET` が設定されているか確認

### セキュリティヘッダが表示されない

**解決**: Vercel は `next.config.ts` の `headers()` を自動的に適用します。数分待ってからキャッシュをクリアして再確認してください。

---

## パフォーマンス最適化

Vercel は以下を自動的に提供します：

- ✅ **Edge Network**: 世界中のCDNから配信
- ✅ **Image Optimization**: 自動的に画像を最適化
- ✅ **Automatic HTTPS**: SSL証明書を自動発行
- ✅ **Serverless Functions**: API Routes を自動的に最適化

---

## モニタリング

### Analytics

Vercel ダッシュボード → Analytics でアクセス状況を確認できます。

### Logs

Vercel ダッシュボード → Logs でサーバーログを確認できます。

---

## コスト

**Hobby プラン（無料）**:
- 個人プロジェクトに最適
- 無制限のデプロイ
- 100GB 帯域幅/月
- Serverless Functions: 100GB-Hrs/月

**Pro プラン（$20/月）**:
- 商用プロジェクト向け
- カスタムドメイン無制限
- より多くの帯域幅とリソース

詳細: https://vercel.com/pricing

---

## 次のステップ

1. [ ] Vercel にデプロイ
2. [ ] 環境変数を設定
3. [ ] Twitter アプリの Callback URL を更新
4. [ ] 動作確認
5. [ ] カスタムドメインの設定（オプション）
6. [ ] Google Search Console にサイトマップを登録

---

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NextAuth.js with Vercel](https://next-auth.js.org/deployment)
