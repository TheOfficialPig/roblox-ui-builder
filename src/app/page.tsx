'use client'

import Link from 'next/link'
import { ArrowRight, Code2, Layers, Play, Smartphone } from 'lucide-react'
import { HomeHeroMockup } from '@/components/marketing/HomeHeroMockup'

const TEMPLATES = [
  'Main Menu',
  'Inventory',
  'Shop',
  'Daily Rewards',
  'Leaderboard',
  'Health HUD',
  'Settings',
  'Dialog Box',
]

const BENTO = [
  {
    title: 'Drag anything',
    body: 'Frames, labels, buttons, scrolling lists — with snap guides and multi-select.',
    span: 'md:col-span-2',
    accent: 'from-violet-600/20 to-transparent',
  },
  {
    title: 'Device previews',
    body: 'Phone, tablet, desktop — design once, check every screen.',
    span: '',
    accent: 'from-cyan-600/15 to-transparent',
  },
  {
    title: 'Export to Lua',
    body: 'Paste straight into Studio. No manual property copying.',
    span: '',
    accent: 'from-emerald-600/15 to-transparent',
  },
  {
    title: 'PNG layers + JSON',
    body: 'Asset packs for artists, structured data for plugins.',
    span: 'md:col-span-2',
    accent: 'from-rose-600/15 to-transparent',
  },
]

export default function HomePage() {
  return (
    <div className="page-scroll min-h-screen bg-[#07070b] text-studio-text">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="landing-orb absolute -left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[100px]" />
        <div className="landing-orb-delayed absolute -right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-rose-600/8 blur-[80px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#07070b]">
              <Layers className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-white">
              UI Builder
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#templates" className="transition hover:text-white">
              Templates
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#07070b] transition hover:bg-white/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — asymmetric */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pt-24">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            Roblox GUI · visual editor
          </p>
          <h1 className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Ship game menus
            <br />
            <span className="text-white/40">without opening</span>
            <br />
            Studio.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/50">
            Lay out ScreenGuis in a real canvas — snap, resize, preview on phone
            and desktop — then drop the Lua into your game.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#07070b] transition hover:bg-white/90"
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/5"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Try the editor
            </Link>
          </div>
          <dl className="mt-12 flex gap-10 border-t border-white/5 pt-8">
            <div>
              <dt className="font-display text-2xl font-bold text-white">17+</dt>
              <dd className="mt-0.5 text-xs text-white/40">starter templates</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-bold text-white">3</dt>
              <dd className="mt-0.5 text-xs text-white/40">export formats</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-bold text-white">0</dt>
              <dd className="mt-0.5 text-xs text-white/40">plugins required</dd>
            </div>
          </dl>
        </div>

        <HomeHeroMockup />
      </section>

      {/* Template ticker */}
      <section id="templates" className="overflow-hidden border-y border-white/5 bg-white/[0.02] py-4">
        <div className="landing-ticker flex gap-8 whitespace-nowrap">
          {[...TEMPLATES, ...TEMPLATES].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-2 text-sm text-white/30"
            >
              <span className="h-1 w-1 rounded-full bg-studio-accent/60" />
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Bento features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display mb-3 text-2xl font-bold text-white">
          Everything you need to mock up GUIs
        </h2>
        <p className="mb-10 max-w-lg text-white/45">
          Not a generic design tool — built around Roblox instances, properties,
          and export paths.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {BENTO.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-white/15 ${item.span}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition group-hover:opacity-100`}
              />
              <h3 className="relative font-display text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-white/45">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-t border-white/5 bg-[#0a0a10] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display mb-12 text-center text-2xl font-bold text-white">
            Design → Export → Ship
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Smartphone,
                title: 'Design on canvas',
                desc: 'Place elements on a device frame. Explorer, properties, undo — like a lightweight Studio.',
              },
              {
                step: '02',
                icon: Code2,
                title: 'Export Lua',
                desc: 'Get a script that recreates your hierarchy with correct UDim2, colors, and fonts.',
              },
              {
                step: '03',
                icon: Layers,
                title: 'Paste in game',
                desc: 'Drop into ServerScriptService or a LocalScript. Your UI is live.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center md:text-left">
                <span className="font-mono text-xs text-studio-accent">{item.step}</span>
                <div className="mx-auto mt-3 mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:mx-0">
                  <item.icon className="h-5 w-5 text-white/70" />
                </div>
                <h3 className="font-display font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1530] to-[#0e0e16] px-8 py-14 text-center md:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-studio-accent/20 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold text-white">
            Your next main menu is one session away.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/45">
            Free to start. Projects save to your account.
          </p>
          <Link
            href="/signup"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#07070b] transition hover:bg-white/90"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/30">
        Roblox UI Builder — not affiliated with Roblox Corporation.
      </footer>
    </div>
  )
}
