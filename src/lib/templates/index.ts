import { createElement } from '@/lib/core/defaults'
import type { ProjectDocument } from '@/lib/core/types'
import { udim, udim2Offset } from '@/lib/core/utils'
import {
  bg,
  box,
  btn,
  cx,
  hudBar,
  raised,
  screenPanel,
  slotGrid,
  title,
  txt,
  addChild,
} from './builder'
import {
  CATEGORY_LABELS,
  PAD,
  PALETTES,
  PHONE_H,
  PHONE_W,
  TEMPLATE_CATEGORIES,
  type TemplateCategory,
} from './styles'

export { CATEGORY_LABELS, TEMPLATE_CATEGORIES, type TemplateCategory }

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
    devicePreview: 'phone',
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
    description: 'Centered menu with play, shop, and settings',
    category: 'modern' as const,
    build: () =>
      build('Main Menu', 'modern', (root, els, p) => {
        bg(root, els, p)
        const card = box(root, els, p, 'MenuCard', cx(320), 200, 320, 400)
        title(card.id, els, p, 'MY GAME', PAD, 24, 320 - PAD * 2)
        txt(card.id, els, p, 'Subtitle', 'Tap a button to start', PAD, 58, 288, 20, {
          textSize: 12,
          textColor3: p.muted,
        })
        btn(card.id, els, p, 'Play', 'Play', PAD, 110, 288, 'success')
        btn(card.id, els, p, 'Shop', 'Shop', PAD, 170, 288, 'primary')
        btn(card.id, els, p, 'Settings', 'Settings', PAD, 230, 288, 'secondary')
      }),
  },
  {
    id: 'modern-shop',
    name: 'Shop',
    description: 'Full-screen shop with item cards and currency',
    category: 'modern' as const,
    build: () =>
      build('Shop', 'modern', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Shop', 40)
        title(panel.id, els, p, 'ITEM SHOP', PAD, PAD, 200)
        txt(panel.id, els, p, 'Coins', '💰 1,250', 220, PAD + 4, 100, 24, {
          font: p.fontTitle,
          textSize: 14,
        })
        for (let i = 0; i < 4; i++) {
          const col = i % 2
          const row = Math.floor(i / 2)
          const card = raised(
            panel.id,
            els,
            p,
            `Item${i + 1}`,
            PAD + col * 168,
            80 + row * 200,
            156,
            184,
          )
          raised(card.id, els, p, 'Thumb', 12, 12, 132, 90)
          txt(card.id, els, p, 'Name', `Item ${i + 1}`, 12, 110, 132, 20, { font: p.fontTitle, textSize: 13 })
          txt(card.id, els, p, 'Price', '250 coins', 12, 132, 132, 16, { textSize: 11, textColor3: p.muted })
          btn(card.id, els, p, 'Buy', 'Buy', 12, 148, 132)
        }
      }),
  },
  {
    id: 'modern-inventory',
    name: 'Inventory',
    description: '12-slot inventory grid',
    category: 'modern' as const,
    build: () =>
      build('Inventory', 'modern', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Inventory', 56)
        title(panel.id, els, p, 'INVENTORY', PAD, PAD, 250)
        txt(panel.id, els, p, 'Count', '12 / 24 slots', 220, PAD + 4, 100, 20, {
          textSize: 12,
          textColor3: p.muted,
        })
        slotGrid(panel.id, els, p, 4, 72, 10, PAD, 56, 12)
      }),
  },
  {
    id: 'modern-settings',
    name: 'Settings',
    description: 'Audio and graphics toggles',
    category: 'modern' as const,
    build: () =>
      build('Settings', 'modern', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Settings', 80)
        title(panel.id, els, p, 'SETTINGS', PAD, PAD, 250)
        ;['Music', 'Sound Effects', 'Graphics'].forEach((label, i) => {
          const row = raised(panel.id, els, p, label.replace(' ', ''), PAD, 56 + i * 60, 358 - PAD * 2, 48)
          txt(row.id, els, p, 'Label', label, 12, 0, 200, 48, { font: p.fontTitle, textSize: 14 })
          box(row.id, els, p, 'Toggle', 290, 12, 44, 24, { backgroundColor3: p.accent })
        })
      }),
  },

  // ─── RETRO ───────────────────────────────────────────────
  {
    id: 'retro-menu',
    name: 'Arcade Menu',
    description: 'Retro arcade title screen with coin counter',
    category: 'retro' as const,
    build: () =>
      build('Arcade Menu', 'retro', (root, els, p) => {
        bg(root, els, p)
        txt(root, els, p, 'CoinLabel', 'COINS: 99', cx(200), 48, 200, 28, {
          font: p.fontTitle,
          textSize: 18,
          textColor3: p.accent,
        })
        title(root, els, p, 'ARCADE GAME', cx(300), 140, 300)
        txt(root, els, p, 'Insert', 'INSERT COIN', cx(200), 190, 200, 24, {
          textSize: 14,
          textColor3: p.muted,
        })
        btn(root, els, p, 'Start', 'START', cx(260), 280, 260, 'success')
        btn(root, els, p, 'Scores', 'HIGH SCORES', cx(260), 340, 260, 'primary')
        btn(root, els, p, 'Exit', 'EXIT', cx(260), 400, 260, 'secondary')
      }),
  },
  {
    id: 'retro-leaderboard',
    name: 'Leaderboard',
    description: 'High score table with top 5 players',
    category: 'retro' as const,
    build: () =>
      build('Leaderboard', 'retro', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Leaderboard', 64)
        title(panel.id, els, p, 'HIGH SCORES', PAD, PAD, 300)
        const names = ['AAA', 'YOU', 'BOT', 'ACE', 'PRO']
        const scores = ['9999', '8420', '7100', '6500', '5200']
        names.forEach((n, i) => {
          const row = raised(panel.id, els, p, `Row${i + 1}`, PAD, 52 + i * 52, 358 - PAD * 2, 44)
          txt(row.id, els, p, 'Rank', `${i + 1}. ${n}`, 12, 0, 180, 44, { font: p.fontTitle, textSize: 14 })
          txt(row.id, els, p, 'Score', scores[i], 200, 0, 120, 44, {
            font: p.fontTitle,
            textSize: 14,
            textColor3: p.accent,
          })
        })
      }),
  },
  {
    id: 'retro-dialog',
    name: 'Dialog Box',
    description: 'Bottom NPC dialog with continue button',
    category: 'retro' as const,
    build: () =>
      build('Dialog Box', 'retro', (root, els, p) => {
        bg(root, els, p)
        const dialog = box(root, els, p, 'Dialog', PAD, PHONE_H - 200, PHONE_W - PAD * 2, 160)
        txt(dialog.id, els, p, 'Speaker', 'NPC:', PAD, 12, 80, 20, {
          font: p.fontTitle,
          textSize: 14,
          textColor3: p.accent,
        })
        txt(
          dialog.id,
          els,
          p,
          'Text',
          'Welcome, hero! Press continue to begin your quest.',
          PAD,
          36,
          358 - PAD * 2,
          60,
          { textWrapped: true, textSize: 14 },
        )
        btn(dialog.id, els, p, 'Continue', 'CONTINUE', 358 - PAD - 130, 108, 130)
      }),
  },
  {
    id: 'retro-pause',
    name: 'Pause Menu',
    description: 'Pause overlay with resume and quit',
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
        const menu = box(root, els, p, 'PauseMenu', cx(280), 260, 280, 320)
        title(menu.id, els, p, 'PAUSED', PAD, 24, 248)
        btn(menu.id, els, p, 'Resume', 'RESUME', PAD, 90, 248, 'success')
        btn(menu.id, els, p, 'Settings', 'SETTINGS', PAD, 150, 248, 'primary')
        btn(menu.id, els, p, 'Quit', 'QUIT', PAD, 210, 248, 'secondary')
      }),
  },

  // ─── PIXEL ───────────────────────────────────────────────
  {
    id: 'pixel-menu',
    name: 'Pixel Menu',
    description: '8-bit style main menu',
    category: 'pixel' as const,
    build: () =>
      build('Pixel Menu', 'pixel', (root, els, p) => {
        bg(root, els, p)
        title(root, els, p, 'PIXEL QUEST', cx(280), 160, 280)
        txt(root, els, p, 'Sub', 'v1.0', cx(100), 200, 100, 20, { textSize: 12, textColor3: p.muted })
        btn(root, els, p, 'Play', 'PLAY', cx(240), 280, 240, 'success')
        btn(root, els, p, 'Load', 'LOAD', cx(240), 340, 240, 'primary')
        btn(root, els, p, 'Quit', 'QUIT', cx(240), 400, 240, 'secondary')
      }),
  },
  {
    id: 'pixel-hud',
    name: 'Pixel HUD',
    description: 'Health bar and coin counter',
    category: 'pixel' as const,
    build: () =>
      build('Pixel HUD', 'pixel', (root, els, p) => {
        bg(root, els, p)
        txt(root, els, p, 'HPLabel', 'HP', PAD, 20, 30, 20, { font: p.fontTitle, textSize: 12 })
        hudBar(root, els, p, 'HealthBar', 50, 18, 180, 0.75, p.accent2)
        txt(root, els, p, 'HPVal', '75/100', 240, 18, 80, 22, { font: p.fontTitle, textSize: 12 })
        raised(root, els, p, 'Coins', PHONE_W - PAD - 120, 16, 120, 28)
        txt(root, els, p, 'CoinText', 'G 1,250', PHONE_W - PAD - 112, 18, 104, 24, {
          font: p.fontTitle,
          textSize: 12,
        })
        txt(root, els, p, 'Hint', 'HUD — place over gameplay', cx(260), PHONE_H - 80, 260, 20, {
          textSize: 11,
          textColor3: p.muted,
        })
      }),
  },
  {
    id: 'pixel-inventory',
    name: 'Pixel Inventory',
    description: '16-slot pixel item grid',
    category: 'pixel' as const,
    build: () =>
      build('Pixel Inventory', 'pixel', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Inventory', 48)
        title(panel.id, els, p, 'ITEMS', PAD, PAD, 200)
        slotGrid(panel.id, els, p, 4, 64, 8, PAD, 52, 16)
      }),
  },
  {
    id: 'pixel-gameover',
    name: 'Game Over',
    description: 'Game over screen with retry button',
    category: 'pixel' as const,
    build: () =>
      build('Game Over', 'pixel', (root, els, p) => {
        bg(root, els, p)
        title(root, els, p, 'GAME OVER', cx(280), 280, 280)
        txt(root, els, p, 'Score', 'SCORE: 4,280', cx(200), 330, 200, 28, {
          font: p.fontTitle,
          textSize: 16,
          textColor3: p.accent,
        })
        btn(root, els, p, 'Retry', 'RETRY', cx(220), 400, 220, 'primary')
        btn(root, els, p, 'Menu', 'MENU', cx(220), 460, 220, 'secondary')
      }),
  },

  // ─── LOW POLY ───────────────────────────────────────────
  {
    id: 'lowpoly-menu',
    name: 'Low Poly Menu',
    description: 'Soft flat menu with geometric style',
    category: 'lowpoly' as const,
    build: () =>
      build('Low Poly Menu', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const card = box(root, els, p, 'MenuCard', cx(300), 220, 300, 360)
        title(card.id, els, p, 'Adventure', PAD, 28, 268)
        txt(card.id, els, p, 'Sub', 'Choose your path', PAD, 62, 268, 20, {
          textSize: 12,
          textColor3: p.muted,
        })
        btn(card.id, els, p, 'Play', 'Play', PAD, 110, 268, 'primary')
        btn(card.id, els, p, 'World', 'World Map', PAD, 168, 268, 'secondary')
        btn(card.id, els, p, 'Settings', 'Settings', PAD, 226, 268, 'secondary')
      }),
  },
  {
    id: 'lowpoly-stats',
    name: 'Character Stats',
    description: 'RPG stat sheet panel',
    category: 'lowpoly' as const,
    build: () =>
      build('Character Stats', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Stats', 72)
        title(panel.id, els, p, 'CHARACTER', PAD, PAD, 250)
        txt(panel.id, els, p, 'Level', 'Level 12 · Knight', PAD, 48, 250, 20, {
          textSize: 12,
          textColor3: p.muted,
        })
        ;['Health', 'Strength', 'Defense', 'Speed', 'Luck'].forEach((stat, i) => {
          const row = raised(panel.id, els, p, stat, PAD, 80 + i * 52, 358 - PAD * 2, 44)
          txt(row.id, els, p, 'Val', `${stat}: ${50 + i * 10}`, 12, 0, 300, 44, { textSize: 14 })
        })
      }),
  },
  {
    id: 'lowpoly-quests',
    name: 'Quest Log',
    description: 'Active quest list with progress',
    category: 'lowpoly' as const,
    build: () =>
      build('Quest Log', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'Quests', 56)
        title(panel.id, els, p, 'QUESTS', PAD, PAD, 200)
        const quests = [
          ['Find the Crystal', '0 / 1'],
          ['Defeat 5 Wolves', '3 / 5'],
          ['Talk to Elder', 'Complete'],
        ]
        quests.forEach(([q, prog], i) => {
          const card = raised(panel.id, els, p, `Quest${i + 1}`, PAD, 52 + i * 88, 358 - PAD * 2, 76)
          txt(card.id, els, p, 'Name', q, 12, 12, 300, 22, { font: p.fontTitle, textSize: 14 })
          txt(card.id, els, p, 'Prog', prog, 12, 40, 300, 18, {
            textSize: 12,
            textColor3: prog === 'Complete' ? p.accent2 : p.muted,
          })
        })
      }),
  },
  {
    id: 'lowpoly-daily',
    name: 'Daily Rewards',
    description: '7-day reward calendar',
    category: 'lowpoly' as const,
    build: () =>
      build('Daily Rewards', 'lowpoly', (root, els, p) => {
        bg(root, els, p)
        const panel = screenPanel(root, els, p, 'DailyRewards', 80)
        title(panel.id, els, p, 'DAILY REWARDS', PAD, PAD, 280)
        txt(panel.id, els, p, 'Streak', 'Day 3 streak', PAD, 48, 200, 20, {
          textSize: 12,
          textColor3: p.muted,
        })
        for (let i = 0; i < 7; i++) {
          const day = raised(panel.id, els, p, `Day${i + 1}`, PAD + i * 50, 80, 44, 64)
          txt(day.id, els, p, 'Num', `${i + 1}`, 0, 6, 44, 16, {
            textSize: 10,
            textColor3: p.muted,
            font: p.fontTitle,
          })
          txt(day.id, els, p, 'Icon', i === 2 ? '✓' : '★', 0, 28, 44, 28, { textSize: 16 })
        }
        btn(panel.id, els, p, 'Claim', 'Claim Reward', PAD, 170, 358 - PAD * 2)
      }),
  },
] as const

export type TemplateId = (typeof TEMPLATE_CATALOG)[number]['id']

export function getTemplate(id: TemplateId): ProjectDocument {
  const t = TEMPLATE_CATALOG.find((x) => x.id === id)
  if (!t) throw new Error(`Template not found: ${id}`)
  return t.build()
}
