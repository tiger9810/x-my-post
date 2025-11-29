import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0", // X API v2を使用
            authorization: {
                params: {
                    scope: "users.read tweet.read tweet.write offline.access",
                },
            },
        }),
    ],
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                // Domain is intentionally not set to ensure cookies are only sent to the exact domain
            }
        },
        callbackUrl: {
            name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        },
        csrfToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        },
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            // 初回ログイン時にアクセストークンを保存
            if (account) {
                token.accessToken = account.access_token as string | undefined;
                token.refreshToken = account.refresh_token as string | undefined;
                token.accessTokenSecret = account.access_token_secret as string | undefined;
            }
            return token;
        },
        async session({ session, token }) {
            // セッションにアクセストークンを追加
            if (token.accessToken) {
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin", // カスタムサインインページ（オプション）
    },
    debug: process.env.NODE_ENV === "development", // 開発環境でデバッグを有効化
};
