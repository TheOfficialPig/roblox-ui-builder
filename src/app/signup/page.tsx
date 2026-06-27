'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layers } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Signup failed')
      setLoading(false)
      return
    }

    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    if (signInResult?.error) {
      router.push('/login')
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
        <h1 className="mb-6 text-center text-xl font-semibold text-white">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-studio-muted">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-studio-border bg-studio-input px-3 py-2 text-sm text-white focus:border-studio-accent focus:outline-none focus:ring-1 focus:ring-studio-accent/30"
              required
            />
          </div>
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
              minLength={8}
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
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-studio-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-studio-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
