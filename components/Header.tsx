import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥡</span>
          <span className="font-bold text-lg text-gray-900">
            Dojez<span className="text-green-600">Menu</span>
          </span>
        </Link>
        <Link
          href="/restaurace/dashboard"
          className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
        >
          Pro restaurace →
        </Link>
      </div>
    </header>
  )
}
