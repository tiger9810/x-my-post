"use client";

import { Tweet } from "@/types/tweet";
import TweetItem from "./TweetItem";

interface TweetListProps {
    tweets: Tweet[];
    username: string;
    onDelete: (tweetId: string) => void;
    onRefresh: () => void;
    isLoading?: boolean;
    isRefreshing?: boolean;
    deletingTweetId?: string;
}

export default function TweetList({
    tweets,
    username,
    onDelete,
    onRefresh,
    isLoading,
    isRefreshing,
    deletingTweetId,
}: TweetListProps) {
    if (isLoading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with refresh button */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">あなたの投稿</h2>
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
                    {isRefreshing ? "更新中..." : "更新"}
                </button>
            </div>

            {/* Tweet list */}
            {tweets.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 mb-4">投稿を取得してください</p>
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRefreshing ? "取得中..." : "投稿を取得"}
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {tweets.map((tweet) => (
                        <TweetItem
                            key={tweet.id}
                            tweet={tweet}
                            username={username}
                            onDelete={onDelete}
                            isDeleting={deletingTweetId === tweet.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
