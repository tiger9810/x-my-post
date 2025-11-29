# セキュリティ改善実装ガイド

このドキュメントは、x-my-postsアプリケーションに実装したセキュリティ改善の概要と、残りの手動タスクをまとめたものです。

## ✅ 実装済みの改善

### 1. セキュリティヘッダ（Critical）
**ファイル**: `next.config.ts`

以下のセキュリティヘッダを追加しました:
- **HSTS**: HTTPS接続を1年間強制
- **X-Frame-Options**: クリックジャッキング防止
- **X-Content-Type-Options**: MIMEスニッフィング防止
- **CSP**: XSS攻撃のリスク軽減
- **Referrer-Policy**: プライバシー保護
- **Permissions-Policy**: 不要なブラウザ機能を無効化

### 2. Cookie設定の明示化（Critical）
**ファイル**: `lib/auth.ts`

NextAuth.jsのCookie設定を明示的に指定:
- **HttpOnly**: XSS緩和
- **SameSite=lax**: CSRF防止
- **Secure**: HTTPS接続のみ（本番環境）
- **__Host- prefix**: Domain属性の上書き防止（本番環境）

### 3. OGPメタタグ（Medium）
**ファイル**: `app/layout.tsx`

Twitter/Facebook等でのシェア時に適切な情報を表示するためのOGPタグを追加しました。

### 4. SEO最適化（Medium）
**新規ファイル**:
- `app/sitemap.ts`: XMLサイトマップ
- `app/robots.ts`: robots.txt設定

### 5. カスタムエラーページ（Low）
**新規ファイル**:
- `app/not-found.tsx`: 404ページ
- `app/error.tsx`: 500エラーページ

---

## 📋 残りの手動タスク

### 1. 環境変数の設定（必須）

`.env.local` ファイルに以下を追加してください:

```bash
# NextAuth.js用のシークレット（必須）
# 以下のコマンドで生成できます: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here

# 本番環境のベースURL（OGP、サイトマップ用）
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 2. apple-touch-icon の追加（推奨）

1. 180x180pxのアイコン画像を作成
2. `app/apple-icon.png` として配置

### 3. 本番デプロイ前の確認

- [ ] HTTPS接続が有効になっているか確認
- [ ] ブラウザDevToolsでセキュリティヘッダを確認
- [ ] Cookieの属性（Secure, __Host-）を確認
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)でOGPを確認

---

## 🧪 ビルド検証結果

```bash
npm run build
```

✅ **成功** - すべてのルートが正常にビルドされました。

---

## 📊 セキュリティ改善サマリー

| カテゴリ | 実装前 | 実装後 |
|---------|--------|--------|
| セキュリティヘッダ | ❌ 0/6 | ✅ 6/6 |
| Cookie設定 | ⚠️ 暗黙的 | ✅ 明示的・安全 |
| OGP | ❌ 0/5 | ✅ 5/5 |
| SEO | ⚠️ 基本のみ | ✅ 最適化済み |

---

## 🚀 次のステップ

1. 環境変数（`NEXTAUTH_SECRET`、`NEXT_PUBLIC_BASE_URL`）を設定
2. apple-touch-iconを作成・配置
3. 本番環境でセキュリティヘッダとCookieを確認
4. Google Search Consoleにサイトマップを登録

詳細は `walkthrough.md` を参照してください。
