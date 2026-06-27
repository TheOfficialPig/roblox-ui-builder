import { createElement } from '@/lib/core/defaults'
import type { ProjectDocument } from '@/lib/core/types'
import { udim, udim2Offset } from '@/lib/core/utils'
import {
  bg,
  box,
  btn,
  cx,
  cy,
  hudBar,
  panelInnerW,
  panelW,
  raised,
  screenPanel,
  slotGrid,
  title,
  txt,
  addChild,
  CANVAS_H,
  CANVAS_W,
} from './builder'
import {
  CATEGORY_LABELS,
  PAD,
  PALETTES,
  TEMPLATE_CATEGORIES,
  type TemplateCategory,
} from './styles'

export { CATEGORY_LABELS, TEMPLATE_CATEGORIES, type TemplateCategory }

const INNER = panelInnerW()

function build(
  name: string,
  category: TemplateCategory,
  buildUi: (root: string, els: Record<string, ReturnType<typeof createElement>>, p: typeof PALETTES.modern) => void,
): ProjectDocument {
  const screenGui = createElement('ScreenGui', { name: 'ScreenGui' })
  const elements: Record<string, ReturnType<typeof createElement>> = { [screenGui.id]: screenGui }
  buildUi(screenGui.id, elements, PALETTES[category])
  return {
    id: crypto.randomUUID(),
    name,
    elements,
    rootIds: [screenGui.id],
    devicePreview: 'desktop',
    theme: {
      name: PALETTES[category].fontTitle,
      primary: PALETTES[category].accent,
      secondary: PALETTES[category].raised,
      surface: PALETTES[category].panel,
      raised: PALETTES[category].raised,
      text: PALETTES[category].text,
      muted: PALETTES[category].muted,
      accent: PALETTES[category].accent,
      accent2: PALETTES[category].accent2,
      radius: PALETTES[category].radius,
      fontTitle: PALETTES[category].fontTitle,
      fontBody: PALETTES[category].fontBody,
    },
    components: [],
    assets: [],
    animations: [],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const TEMPLATE_CATALOG = [
  // ─── MODERN ───────────────────────────────────────────────
  {
    id: 'modern-menu',
    name: 'Main Menu',
    description: 'Centered desktop menu with play, shop, and settings',
    category: 'modern' as const,
    build: () =>
      build('Main Menu', 'modern', (root, els, p) => {
        bg(root, els, p)
        const cardW = 440
        const cardH = 480
        const card = box(root, els, p, 'MenuCard', cx(cardW), cy(cardH), cardW, cardH)
        const inner = cardW - PAD * 2
        title(card.id, els, p, 'MY GAME', PAD, 32, inner)
        txt(card.id, els, p, 'Subtitle', 'Select an option to continue', PAD, 78, inner, 24, {
          textSize: 14,
          textColor3: p.muted,
        })
        btn(card.id, els, p, 'Play', 'Play', PAD, 140, inner, 'success')
        btn(card.id, els, p, 'Shop', 'Shop', PAD, 208, inner, 'primary')
        btn(card.id, els, p, 'Settings', 'Settings', PAD, 276, inner, 'secondary')
      }),
  },
  {
    id: 'modern-shop',
    name: 'Shop',
    description: 'Wide shop grid with item cards and currency bar',
    category: 'modern' as const,
    build: () =>
      build('Shop', 'modern', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Shop', 28)
        title(panel.id, els, p, 'ITEM SHOP', PAD, PAD, 320)
        txt(panel.id, els, p, 'Coins', '💰 12,500', INNER - 180, PAD + 4, 160, 32, {
          font: p.fontTitle,
          textSize: 18,
        })
        const gap = 20
        const cardW = Math.floor((INNER - gap * 3) / 4)
        const cardH = 340
        for (let i = 0; i < 4; i++) {
          const card = raised(
            panel.id,
            els,
            p,
            `Item${i + 1}`,
            PAD + i * (cardW + gap),
            88,
            cardW,
            cardH,
          )
          raised(card.id, els, p, 'Thumb', 16, 16, cardW - 32, 180)
          txt(card.id, els, p, 'Name', `Item ${i + 1}`, 16, 210, cardW - 32, 24, {
            font: p.fontTitle,
            textSize: 16,
          })
          txt(card.id, els, p, 'Price', '1,250 coins', 16, 240, cardW - 32, 20, {
            textSize: 13,
            textColor3: p.muted,
          })
          btn(card.id, els, p, 'Buy', 'Buy', 16, 278, cardW - 32)
        }
      }),
  },
  {
    id: 'modern-inventory',
    name: 'Inventory',
    description: '40-slot inventory grid for desktop',
    category: 'modern' as const,
    build: () =>
      build('Inventory', 'modern', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Inventory', 36)
        title(panel.id, els, p, 'INVENTORY', PAD, PAD, 400)
        txt(panel.id, els, p, 'Count', '40 / 80 slots', INNER - 200, PAD + 4, 180, 28, {
          textSize: 14,
          textColor3: p.muted,
        })
        slotGrid(panel.id, els, p, 10, 88, 14, PAD, 72, 40)
      }),
  },
  {
    id: 'modern-settings',
    name: 'Settings',
    description: 'Full-width audio and graphics settings',
    category: 'modern' as const,
    build: () =>
      build('Settings', 'modern', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Settings', 48)
        title(panel.id, els, p, 'SETTINGS', PAD, PAD, 400)
        ;['Music', 'Sound Effects', 'Graphics', 'Fullscreen'].forEach((label, i) => {
          const row = raised(panel.id, els, p, label.replace(' ', ''), PAD, 72 + i * 72, INNER, 56)
          txt(row.id, els, p, 'Label', label, 20, 0, 400, 56, { font: p.fontTitle, textSize: 18 })
          box(row.id, els, p, 'Toggle', INNER - 88, 14, 56, 28, { backgroundColor3: p.accent })
        })
      }),
  },

  // ─── RETRO ───────────────────────────────────────────────
  {
    id: 'retro-menu',
    name: 'Arcade Menu',
    description: 'Retro arcade title screen for desktop',
    category: 'retro' as const,
    build: () =>
      build('Arcade Menu', 'retro', (root, els, p) => {
        bg(root, els, p)
        txt(root, els, p, 'CoinLabel', 'COINS: 99', cx(240), 48, 240, 32, {
          font: p.fontTitle,
          textSize: 22,
          textColor3: p.accent,
        })
        title(root, els, p, 'ARCADE GAME', cx(520), 160, 520)
        txt(root, els, p, 'Insert', 'INSERT COIN', cx(280), 215, 280, 28, {
          textSize: 16,
          textColor3: p.muted,
        })
        const btnW = 360
        btn(root, els, p, 'Start', 'START', cx(btnW), 280, btnW, 'success')
        btn(root, els, p, 'Scores', 'HIGH SCORES', cx(btnW), 350, btnW, 'primary')
        btn(root, els, p, 'Exit', 'EXIT', cx(btnW), 420, btnW, 'secondary')
      }),
  },
  {
    id: 'retro-leaderboard',
    name: 'Leaderboard',
    description: 'Wide high-score table with top 5 players',
    category: 'retro' as const,
    build: () =>
      build('Leaderboard', 'retro', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Leaderboard', 40)
        title(panel.id, els, p, 'HIGH SCORES', PAD, PAD, 480)
        const names = ['AAA', 'YOU', 'BOT', 'ACE', 'PRO']
        const scores = ['99999', '84200', '71000', '65000', '52000']
        names.forEach((n, i) => {
          const row = raised(panel.id, els, p, `Row${i + 1}`, PAD, 64 + i * 64, INNER, 52)
          txt(row.id, els, p, 'Rank', `${i + 1}. ${n}`, 20, 0, 500, 52, { font: p.fontTitle, textSize: 18 })
          txt(row.id, els, p, 'Score', scores[i], INNER - 200, 0, 180, 52, {
            font: p.fontTitle,
            textSize: 18,
            textColor3: p.accent,
          })
        })
      }),
  },
  {
    id: 'retro-dialog',
    name: 'Dialog Box',
    description: 'Bottom NPC dialog bar across the screen',
    category: 'retro' as const,
    build: () =>
      build('Dialog Box', 'retro', (root, els, p) => {
        bg(root, els, p)
        const dialogH = 180
        const dialog = box(root, els, p, 'Dialog', PAD, CANVAS_H - dialogH - PAD, panelW(), dialogH)
        const inner = panelW() - PAD * 2
        txt(dialog.id, els, p, 'Speaker', 'NPC:', PAD, 16, 120, 24, {
          font: p.fontTitle,
          textSize: 16,
          textColor3: p.accent,
        })
        txt(
          dialog.id,
          els,
          p,
          'Text',
          'Welcome, hero! The kingdom needs your help. Press continue to begin your quest.',
          PAD,
          48,
          inner - 160,
          72,
          { textWrapped: true, textSize: 16 },
        )
        btn(dialog.id, els, p, 'Continue', 'CONTINUE', inner - 160, dialogH - PAD - 52, 160)
      }),
  },
  {
    id: 'retro-pause',
    name: 'Pause Menu',
    description: 'Centered pause overlay for desktop',
    category: 'retro' as const,
    build: () =>
      build('Pause Menu', 'retro', (root, els, p) => {
        addChild(
          root,
          els,
          createElement('Frame', {
            name: 'Overlay',
            size: udim(1, 0, 1, 0),
            backgroundColor3: p.bg,
            backgroundTransparency: 0.4,
          }),
        )
        const menuW = 400
        const menuH = 400
        const menu = box(root, els, p, 'PauseMenu', cx(menuW), cy(menuH), menuW, menuH)
        const inner = menuW - PAD * 2
        title(menu.id, els, p, 'PAUSED', PAD, 32, inner)
        btn(menu.id, els, p, 'Resume', 'RESUME', PAD, 110, inner, 'success')
        btn(menu.id, els, p, 'Settings', 'SETTINGS', PAD, 180, inner, 'primary')
        btn(menu.id, els, p, 'Quit', 'QUIT', PAD, 250, inner, 'secondary')
      }),
  },

  // ─── PIXEL ───────────────────────────────────────────────
  {
    id: 'pixel-menu',
    name: 'Pixel Menu',
    description: '8-bit style desktop main menu',
    category: 'pixel' as const,
    build: () =>
      build('Pixel Menu', 'pixel', (root, els, p) => {
        bg(root, els, p)
        title(root, els, p, 'PIXEL QUEST', cx(480), 200, 480)
        txt(root, els, p, 'Sub', 'v1.0', cx(120), 250, 120, 24, { textSize: 14, textColor3: p.muted })
        const btnW = 320
        btn(root, els, p, 'Play', 'PLAY', cx(btnW), 320, btnW, 'success')
        btn(root, els, p, 'Load', 'LOAD', cx(btnW), 390, btnW, 'primary')
        btn(root, els, p, 'Quit', 'QUIT', cx(btnW), 460, btnW, 'secondary')
      }),
  },
  {
    id: 'pixel-hud',
    name: 'Pixel HUD',
    description: 'Desktop health bar, mana, and coin counter',
    category: 'pixel' as const,
    build: () =>
      build('Pixel HUD', 'pixel', (root, els, p) => {
        bg(root, els, p)
        txt(root, els, p, 'HPLabel', 'HP', PAD, 24, 40, 24, { font: p.fontTitle, textSize: 14 })
        hudBar(root, els, p, 'HealthBar', 72, 22, 360, 0.75, p.accent2)
        txt(root, els, p, 'HPVal', '75/100', 448, 22, 100, 28, { font: p.fontTitle, textSize: 14 })
        txt(root, els, p, 'MPLabel', 'MP', PAD, 60, 40, 24, { font: p.fontTitle, textSize: 14 })
        hudBar(root, els, p, 'ManaBar', 72, 58, 360, 0.5, p.accent)
        raised(root, els, p, 'Coins', CANVAS_W - PAD - 200, 20, 200, 36)
        txt(root, els, p, 'CoinText', 'G 12,500', CANVAS_W - PAD - 192, 24, 184, 28, {
          font: p.fontTitle,
          textSize: 14,
        })
        txt(root, els, p, 'Hint', 'HUD — overlay on gameplay', cx(400), CANVAS_H - 56, 400, 24, {
          textSize: 12,
          textColor3: p.muted,
        })
      }),
  },
  {
    id: 'pixel-inventory',
    name: 'Pixel Inventory',
    description: '32-slot pixel item grid',
    category: 'pixel' as const,
    build: () =>
      build('Pixel Inventory', 'pixel', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Inventory', 36)
        title(panel.id, els, p, 'ITEMS', PAD, PAD, 300)
        slotGrid(panel.id, els, p, 8, 80, 12, PAD, 64, 32)
      }),
  },
  {
    id: 'pixel-gameover',
    name: 'Game Over',
    description: 'Centered game over screen',
    category: 'pixel' as const,
    build: () =>
      build('Game Over', 'pixel', (root, els, p) => {
        bg(root, els, p)
        title(root, els, p, 'GAME OVER', cx(480), cy(240) - 50, 480)
        txt(root, els, p, 'Score', 'SCORE: 42,800', cx(320), cy(240) + 10, 320, 32, {
          font: p.fontTitle,
          textSize: 20,
          textColor3: p.accent,
        })
        const btnW = 280
        btn(root, els, p, 'Retry', 'RETRY', cx(btnW), cy(240) + 70, btnW, 'primary')
        btn(root, els, p, 'Menu', 'MENU', cx(btnW), cy(240) + 140, btnW, 'secondary')
      }),
  },

  // ─── LOW POLY ───────────────────────────────────────────
  {
    id: 'lowpoly-menu',
    name: 'Low Poly Menu',
    description: 'Soft flat desktop menu with geometric style',
    category: 'lowpoly' as const,
    build: () =>
      build('Low Poly Menu', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const cardW = 480
        const cardH = 420
        const card = box(root, els, p, 'MenuCard', cx(cardW), cy(cardH), cardW, cardH)
        const inner = cardW - PAD * 2
        title(card.id, els, p, 'Adventure', PAD, 36, inner)
        txt(card.id, els, p, 'Sub', 'Choose your path', PAD, 82, inner, 24, {
          textSize: 14,
          textColor3: p.muted,
        })
        btn(card.id, els, p, 'Play', 'Play', PAD, 130, inner, 'primary')
        btn(card.id, els, p, 'World', 'World Map', PAD, 198, inner, 'secondary')
        btn(card.id, els, p, 'Settings', 'Settings', PAD, 266, inner, 'secondary')
      }),
  },
  {
    id: 'lowpoly-stats',
    name: 'Character Stats',
    description: 'Wide RPG stat sheet panel',
    category: 'lowpoly' as const,
    build: () =>
      build('Character Stats', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Stats', 48)
        title(panel.id, els, p, 'CHARACTER', PAD, PAD, 400)
        txt(panel.id, els, p, 'Level', 'Level 12 · Knight', PAD, 56, 400, 24, {
          textSize: 14,
          textColor3: p.muted,
        })
        ;['Health', 'Strength', 'Defense', 'Speed', 'Luck'].forEach((stat, i) => {
          const row = raised(panel.id, els, p, stat, PAD, 96 + i * 64, INNER, 52)
          txt(row.id, els, p, 'Val', `${stat}: ${50 + i * 10}`, 20, 0, INNER - 40, 52, { textSize: 16 })
        })
      }),
  },
  {
    id: 'lowpoly-quests',
    name: 'Quest Log',
    description: 'Three-column quest cards with progress',
    category: 'lowpoly' as const,
    build: () =>
      build('Quest Log', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Quests', 40)
        title(panel.id, els, p, 'QUESTS', PAD, PAD, 300)
        const quests = [
          ['Find the Crystal', '0 / 1'],
          ['Defeat 5 Wolves', '3 / 5'],
          ['Talk to Elder', 'Complete'],
        ]
        const gap = 20
        const cardW = Math.floor((INNER - gap * 2) / 3)
        quests.forEach(([q, prog], i) => {
          const card = raised(panel.id, els, p, `Quest${i + 1}`, PAD + i * (cardW + gap), 64, cardW, 200)
          txt(card.id, els, p, 'Name', q, 16, 20, cardW - 32, 28, { font: p.fontTitle, textSize: 16 })
          txt(card.id, els, p, 'Prog', prog, 16, 56, cardW - 32, 24, {
            textSize: 14,
            textColor3: prog === 'Complete' ? p.accent2 : p.muted,
          })
        })
      }),
  },
  {
    id: 'lowpoly-daily',
    name: 'Daily Rewards',
    description: '7-day reward calendar across the screen',
    category: 'lowpoly' as const,
    build: () =>
      build('Daily Rewards', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'DailyRewards', 48)
        title(panel.id, els, p, 'DAILY REWARDS', PAD, PAD, 480)
        txt(panel.id, els, p, 'Streak', 'Day 3 streak — keep it up!', PAD, 56, 400, 24, {
          textSize: 14,
          textColor3: p.muted,
        })
        const gap = 12
        const dayW = Math.floor((INNER - gap * 6) / 7)
        for (let i = 0; i < 7; i++) {
          const day = raised(panel.id, els, p, `Day${i + 1}`, PAD + i * (dayW + gap), 100, dayW, 120)
          txt(day.id, els, p, 'Num', `Day ${i + 1}`, 0, 12, dayW, 20, {
            textSize: 12,
            textColor3: p.muted,
            font: p.fontTitle,
          })
          txt(day.id, els, p, 'Icon', i === 2 ? '✓' : '★', 0, 52, dayW, 48, { textSize: 24 })
        }
        btn(panel.id, els, p, 'Claim', 'Claim Reward', PAD, 230, INNER)
      }),
  },
] as const

export type TemplateId = (typeof TEMPLATE_CATALOG)[number]['id']

export function getTemplate(id: TemplateId): ProjectDocument {
  const t = TEMPLATE_CATALOG.find((x) => x.id === id)
  if (!t) throw new Error(`Template not found: ${id}`)
  return t.build()
}
