import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TWITTER_API_BASE = "https://api.twitter.com/2";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Debug logging (development only)
        if (process.env.NODE_ENV === 'development') {
            console.log("Session in /api/twitter/me:", {
                hasSession: !!session,
                hasAccessToken: !!session?.accessToken,
                sessionKeys: session ? Object.keys(session) : []
            });
        }

        if (!session?.accessToken) {
            if (process.env.NODE_ENV === 'development') {
                console.error("No access token in session");
            }
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = `${TWITTER_API_BASE}/users/me`;

        if (process.env.NODE_ENV === 'development') {
            console.log("Making request to Twitter API:", {
                url,
                hasAccessToken: !!session.accessToken
            });
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (process.env.NODE_ENV === 'development') {
            console.log("Twitter API response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
        }

        if (!response.ok) {
            const error = await response.json();

            if (process.env.NODE_ENV === 'development') {
                console.error("Twitter API error response:", error);
            } else {
                console.error("Twitter API error:", response.status, error.title || error.detail);
            }

            // レート制限エラーの場合
            if (response.status === 429) {
                console.error("Rate limit exceeded for user info API");
                return NextResponse.json(
                    {
                        error: "API制限に達しました。15分ほど待ってから再度お試しください。",
                        rateLimitExceeded: true
                    },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: error.detail || error.title || "Failed to fetch user info" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in /api/twitter/me:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
