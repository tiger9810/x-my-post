import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="space-y-6 text-center px-4">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">ページが見つかりません</h2>
                <p className="text-gray-600">お探しのページは存在しないか、移動した可能性があります。</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
                >
                    ホームに戻る
                </Link>
            </div>
        </div>
    )
}
