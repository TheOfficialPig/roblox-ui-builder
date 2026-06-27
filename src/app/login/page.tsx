'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layers } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="page-scroll flex min-h-screen items-center justify-center bg-studio-bg">
      <div className="w-full max-w-sm rounded-2xl border border-studio-border bg-studio-panel p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-studio-accent">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Roblox UI Builder</span>
        </div>
        <h1 className="mb-6 text-center text-xl font-semibold text-white">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-studio-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-studio-border bg-studio-input px-3 py-2 text-sm text-white focus:border-studio-accent focus:outline-none focus:ring-1 focus:ring-studio-accent/30"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-studio-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-studio-border bg-studio-input px-3 py-2 text-sm text-white focus:border-studio-accent focus:outline-none focus:ring-1 focus:ring-studio-accent/30"
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-studio-accent py-2.5 text-sm font-medium text-white shadow-lg shadow-studio-accent/20 transition hover:bg-studio-accent-hover disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-studio-muted">
          Projects are saved to your account.
        </p>
        <p className="mt-4 text-center text-sm text-studio-muted">
          No account?{' '}
          <Link href="/signup" className="text-studio-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
