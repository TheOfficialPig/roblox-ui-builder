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
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e]">
      <div className="w-full max-w-sm rounded-lg border border-[#3c3c3c] bg-[#252526] p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Layers className="h-6 w-6 text-[#0078d4]" />
          <span className="text-lg font-semibold text-white">Roblox UI Builder</span>
        </div>
        <h1 className="mb-6 text-center text-xl font-semibold text-white">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          Projects are saved to your Supabase account.
        </p>
        <p className="mt-4 text-center text-sm text-gray-400">
          No account?{' '}
          <Link href="/signup" className="text-[#0078d4] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
