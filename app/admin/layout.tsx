import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/restaurace/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/restaurace/dashboard')

  return (
    <div>
      <div className="bg-gray-900 text-white -mx-4 -mt-6 px-4 py-3 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">Last<span className="text-brand">Bite</span></span>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-gray-300 hover:text-white">Přehled</Link>
          <Link href="/admin/restaurace" className="text-gray-300 hover:text-white">Restaurace</Link>
          <Link href="/admin/nabidky" className="text-gray-300 hover:text-white">Nabídky</Link>
          <Link href="/admin/rezervace" className="text-gray-300 hover:text-white">Rezervace</Link>
          <form action={logout}>
            <button type="submit" className="text-gray-400 hover:text-white">Odhlásit</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  )
}
