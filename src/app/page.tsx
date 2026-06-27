'use client'

import Link from 'next/link'
import { ArrowRight, Layers, Sparkles, Download, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-auto bg-[#0d0d0f]">
      <nav className="flex items-center justify-between border-b border-white/10 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0078d4]">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Roblox UI Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm text-gray-300 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[#0078d4] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a86d9]"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-8 py-20">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0078d4]/30 bg-[#0078d4]/10 px-4 py-1.5 text-sm text-[#5eb3ff]">
            <Sparkles className="h-4 w-4" />
            Design Roblox UIs without Studio
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white">
            Build Roblox interfaces
            <br />
            <span className="text-[#0078d4]">visually</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
            A professional Figma-like editor for Roblox GUI. Drag, resize, and customize
            ScreenGuis, Frames, TextButtons, and more — then export to Lua, PNG layers, or JSON.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0078d4] px-6 py-3 font-medium text-white transition hover:bg-[#1a86d9]"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/5"
            >
              Start from scratch
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: 'Visual Editor',
              desc: 'Infinite canvas, smart snapping, alignment guides, multi-select, undo/redo, and device previews.',
            },
            {
              icon: Download,
              title: 'Triple Export',
              desc: 'Export production-ready Lua scripts, transparent PNG layers, or JSON for a future Studio plugin.',
            },
            {
              icon: Zap,
              title: '17+ Templates',
              desc: 'Start fast with Main Menu, Inventory, Shop, Health Bar, Leaderboard, and more built-in templates.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <Icon className="mb-4 h-8 w-8 text-[#0078d4]" />
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
