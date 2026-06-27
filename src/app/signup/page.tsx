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
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e]">
      <div className="w-full max-w-sm rounded-lg border border-[#3c3c3c] bg-[#252526] p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Layers className="h-6 w-6 text-[#0078d4]" />
          <span className="text-lg font-semibold text-white">Roblox UI Builder</span>
        </div>
        <h1 className="mb-6 text-center text-xl font-semibold text-white">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-3 py-2 text-sm text-white focus:border-[#0078d4] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-3 py-2 text-sm text-white focus:border-[#0078d4] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-3 py-2 text-sm text-white focus:border-[#0078d4] focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#0078d4] py-2 text-sm font-medium text-white hover:bg-[#1a86d9] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0078d4] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
