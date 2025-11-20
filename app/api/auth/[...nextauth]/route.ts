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