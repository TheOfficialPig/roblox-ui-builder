'use client'

/** Miniature editor preview — pure CSS, no screenshots */
export function HomeHeroMockup() {
  return (
    <div className="landing-mockup relative mx-auto w-full max-w-[520px]">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-studio-accent/20 via-transparent to-rose-500/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e16] shadow-2xl shadow-black/60">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#12121c] px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-[10px] text-white/40">MainMenu.rbxui — Roblox UI Builder</span>
        </div>

        <div className="flex h-[340px]">
          {/* Explorer */}
          <div className="w-[110px] shrink-0 border-r border-white/5 bg-[#101018] p-2">
            <div className="mb-2 text-[8px] font-semibold uppercase tracking-widest text-white/25">
              Explorer
            </div>
            {[
              { name: 'ScreenGui', indent: 0, active: false },
              { name: 'MainFrame', indent: 1, active: true },
              { name: 'TitleBar', indent: 2, active: false },
              { name: 'PlayBtn', indent: 2, active: false },
              { name: 'ShopBtn', indent: 2, active: false },
            ].map((row) => (
              <div
                key={row.name}
                className={`mb-0.5 truncate rounded px-1.5 py-0.5 text-[9px] ${
                  row.active ? 'bg-studio-accent/25 text-purple-200' : 'text-white/45'
                }`}
                style={{ paddingLeft: 6 + row.indent * 8 }}
              >
                {row.name}
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div className="relative flex-1 bg-[#08080e] p-4">
            <div className="canvas-grid absolute inset-0 opacity-40" style={{ backgroundSize: '16px 16px' }} />

            {/* Phone frame */}
            <div className="relative mx-auto mt-2 h-[260px] w-[148px] rounded-xl border border-white/10 bg-[#050508] shadow-inner">
              {/* Mock UI inside phone */}
              <div className="absolute inset-2 overflow-hidden rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#0d0d14]">
                {/* Top bar */}
                <div className="flex items-center justify-between bg-black/30 px-2 py-1.5">
                  <div className="h-1.5 w-10 rounded-full bg-white/20" />
                  <div className="text-[6px] font-bold tracking-wider text-white/60">GAME TITLE</div>
                  <div className="h-4 w-4 rounded bg-white/10" />
                </div>

                {/* Hero panel */}
                <div className="mx-2 mt-3 rounded-md bg-[#2d2d44]/80 p-2 ring-1 ring-white/5">
                  <div className="mb-1.5 h-1.5 w-16 rounded bg-white/30" />
                  <div className="h-1 w-24 rounded bg-white/15" />
                </div>

                {/* Buttons row */}
                <div className="mx-2 mt-3 flex flex-col gap-1.5">
                  <div className="flex h-6 items-center justify-center rounded-md bg-[#00b06f] text-[7px] font-bold text-white shadow-[0_2px_0_#008c58]">
                    PLAY
                  </div>
                  <div className="flex h-6 items-center justify-center rounded-md bg-[#335fff] text-[7px] font-bold text-white shadow-[0_2px_0_#2244cc]">
                    SHOP
                  </div>
                  <div className="flex h-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-[7px] font-medium text-white/70">
                    Settings
                  </div>
                </div>

                {/* Health bar */}
                <div className="absolute bottom-3 left-2 right-2">
                  <div className="mb-0.5 text-[5px] text-white/40">HP</div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
                  </div>
                </div>
              </div>

              {/* Selection handles on Play button area */}
              <div className="pointer-events-none absolute left-[18px] top-[108px] h-[26px] w-[108px] rounded border border-studio-accent shadow-[0_0_0_1px_rgba(124,92,252,0.3)]">
                <span className="absolute -left-1 -top-1 h-2 w-2 rounded-sm border border-studio-accent bg-white" />
                <span className="absolute -right-1 -bottom-1 h-2 w-2 rounded-sm border border-studio-accent bg-white" />
              </div>
            </div>
          </div>

          {/* Properties peek */}
          <div className="hidden w-[90px] shrink-0 border-l border-white/5 bg-[#101018] p-2 sm:block">
            <div className="mb-2 text-[8px] font-semibold uppercase tracking-widest text-white/25">
              Props
            </div>
            <div className="space-y-1.5">
              {['Size', 'Color', 'Text', 'Font'].map((l) => (
                <div key={l}>
                  <div className="mb-0.5 text-[7px] text-white/30">{l}</div>
                  <div className="h-3 rounded bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating export chip */}
      <div className="landing-float-chip absolute -bottom-3 -left-2 flex items-center gap-2 rounded-xl border border-white/10 bg-[#16161f] px-3 py-2 shadow-xl">
        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">.lua</span>
        <span className="text-[10px] text-white/60">exported in 1 click</span>
      </div>

      <div className="landing-float-chip-delayed absolute -right-1 top-8 flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#16161f] px-2.5 py-1.5 shadow-xl">
        <span className="text-[10px] text-white/50">390 × 844</span>
        <span className="rounded bg-studio-accent/20 px-1 text-[9px] text-purple-300">Phone</span>
      </div>
    </div>
  )
}
