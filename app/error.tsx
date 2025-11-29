'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="space-y-6 text-center px-4">
                <h1 className="text-6xl font-bold text-gray-900">500</h1>
                <h2 className="text-2xl font-semibold text-gray-700">エラーが発生しました</h2>
                <p className="text-gray-600">申し訳ございません。問題が発生しました。</p>
                <button
                    onClick={reset}
                    className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
                >
                    もう一度試す
                </button>
            </div>
        </div>
    )
}
