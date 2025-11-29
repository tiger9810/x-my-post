"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Tweet } from "@/types/tweet";
import { getUserTweets, getMe, createTweet, deleteTweet } from "@/lib/twitter-api";
import { getCache, setCache, clearCache } from "@/lib/storage";
import TweetList from "@/components/TweetList";
import TweetComposer from "@/components/TweetComposer";

const TWEETS_CACHE_KEY = "user-tweets";
const USER_INFO_CACHE_KEY = "user-info";

export default function Home() {
  const { data: session, status } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [userInfo, setUserInfo] = useState<{ id: string; username: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingTweetId, setDeletingTweetId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user info
  const fetchUserInfo = useCallback(async () => {
    try {
      // Check cache first
      const cachedUserInfo = getCache<{ id: string; username: string; name: string }>(USER_INFO_CACHE_KEY);
      if (cachedUserInfo) {
        setUserInfo(cachedUserInfo);
        return cachedUserInfo;
      }

      // Fetch from API
      const info = await getMe();
      setUserInfo(info);
      setCache(USER_INFO_CACHE_KEY, info);
      return info;
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setError("ユーザー情報の取得に失敗しました");
      return null;
    }
  }, []);

  // Fetch tweets
  const fetchTweets = useCallback(async (userId: string, useCache = true) => {
    try {
      // Check cache first if allowed
      if (useCache) {
        const cachedTweets = getCache<Tweet[]>(TWEETS_CACHE_KEY);
        if (cachedTweets) {
          setTweets(cachedTweets);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      const fetchedTweets = await getUserTweets(userId, 5);
      setTweets(fetchedTweets);
      setCache(TWEETS_CACHE_KEY, fetchedTweets);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
      setError("投稿の取得に失敗しました");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (session) {
      const loadData = async () => {
        await fetchUserInfo();
        setIsLoading(false);
      };
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [session, fetchUserInfo]);

  // Refresh tweets
  const handleRefresh = async () => {
    if (!session || !userInfo) return;

    setIsRefreshing(true);
    clearCache(TWEETS_CACHE_KEY);
    await fetchTweets(userInfo.id, false);
  };

  // Create tweet
  const handleCreateTweet = async (text: string) => {
    if (!session) {
      throw new Error("認証が必要です");
    }

    await createTweet(text);
  };

  // Handle tweet created
  const handleTweetCreated = () => {
    // Show success message
    setSuccessMessage("投稿が完了しました！");
    setError(null);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
    
    // 投稿後の自動更新は削除（API制限を避けるため）
    // ユーザーが手動で更新ボタンを押すことで最新のツイートを取得できます
  };

  // Delete tweet
  const handleDeleteTweet = async (tweetId: string) => {
    if (!session) return;

    setDeletingTweetId(tweetId);
    try {
      await deleteTweet(tweetId);

      // Remove from local state
      setTweets((prev) => prev.filter((t) => t.id !== tweetId));

      // Update cache
      const updatedTweets = tweets.filter((t) => t.id !== tweetId);
      setCache(TWEETS_CACHE_KEY, updatedTweets);

      setError(null);
    } catch (err) {
      console.error("Failed to delete tweet:", err);
      setError("投稿の削除に失敗しました");
    } finally {
      setDeletingTweetId(undefined);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">X Only Posts</h1>
            <p className="text-gray-600">自分の投稿に集中できるシンプルなXクライアント</p>
          </div>
          <button
            onClick={() => signIn("twitter")}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
          >
            X (Twitter) でサインイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">X My Posts</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">@{userInfo?.username || session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              サインアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Success message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-400 hover:text-green-600"
                aria-label="成功メッセージを閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Tweet composer */}
        <TweetComposer
          onTweetCreated={handleTweetCreated}
          onCreateTweet={handleCreateTweet}
        />

        {/* Tweet list */}
        <TweetList
          tweets={tweets}
          username={userInfo?.username || ""}
          onDelete={handleDeleteTweet}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          deletingTweetId={deletingTweetId}
        />
      </main>
    </div>
  );
}