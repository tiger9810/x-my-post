"use client";

import { Tweet } from "@/types/tweet";
import { formatRelativeTime, formatNumber, getTweetUrl } from "@/lib/utils";

interface TweetItemProps {
    tweet: Tweet;
    username: string;
    onDelete: (tweetId: string) => void;
    isDeleting?: boolean;
}

export default function TweetItem({ tweet, username, onDelete, isDeleting }: TweetItemProps) {
    const handleDelete = () => {
        if (window.confirm("この投稿を削除しますか?")) {
            onDelete(tweet.id);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="space-y-3">
                {/* Tweet text */}
                <p className="text-gray-900 whitespace-pre-wrap break-words">
                    {tweet.text}
                </p>

                {/* Tweet metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        {/* Time */}
                        <span>{formatRelativeTime(tweet.created_at)}</span>

                        {/* Metrics */}
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <span>❤️</span>
                                {formatNumber(tweet.public_metrics.like_count)}
                            </span>
                            <span className="flex items-center gap-1">
                                <span>🔁</span>
                                {formatNumber(tweet.public_metrics.retweet_count)}
                            </span>
                            <span className="flex items-center gap-1">
                                <span>💬</span>
                                {formatNumber(tweet.public_metrics.reply_count)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "削除中..." : "削除"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
