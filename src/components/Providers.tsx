'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchOnWindowFocus
      refetchInterval={5 * 60}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}
