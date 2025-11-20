# X (Twitter) 認証統合ガイド

このガイドでは、Next.jsアプリケーションにX (Twitter) 認証を統合する手順を説明します。

## 前提条件

- Node.js がインストールされていること
- X (Twitter) アカウントを持っていること
- X Developer Portal へのアクセス権限があること

---

## ステップ1: NextAuth のインストール

プロジェクトディレクトリに移動して、NextAuthをインストールします。

```bash
cd x-my-posts
npm install next-auth
```

**注意**: 既に `package.json` に `next-auth` が含まれている場合は、このステップはスキップできます。

---

## ステップ2: X Developer Portal でアプリ登録（15-20分）

### 作業内容

1. **X Developer Portal にアクセス**
   - https://developer.twitter.com/en/portal/dashboard にアクセス

2. **アカウント作成またはログイン**
   - 「Sign up for Free Account」または既存アカウントでログイン

3. **アプリを作成**
   - 「Projects & Apps」→「+ Create App」をクリック
  
4. **アプリ情報を入力**
   - アプリ名を入力（例: "MyPostsViewer"）

5. **App settings を設定**
   - **App permissions**: Read and write（読み書き権限）
   - **Type of App**: Web App
   - **Callback URLs**: `http://localhost:3000/api/auth/callback/twitter`
   - **Website URL**: 以下のいずれかの方法を使用してください：
     - **方法1（推奨）**: `http://127.0.0.1:3000` を使用（`localhost`の代わりにIPアドレスを使用）
     - **方法2**: 開発用の公開URLを使用（例：ngrokを使用して `https://xxxx-xxxx-xxxx.ngrok.io` を取得）
     - **方法3**: 一時的に本番環境のURLを設定（開発中は使用しない）
   
   **注意**: X Developer Portalでは `localhost` のURLが無効と判定される場合があります。その場合は `127.0.0.1` を使用するか、開発用の公開URLを設定してください。

6. **認証情報をメモ**
   - 以下の情報を安全な場所に保存してください：
     ```
     Client ID: xxxxxxxxxxxxx
     Client Secret: xxxxxxxxxxxxx
     ```

**重要**: Client Secretは一度しか表示されないため、必ずメモしてください。

---

## ステップ3: 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の環境変数を設定します。

```bash
# .env.local

# NextAuth設定
# 注意: X Developer Portalで127.0.0.1を使用する場合は、こちらも127.0.0.1に変更してください
NEXTAUTH_URL=http://localhost:3000
# または
# NEXTAUTH_URL=http://127.0.0.1:3000

NEXTAUTH_SECRET=your-secret-key-here

# X (Twitter) OAuth設定
TWITTER_CLIENT_ID=your-client-id-here
TWITTER_CLIENT_SECRET=your-client-secret-here
```

**重要**: X Developer PortalのWebsite URLで `127.0.0.1` を使用する場合は、`NEXTAUTH_URL` も `http://127.0.0.1:3000` に変更してください。両方の設定を一致させる必要があります。

### NEXTAUTH_SECRET の生成と確認方法

`NEXTAUTH_SECRET` は既存の値を確認するものではなく、**新しく生成する必要があります**。以下のいずれかの方法でランダムなシークレットキーを生成してください：

#### 方法1: OpenSSLを使用（推奨）

```bash
openssl rand -base64 32
```

#### 方法2: Node.jsを使用

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 方法3: オンラインツールを使用

- [RandomKeygen](https://randomkeygen.com/) などのオンラインツールを使用して、32バイト以上のランダムな文字列を生成

#### 生成したシークレットの確認

生成されたシークレットキーは、`.env.local` ファイルで確認できます：

```bash
# .env.localファイルを開く
cat .env.local

# または、エディタで開く
code .env.local  # VS Codeの場合
```

`.env.local` ファイル内の `NEXTAUTH_SECRET=` の後に、生成した値が設定されていることを確認してください。

**例**:
```bash
NEXTAUTH_SECRET=abc123xyz456...（生成された32文字以上のランダムな文字列）
```

**注意**: 
- `.env.local` ファイルは `.gitignore` に含まれていることを確認してください（Gitにコミットしないように）
- シークレットキーは機密情報のため、他人と共有しないでください
- 本番環境では、環境変数として設定することを推奨します（Vercel、Netlifyなどのホスティングサービスでは環境変数として設定可能）

---

## ステップ4: NextAuth API ルートの作成

`app/api/auth/[...nextauth]/route.ts` ファイルを作成し、NextAuthの設定を行います。

```typescript
// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // X API v2を使用
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // 初回ログイン時にアクセストークンを保存
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenSecret = account.access_token_secret;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにアクセストークンを追加
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // カスタムサインインページ（オプション）
  },
  debug: process.env.NODE_ENV === "development", // 開発環境でデバッグを有効化
});

export { handler as GET, handler as POST };
```

### TypeScript型定義の拡張

`types/next-auth.d.ts` ファイルを作成して、セッションとトークンの型を拡張します。

```typescript
// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenSecret?: string;
  }
}
```

---

## ステップ5: SessionProvider の設定

`app/layout.tsx` を更新して、SessionProviderでアプリケーションをラップします。

```typescript
// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X My Posts",
  description: "X (Twitter) 投稿ビューアー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

**注意**: Next.js 13+ のApp Routerでは、SessionProviderをクライアントコンポーネントとして作成する必要があります。`components/SessionProvider.tsx` を作成してください。

```typescript
// components/SessionProvider.tsx

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

そして、`app/layout.tsx` で使用：

```typescript
import SessionProvider from "@/components/SessionProvider";

// ... 中略 ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

---

## ステップ6: 認証ページの作成

### サインインページ（オプション）

`app/auth/signin/page.tsx` を作成して、カスタムサインインページを実装します。

```typescript
// app/auth/signin/page.tsx

"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            X (Twitter) でサインイン
          </h2>
        </div>
        <div>
          <button
            onClick={() => signIn("twitter")}
            className="group relative flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            サインイン
          </button>
        </div>
      </div>
    </div>
  );
}
```

### ホームページでの認証状態の確認

`app/page.tsx` を更新して、認証状態を表示します。

```typescript
// app/page.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>読み込み中...</div>;
  }

  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">ようこそ、{session.user?.name}さん</h1>
          <p className="text-gray-600">@{session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            サインアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">X (Twitter) でサインインしてください</h1>
        <button
          onClick={() => signIn("twitter")}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          サインイン
        </button>
      </div>
    </div>
  );
}
```

---

## ステップ7: デバッグ方法

### 1. 環境変数の確認

環境変数が正しく設定されているか確認します。

```typescript
// app/debug/page.tsx（開発用、本番環境では削除）

"use client";

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">環境変数デバッグ</h1>
      <div className="space-y-2">
        <p>
          NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "未設定"}
        </p>
        <p>
          TWITTER_CLIENT_ID: {process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID ? "設定済み" : "未設定"}
        </p>
        <p>
          TWITTER_CLIENT_SECRET: {process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET ? "設定済み" : "未設定"}
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        注意: セキュリティのため、実際の値は表示していません。
      </p>
    </div>
  );
}
```

**注意**: クライアント側で環境変数を参照する場合は、`NEXT_PUBLIC_` プレフィックスが必要です。ただし、機密情報（Client Secretなど）はクライアント側に公開しないでください。

### 2. NextAuth デバッグモードの有効化

`app/api/auth/[...nextauth]/route.ts` で `debug: process.env.NODE_ENV === "development"` を設定すると、開発環境でのみ詳細なログが出力されます。

```typescript
const handler = NextAuth({
  // ... 他の設定 ...
  debug: process.env.NODE_ENV === "development", // 開発環境でデバッグを有効化
});
```

**推奨設定の理由**:
- `debug: true` にすると本番環境でもデバッグログが出力され、セキュリティリスクやパフォーマンスの問題が発生する可能性があります
- `process.env.NODE_ENV === "development"` を使用することで、開発環境でのみデバッグが有効になり、本番環境では自動的に無効になります
- これにより、開発時のトラブルシューティングと本番環境のセキュリティの両方を確保できます

### 3. ブラウザの開発者ツールで確認

- **Network タブ**: `/api/auth/signin` や `/api/auth/callback/twitter` へのリクエストを確認
- **Application タブ**: Cookies に `next-auth.session-token` が設定されているか確認
- **Console タブ**: JavaScriptエラーがないか確認

### 4. サーバーログの確認

開発サーバーを起動して、コンソールにエラーメッセージが表示されていないか確認します。

```bash
npm run dev
```

### 5. よくあるエラーと対処法

#### エラー: "Invalid callback URL"

**原因**: X Developer Portalで設定したCallback URLと一致していない

**対処法**:
- Callback URLが `http://localhost:3000/api/auth/callback/twitter` と正確に一致しているか確認
- プロトコル（http/https）が正しいか確認

#### エラー: "Invalid client credentials"

**原因**: Client IDまたはClient Secretが間違っている

**対処法**:
- `.env.local` の `TWITTER_CLIENT_ID` と `TWITTER_CLIENT_SECRET` を確認
- 値に余分なスペースや改行が含まれていないか確認
- X Developer Portalで新しい認証情報を生成して再設定

#### エラー: "NEXTAUTH_SECRET is not set"

**原因**: NEXTAUTH_SECRET環境変数が設定されていない

**対処法**:
- `.env.local` に `NEXTAUTH_SECRET` を追加
- 開発サーバーを再起動

#### エラー: "SessionProvider is not configured"

**原因**: SessionProviderでアプリケーションがラップされていない

**対処法**:
- `app/layout.tsx` でSessionProviderが正しく設定されているか確認
- クライアントコンポーネントとして作成されているか確認（`"use client"` ディレクティブ）

### 6. 認証フローの確認

以下の手順で認証フローを確認します：

1. アプリケーションにアクセス
2. 「サインイン」ボタンをクリック
3. X (Twitter) の認証ページにリダイレクトされることを確認
4. Xアカウントでログイン
5. アプリケーションに戻り、認証状態が保持されていることを確認

---

## ステップ8: 動作確認

### 確認項目

- [ ] NextAuthがインストールされている
- [ ] X Developer Portalでアプリが作成されている
- [ ] `.env.local` に必要な環境変数が設定されている
- [ ] NextAuth APIルートが作成されている
- [ ] SessionProviderが設定されている
- [ ] サインインページが動作する
- [ ] 認証後にセッションが保持される
- [ ] サインアウトが動作する

### テスト手順

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. ブラウザで `http://localhost:3000` にアクセス

3. 「サインイン」ボタンをクリック

4. X (Twitter) の認証ページでログイン

5. 認証後、アプリケーションに戻り、ユーザー情報が表示されることを確認

6. 「サインアウト」ボタンをクリックして、ログアウトできることを確認

---

## 次のステップ

認証が正常に動作したら、以下の機能を実装できます：

- X APIを使用した投稿の取得
- 投稿の表示とフィルタリング
- 投稿の作成・編集・削除
- ユーザープロフィールの表示

---

## 参考リンク

- [NextAuth.js 公式ドキュメント](https://next-auth.js.org/)
- [X API ドキュメント](https://developer.twitter.com/en/docs)
- [Next.js 公式ドキュメント](https://nextjs.org/docs)

---

## トラブルシューティング

問題が発生した場合は、以下を確認してください：

1. 環境変数が正しく設定されているか
2. X Developer Portalの設定が正しいか
3. Callback URLが正確に一致しているか
4. 開発サーバーが再起動されているか
5. ブラウザのキャッシュをクリアして再試行

### Website URLが無効と表示される場合

X Developer Portalで `http://localhost:3000` を入力すると「無効なウェブサイトURL」と表示される場合があります。以下の対処法を試してください：

**対処法1: IPアドレスを使用**
- `http://localhost:3000` の代わりに `http://127.0.0.1:3000` を使用してください
- Callback URLも `http://127.0.0.1:3000/api/auth/callback/twitter` に変更してください

**対処法2: ngrokを使用して公開URLを取得**
1. ngrokをインストール: `npm install -g ngrok` または [ngrok公式サイト](https://ngrok.com/)からダウンロード
2. 開発サーバーを起動: `npm run dev`
3. 別のターミナルでngrokを起動: `ngrok http 3000`
4. 表示された `https://xxxx-xxxx-xxxx.ngrok.io` をWebsite URLとCallback URLに設定
5. Callback URLは `https://xxxx-xxxx-xxxx.ngrok.io/api/auth/callback/twitter` に設定

**対処法3: 一時的に本番URLを使用**
- 本番環境のURLを設定（開発中は使用しない）
- デプロイ後に実際のURLに変更

それでも解決しない場合は、NextAuthのデバッグモードを有効にして、詳細なログを確認してください。

