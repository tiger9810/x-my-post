import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TWITTER_API_BASE = "https://api.twitter.com/2";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (process.env.NODE_ENV === 'development') {
            console.log("Session in /api/twitter/create:", {
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

        const body = await request.json();
        const { text } = body;

        if (!text || !text.trim()) {
            return NextResponse.json(
                { error: "Tweet text is required" },
                { status: 400 }
            );
        }

        const url = `${TWITTER_API_BASE}/tweets`;

        if (process.env.NODE_ENV === 'development') {
            console.log("Creating tweet:", {
                url,
                textLength: text.length,
                hasAccessToken: !!session.accessToken
            });
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
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
                console.error("Twitter API error response:", JSON.stringify(error, null, 2));
            } else {
                console.error("Twitter API error:", response.status, error.title || error.detail);
            }
            return NextResponse.json(
                { error: error.detail || error.title || "Failed to create tweet" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in /api/twitter/create:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
