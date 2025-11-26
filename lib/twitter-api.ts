// X API client for interacting with Twitter API v2 via Next.js API routes

import { Tweet, TwitterAPIResponse, CreateTweetResponse, DeleteTweetResponse } from '@/types/tweet';

/**
 * Fetch user's own tweets via Next.js API route
 */
export async function getUserTweets(
    userId: string,
    maxResults: number = 5
): Promise<Tweet[]> {
    try {
        const url = `/api/twitter/tweets?userId=${userId}&maxResults=${maxResults}`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch tweets');
        }

        const data: TwitterAPIResponse = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }
}

/**
 * Get authenticated user's information via Next.js API route
 */
export async function getMe(): Promise<{ id: string; username: string; name: string }> {
    try {
        const url = `/api/twitter/me`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch user info');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

/**
 * Create a new tweet via Next.js API route
 */
export async function createTweet(
    text: string
): Promise<CreateTweetResponse> {
    try {
        const url = `/api/twitter/create`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create tweet');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
}

/**
 * Delete a tweet via Next.js API route
 */
export async function deleteTweet(
    tweetId: string
): Promise<boolean> {
    try {
        const url = `/api/twitter/delete/${tweetId}`;

        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete tweet');
        }

        const data: DeleteTweetResponse = await response.json();
        return data.data.deleted;
    } catch (error) {
        console.error('Error deleting tweet:', error);
        throw error;
    }
}
