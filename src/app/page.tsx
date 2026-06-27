'use client'

import Link from 'next/link'
import { ArrowRight, Layers, Sparkles, Download, Zap, Box } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="page-scroll min-h-screen bg-studio-bg">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-studio-accent/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl" />
      </div>

      <nav className="relative flex items-center justify-between border-b border-studio-border px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-studio-accent to-purple-400 shadow-lg shadow-studio-accent/30">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Roblox UI Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-studio-muted transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-studio-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-studio-accent/25 transition hover:bg-studio-accent-hover"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="relative mx-auto max-w-6xl px-8 py-20">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-studio-accent/30 bg-studio-accent/10 px-4 py-1.5 text-sm text-purple-300">
            <Sparkles className="h-4 w-4" />
            Design Roblox UIs without Studio
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Build Roblox interfaces
            <br />
            <span className="bg-gradient-to-r from-studio-accent to-purple-300 bg-clip-text text-transparent">
              visually
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-studio-muted">
            A professional Figma-like editor for Roblox GUI. Drag, resize, and customize
            ScreenGuis, Frames, TextButtons, and more — then export to Lua, PNG layers, or JSON.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-studio-accent px-6 py-3 font-medium text-white shadow-xl shadow-studio-accent/25 transition hover:bg-studio-accent-hover"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 rounded-xl border border-studio-border bg-studio-panel px-6 py-3 font-medium text-white transition hover:border-studio-accent/50 hover:bg-studio-elevated"
            >
              Start from scratch
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Box,
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
              className="rounded-2xl border border-studio-border bg-studio-panel/80 p-6 backdrop-blur transition hover:border-studio-accent/40 hover:shadow-lg hover:shadow-studio-accent/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-studio-accent/15">
                <Icon className="h-5 w-5 text-studio-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-studio-muted">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
