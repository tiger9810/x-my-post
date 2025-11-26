# 本番環境設定ガイド

## 概要

このガイドでは、X My Postsアプリケーションを本番環境（Vercel）にデプロイする手順を説明します。

---

## 前提条件

- [x] セキュリティ修正が完了していること
- [x] 本番ビルドが成功すること（`npm run build`）
- [ ] GitHubアカウントを持っていること
- [ ] Vercelアカウントを持っていること（無料）
- [ ] Twitter Developer Portalへのアクセス権があること

---

## 1. 環境変数の準備

### 1.1 NEXTAUTH_SECRETの生成

本番環境用の新しいシークレットを生成します：

```bash
openssl rand -base64 32
```

出力された文字列を控えておきます。

### 1.2 環境変数リスト

以下の環境変数が必要です：

```bash
# Twitter API Credentials
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here

# NextAuth.js Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_production_secret_here
```

**重要**: 
- `NEXTAUTH_URL`は実際のVercelのURLに置き換えてください
- `NEXTAUTH_SECRET`は開発環境とは**別の値**を使用してください

---

## 2. Twitter Developer Portalの設定

### 2.1 本番URLの追加

1. [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)にアクセス
2. アプリを選択
3. **「Settings」**タブ → **「User authentication settings」** → **「Edit」**

### 2.2 Callback URLの追加

**既存のローカル開発用URLは残したまま**、本番URLを追加します：

**「+ Add another URI / URL」**をクリックして追加：

```
https://your-app-name.vercel.app/api/auth/callback/twitter
```

**重要**: 
- `your-app-name`を実際のVercelアプリ名に置き換えてください
- ローカル開発用のURL（`http://localhost:3000/...`）は削除しないでください

### 2.3 Website URLの更新

```
https://your-app-name.vercel.app
```

### 2.4 設定の確認

以下が正しく設定されているか確認：

- [ ] **App permissions**: `Read and Write`
- [ ] **Type of App**: `Web App, Automated App or Bot`
- [ ] **Callback URLs**: ローカルと本番の両方が登録されている
- [ ] **Website URL**: 本番URLが設定されている

---

## 3. GitHubリポジトリの準備

### 3.1 リポジトリの作成

1. [GitHub](https://github.com)で新しいリポジトリを作成
2. リポジトリ名: `x-my-posts`（任意）
3. **Private**を選択（推奨）

### 3.2 コードのプッシュ

プロジェクトディレクトリで以下を実行：

```bash
# Gitの初期化（まだの場合）
git init

# .gitignoreの確認
# .env.localが含まれていることを確認

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit: X My Posts application"

# リモートリポジトリを追加
git remote add origin https://github.com/your-username/x-my-posts.git

# プッシュ
git branch -M main
git push -u origin main
```

**重要**: `.env.local`がコミットされていないことを確認してください！

```bash
# 確認方法
git status

# .env.localが表示されていないことを確認
```

---

## 4. Vercelへのデプロイ

### 4.1 Vercelアカウントの作成

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでサインアップ

### 4.2 プロジェクトのインポート

1. Vercelダッシュボードで **「Add New...」** → **「Project」**をクリック
2. GitHubリポジトリを選択（`x-my-posts`）
3. **「Import」**をクリック

### 4.3 環境変数の設定

**「Environment Variables」**セクションで以下を設定：

| Name | Value |
|------|-------|
| `TWITTER_CLIENT_ID` | Twitter Developer Portalから取得したClient ID |
| `TWITTER_CLIENT_SECRET` | Twitter Developer Portalから取得したClient Secret |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` |
| `NEXTAUTH_SECRET` | 手順1.1で生成したシークレット |

**設定方法**:
1. 「Name」に変数名を入力
2. 「Value」に値を入力
3. 「Add」をクリック
4. すべての環境変数を追加

### 4.4 デプロイの実行

1. すべての設定を確認
2. **「Deploy」**をクリック
3. デプロイが完了するまで待つ（通常1-2分）

---

## 5. デプロイ後の確認

### 5.1 URLの確認

デプロイが完了すると、VercelがURLを表示します：

```
https://your-app-name.vercel.app
```

このURLを控えておきます。

### 5.2 Twitter Developer Portalの更新

**重要**: Vercelから実際のURLが発行されたら、Twitter Developer Portalの設定を更新します：

1. Callback URLを実際のURLに更新：
   ```
   https://actual-vercel-url.vercel.app/api/auth/callback/twitter
   ```

2. Website URLを実際のURLに更新：
   ```
   https://actual-vercel-url.vercel.app
   ```

### 5.3 動作確認

1. 本番URLにアクセス
2. 「X (Twitter) でサインイン」をクリック
3. Twitter認証画面が表示されることを確認
4. 認証を承認
5. アプリにリダイレクトされることを確認
6. ツイートを投稿してみる
7. ツイートが正常に投稿されることを確認

### 5.4 ログの確認

Vercelダッシュボードで：

1. プロジェクトを選択
2. **「Logs」**タブをクリック
3. デバッグログ（`console.log`）が**出力されていない**ことを確認
4. エラーログ（`console.error`）のみが表示されることを確認
5. **機密情報（アクセストークンなど）が含まれていない**ことを確認

---

## 6. トラブルシューティング

### 問題1: 認証が失敗する

**症状**: サインインボタンをクリックしても認証画面が表示されない

**確認事項**:
- [ ] Twitter Developer PortalのCallback URLが正しいか
- [ ] Vercelの環境変数が正しく設定されているか
- [ ] `NEXTAUTH_URL`が実際のVercelのURLと一致しているか

**解決方法**:
1. Vercelダッシュボード → **「Settings」** → **「Environment Variables」**
2. すべての環境変数を確認
3. 間違っている場合は修正して再デプロイ

### 問題2: ツイート投稿が403エラーになる

**症状**: ツイートを投稿しようとすると403 Forbiddenエラーが発生

**確認事項**:
- [ ] Twitter Developer PortalのApp permissionsが「Read and Write」になっているか
- [ ] 権限変更後に再サインインしたか

**解決方法**:
1. Twitter Developer Portalで権限を確認
2. アプリでサインアウト
3. 再度サインイン

### 問題3: デバッグログが表示される

**症状**: Vercelのログにデバッグ情報が表示される

**確認事項**:
- [ ] `NODE_ENV`が`production`になっているか

**解決方法**:
Vercelは自動的に`NODE_ENV=production`を設定するため、通常この問題は発生しません。もし発生した場合は、コードを確認してください。

### 問題4: 環境変数が反映されない

**症状**: 環境変数を変更したが反映されない

**解決方法**:
1. Vercelダッシュボード → **「Deployments」**
2. **「Redeploy」**をクリック
3. 環境変数の変更は再デプロイが必要です

---

## 7. カスタムドメインの設定（オプション）

### 7.1 ドメインの追加

1. Vercelダッシュボード → **「Settings」** → **「Domains」**
2. カスタムドメインを入力（例: `my-x-app.com`）
3. DNSレコードを設定（Vercelが指示を表示）

### 7.2 Twitter Developer Portalの更新

カスタムドメインを設定した場合、Twitter Developer Portalも更新：

**Callback URL**:
```
https://my-x-app.com/api/auth/callback/twitter
```

**Website URL**:
```
https://my-x-app.com
```

### 7.3 環境変数の更新

Vercelの環境変数も更新：

```bash
NEXTAUTH_URL=https://my-x-app.com
```

再デプロイを実行してください。

---

## 8. 継続的デプロイ

Vercelは自動的に継続的デプロイを設定します：

- `main`ブランチにプッシュすると自動的に本番環境にデプロイ
- プルリクエストを作成すると自動的にプレビュー環境を作成

### 8.1 開発ワークフロー

```bash
# 新機能の開発
git checkout -b feature/new-feature

# コードを変更
# ...

# コミット
git add .
git commit -m "Add new feature"

# プッシュ
git push origin feature/new-feature

# GitHubでプルリクエストを作成
# Vercelが自動的にプレビュー環境を作成

# レビュー後、mainブランチにマージ
# Vercelが自動的に本番環境にデプロイ
```

---

## 9. モニタリング

### 9.1 Vercel Analytics

1. Vercelダッシュボード → **「Analytics」**
2. ページビュー、パフォーマンスなどを確認

### 9.2 エラーモニタリング

1. Vercelダッシュボード → **「Logs」**
2. エラーログを定期的に確認
3. 異常なエラーがないかチェック

---

## 10. セキュリティチェックリスト

デプロイ後、以下を確認してください：

- [ ] HTTPSで接続されている
- [ ] デバッグログが出力されていない
- [ ] 機密情報（APIキー、トークン）が漏洩していない
- [ ] 環境変数が正しく設定されている
- [ ] Twitter Developer Portalの設定が正しい
- [ ] 認証フローが正常に動作する
- [ ] ツイートの投稿・削除が正常に動作する

---

## まとめ

このガイドに従うことで、X My Postsアプリケーションを安全に本番環境にデプロイできます。

**重要なポイント**:
1. 環境変数は本番環境用の値を使用
2. Twitter Developer Portalに本番URLを追加
3. デバッグログが出力されていないことを確認
4. 機密情報が漏洩していないことを確認

ご質問や問題がある場合は、DEPLOYMENT_SOW.mdのトラブルシューティングセクションを参照してください。

Happy Deploying! 🚀
