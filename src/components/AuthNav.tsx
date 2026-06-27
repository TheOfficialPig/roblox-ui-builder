'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function AuthNav({ variant = 'dark' }: { variant?: 'dark' | 'studio' }) {
  const { status } = useSession()
  const isAuthed = status === 'authenticated'

  const loginClass =
    variant === 'dark'
      ? 'rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white'
      : 'rounded-lg px-3 py-1.5 text-sm text-studio-muted hover:bg-studio-hover hover:text-white'

  const primaryClass =
    variant === 'dark'
      ? 'rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#07070b] transition hover:bg-white/90'
      : 'rounded-lg bg-studio-accent px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-studio-accent/20 transition hover:bg-studio-accent-hover'

  const dashboardClass =
    variant === 'dark'
      ? 'rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/5'
      : 'rounded-lg border border-studio-border px-3 py-1.5 text-sm text-studio-muted transition hover:border-studio-accent/40 hover:text-white'

  if (status === 'loading') {
    return <div className="h-9 w-28 animate-pulse rounded-lg bg-white/5" />
  }

  if (isAuthed) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className={dashboardClass}>
          Dashboard
        </Link>
        <Link href="/dashboard" className={primaryClass}>
          My projects
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={loginClass}>
        Log in
      </Link>
      <Link href="/signup" className={primaryClass}>
        Get started
      </Link>
    </div>
  )
}
