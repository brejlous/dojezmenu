import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            Last<span className="text-brand">Bite</span>
          </span>
          <span className="text-xs text-gray-400 font-medium ml-1 mt-0.5">by piano</span>
        </Link>
        <Link
          href="/restaurace/dashboard"
          className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
        >
          Pro restaurace →
        </Link>
      </div>
    </header>
  )
}
