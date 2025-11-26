"use client";

import { useState } from "react";
import { validateTweetText } from "@/lib/utils";
import TweetPreview from "./TweetPreview";

interface TweetComposerProps {
    onTweetCreated: () => void;
    onCreateTweet: (text: string) => Promise<void>;
}

export default function TweetComposer({
    onTweetCreated,
    onCreateTweet,
}: TweetComposerProps) {
    const [text, setText] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const characterCount = text.length;
    const remainingCharacters = 280 - characterCount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateTweetText(text);
        if (!validation.isValid) {
            setError(validation.error || null);
            return;
        }

        setError(null);
        setShowPreview(true);
    };

    const handleConfirmPost = async () => {
        setIsPosting(true);
        setError(null);

        try {
            await onCreateTweet(text);
            setText("");
            setShowPreview(false);
            onTweetCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "投稿に失敗しました");
            setShowPreview(false);
        } finally {
            setIsPosting(false);
        }
    };

    const handleCancelPreview = () => {
        setShowPreview(false);
    };

    return (
        <>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="今何してる?"
                        className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isPosting}
                    />

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <div className="flex items-center justify-between">
                        <span
                            className={`text-sm ${remainingCharacters < 0
                                    ? "text-red-500 font-bold"
                                    : remainingCharacters < 20
                                        ? "text-orange-500"
                                        : "text-gray-500"
                                }`}
                        >
                            {remainingCharacters < 0 && "-"}
                            {Math.abs(remainingCharacters)} / 280
                        </span>

                        <button
                            type="submit"
                            disabled={!text.trim() || remainingCharacters < 0 || isPosting}
                            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            投稿する
                        </button>
                    </div>
                </form>
            </div>

            {showPreview && (
                <TweetPreview
                    text={text}
                    onConfirm={handleConfirmPost}
                    onCancel={handleCancelPreview}
                    isPosting={isPosting}
                />
            )}
        </>
    );
}
