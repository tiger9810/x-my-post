"use client";

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">環境変数デバッグ</h1>
      <div className="space-y-2">
        <p>
          NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "未設定"}
        </p>
        <p>
          TWITTER_CLIENT_ID: {process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID ? "設定済み" : "未設定"}
        </p>
        <p>
          TWITTER_CLIENT_SECRET: {process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET ? "設定済み" : "未設定"}
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        注意: セキュリティのため、実際の値は表示していません。
      </p>
    </div>
  );
}