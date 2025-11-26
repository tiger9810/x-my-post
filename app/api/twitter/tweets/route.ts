import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TWITTER_API_BASE = "https://api.twitter.com/2";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const maxResults = searchParams.get("maxResults") || "5";

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const url = `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics,author_id`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.json();

            // レート制限エラーの場合
            if (response.status === 429) {
                // X APIのレート制限ヘッダーを取得
                const rateLimitLimit = response.headers.get('x-rate-limit-limit');
                const rateLimitRemaining = response.headers.get('x-rate-limit-remaining');
                const rateLimitReset = response.headers.get('x-rate-limit-reset');

                console.error("Rate limit exceeded for tweets API", {
                    limit: rateLimitLimit,
                    remaining: rateLimitRemaining,
                    reset: rateLimitReset,
                    resetTime: rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toISOString() : 'unknown'
                });

                const resetTime = rateLimitReset ? parseInt(rateLimitReset) : Math.floor(Date.now() / 1000) + 900;
                const waitSeconds = Math.max(0, resetTime - Math.floor(Date.now() / 1000));
                const waitMinutes = Math.ceil(waitSeconds / 60);

                return NextResponse.json(
                    {
                        error: `API制限に達しました。約${waitMinutes}分後に再度お試しください。`,
                        rateLimitExceeded: true,
                        retryAfter: waitSeconds,
                        resetTime: new Date(resetTime * 1000).toISOString()
                    },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: error.detail || error.title || "Failed to fetch tweets" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in /api/twitter/tweets:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
