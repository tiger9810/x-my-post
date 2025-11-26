// Utility functions

/**
 * Format date to relative time (e.g., "3分前", "2時間前")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}秒前`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}分前`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}時間前`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}日前`;
    }

    // More than a week, show formatted date
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format number with K/M suffix (e.g., 1.2K, 3.5M)
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Get tweet URL
 */
export function getTweetUrl(username: string, tweetId: string): string {
    return `https://twitter.com/${username}/status/${tweetId}`;
}

/**
 * Count characters in tweet (accounting for URLs and special characters)
 */
export function countTweetCharacters(text: string): number {
    // Simple character count for now
    // X counts URLs as 23 characters regardless of length
    // This is a simplified version
    return text.length;
}

/**
 * Validate tweet text
 */
export function validateTweetText(text: string): {
    isValid: boolean;
    error?: string;
} {
    if (!text.trim()) {
        return { isValid: false, error: '投稿内容を入力してください' };
    }

    if (text.length > 280) {
        return { isValid: false, error: '280文字を超えています' };
    }

    return { isValid: true };
}
