"use client";

interface TweetPreviewProps {
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
    isPosting?: boolean;
}

export default function TweetPreview({
    text,
    onConfirm,
    onCancel,
    isPosting,
}: TweetPreviewProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-xl w-full p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">投稿内容の確認</h3>

                {/* Preview */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-gray-900 whitespace-pre-wrap break-words">
                        {text}
                    </p>
                </div>

                <p className="text-sm text-gray-500">
                    この内容で投稿しますか?
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isPosting}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPosting}
                        className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPosting ? "投稿中..." : "投稿する"}
                    </button>
                </div>
            </div>
        </div>
    );
}
