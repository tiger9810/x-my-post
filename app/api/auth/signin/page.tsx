"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>読み込み中...</div>;
  }

  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">ようこそ、{session.user?.name}さん</h1>
          <p className="text-gray-600">@{session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            サインアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">X (Twitter) でサインインしてください</h1>
        <button
          onClick={() => signIn("twitter")}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          サインイン
        </button>
      </div>
    </div>
  );
}