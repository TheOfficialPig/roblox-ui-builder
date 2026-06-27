import { createElement } from '@/lib/core/defaults'
import { color3, udim, udim2Offset } from '@/lib/core/utils'
import type { ProjectDocument } from '@/lib/core/types'
import {
  T,
  addChild,
  closeBtn,
  corner,
  fullBg,
  ghostBtn,
  headerBar,
  label,
  listRow,
  panel,
  primaryBtn,
  radius,
  slot,
  statRow,
  stroke,
  successBtn,
} from './theme'

function buildTemplate(
  name: string,
  builder: (rootId: string, elements: Record<string, ReturnType<typeof createElement>>) => void,
): ProjectDocument {
  const screenGui = createElement('ScreenGui', { name: 'ScreenGui' })
  const elements: Record<string, ReturnType<typeof createElement>> = {
    [screenGui.id]: screenGui,
  }
  builder(screenGui.id, elements)
  return {
    id: crypto.randomUUID(),
    name,
    elements,
    rootIds: [screenGui.id],
    devicePreview: 'desktop',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const TEMPLATE_CATALOG = [
  {
    id: 'main-menu',
    name: 'Main Menu',
    description: 'Centered menu card with play, shop, and settings',
    category: 'Menus',
    build: () =>
      buildTemplate('Main Menu', (root, els) => {
        fullBg(root, els)
        const menu = addChild(
          root,
          els,
          createElement('Frame', {
            name: 'MainMenu',
            size: udim2Offset(340, 420),
            position: udim2Offset(683, 384),
            anchorPoint: { x: 0.5, y: 0.5 },
            backgroundColor3: T.panel,
            ...corner(radius.lg),
            uiStroke: stroke(),
          }),
        )
        headerBar(menu.id, els, 'My Game', 340, { subtitle: 'Select an option' })
        closeBtn(menu.id, els, 340)
        successBtn(menu.id, els, 'PlayBtn', 'Play', udim2Offset(30, 130), 280)
        primaryBtn(menu.id, els, 'ShopBtn', 'Shop', udim2Offset(30, 186), 280)
        ghostBtn(menu.id, els, 'SettingsBtn', 'Settings', udim2Offset(30, 242), 280)
        label(menu.id, els, 'Version', 'v1.0 · Free template', udim2Offset(30, 360), udim2Offset(280, 20), {
          textSize: 11,
          textColor3: T.textDim,
          font: 'Gotham',
        })
      }),
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Grid inventory with header and item slots',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Inventory', (root, els) => {
        const p = addChild(root, els, panel('Inventory', udim2Offset(480, 440), udim2Offset(443, 164)))
        headerBar(p.id, els, 'Inventory', 480, { subtitle: '12 slots' })
        closeBtn(p.id, els, 480)
        const slots = addChild(p.id, els, createElement('Frame', {
          name: 'Slots',
          size: udim2Offset(448, 340),
          position: udim2Offset(16, 68),
          backgroundTransparency: 1,
        }))
        addChild(slots.id, els, createElement('UIGridLayout', {
          uiGridLayout: {
            cellSize: udim2Offset(80, 80),
            cellPadding: udim2Offset(8, 8),
            fillDirection: 'Horizontal',
            horizontalAlignment: 'Left',
            verticalAlignment: 'Top',
            sortOrder: 'LayoutOrder',
            startCorner: 'TopLeft',
          },
        }))
        for (let i = 0; i < 12; i++) slot(slots.id, els, `Slot${i + 1}`, 80, i)
      }),
  },
  {
    id: 'shop',
    name: 'Shop',
    description: 'Shop window with currency bar and item cards',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Shop', (root, els) => {
        const shop = addChild(root, els, panel('Shop', udim2Offset(720, 500), udim2Offset(323, 134)))
        headerBar(shop.id, els, 'Item Shop', 720, { subtitle: 'Daily deals' })
        closeBtn(shop.id, els, 720)
        const currency = addChild(shop.id, els, createElement('Frame', {
          name: 'Currency',
          size: udim2Offset(140, 32),
          position: udim2Offset(560, 12),
          backgroundColor3: T.panelRaised,
          ...corner(radius.md),
          uiStroke: stroke(),
        }))
        label(currency.id, els, 'Coins', '💰 1,250', udim2Offset(0, 0), udim(1, 0, 1, 0), {
          font: 'GothamBold',
          textSize: 14,
        })
        for (let i = 0; i < 3; i++) {
          const card = addChild(shop.id, els, createElement('Frame', {
            name: `Item${i + 1}`,
            size: udim2Offset(200, 260),
            position: udim2Offset(24 + i * 228, 80),
            backgroundColor3: T.panelRaised,
            ...corner(radius.lg),
            uiStroke: stroke(),
          }))
          addChild(card.id, els, createElement('Frame', {
            name: 'Thumb',
            size: udim2Offset(168, 120),
            position: udim2Offset(16, 16),
            backgroundColor3: T.slot,
            ...corner(radius.md),
          }))
          label(card.id, els, 'Name', `Item ${i + 1}`, udim2Offset(16, 148), udim2Offset(168, 22), {
            font: 'GothamBold',
            textSize: 14,
          })
          label(card.id, els, 'Price', '250 coins', udim2Offset(16, 174), udim2Offset(168, 18), {
            textSize: 12,
            textColor3: T.textMuted,
          })
          primaryBtn(card.id, els, 'Buy', 'Buy', udim2Offset(16, 204), 168)
        }
      }),
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Settings panel with toggle rows',
    category: 'Menus',
    build: () =>
      buildTemplate('Settings', (root, els) => {
        const p = addChild(root, els, panel('Settings', udim2Offset(400, 400), udim2Offset(483, 184)))
        headerBar(p.id, els, 'Settings', 400)
        closeBtn(p.id, els, 400)
        for (const [i, name] of ['Music', 'Sound Effects', 'Graphics'].entries()) {
          const row = addChild(p.id, els, createElement('Frame', {
            name,
            size: udim2Offset(368, 48),
            position: udim2Offset(16, 72 + i * 56),
            backgroundColor3: T.panelRaised,
            ...corner(radius.md),
            uiStroke: stroke(),
          }))
          label(row.id, els, 'Label', name, udim2Offset(14, 0), udim2Offset(200, 48), {
            font: 'GothamBold',
            textSize: 14,
          })
          addChild(row.id, els, createElement('Frame', {
            name: 'Toggle',
            size: udim2Offset(44, 24),
            position: udim2Offset(308, 12),
            backgroundColor3: T.accent,
            ...corner(radius.sm),
          }))
        }
      }),
  },
  {
    id: 'dialog-box',
    name: 'Dialog Box',
    description: 'NPC dialog with speaker name and continue button',
    category: 'UI',
    build: () =>
      buildTemplate('Dialog Box', (root, els) => {
        const dialog = addChild(
          root,
          els,
          panel('DialogBox', udim2Offset(640, 160), udim2Offset(363, 560), {
            backgroundColor3: T.bgSoft,
            backgroundTransparency: 0.05,
          }),
        )
        label(dialog.id, els, 'Speaker', 'Guide NPC', udim2Offset(20, 14), udim2Offset(200, 20), {
          font: 'GothamBold',
          textSize: 13,
          textColor3: T.accent,
        })
        label(
          dialog.id,
          els,
          'DialogText',
          'Welcome, traveler! Ready to begin your adventure?',
          udim2Offset(20, 40),
          udim2Offset(600, 60),
          { textWrapped: true, textSize: 15, textColor3: T.text },
        )
        primaryBtn(dialog.id, els, 'Continue', 'Continue', udim2Offset(500, 108), 120)
      }),
  },
  {
    id: 'loading-screen',
    name: 'Loading Screen',
    description: 'Full-screen loader with progress bar',
    category: 'UI',
    build: () =>
      buildTemplate('Loading Screen', (root, els) => {
        const bg = fullBg(root, els, T.bg)
        label(bg.id, els, 'GameTitle', 'MY GAME', udim2Offset(0, 280), udim2Offset(1366, 48), {
          font: 'GothamBlack',
          textSize: 40,
          textColor3: T.text,
        })
        label(bg.id, els, 'LoadingText', 'Loading assets...', udim2Offset(0, 340), udim2Offset(1366, 24), {
          textSize: 14,
          textColor3: T.textMuted,
        })
        const barBg = addChild(bg.id, els, createElement('Frame', {
          name: 'ProgressBg',
          size: udim2Offset(360, 6),
          position: udim2Offset(503, 390),
          backgroundColor3: T.panelRaised,
          ...corner(radius.sm),
        }))
        addChild(barBg.id, els, createElement('Frame', {
          name: 'ProgressFill',
          size: udim2Offset(220, 6),
          backgroundColor3: T.accent,
          ...corner(radius.sm),
        }))
      }),
  },
  {
    id: 'health-bar',
    name: 'Health Bar',
    description: 'Compact HP bar for HUD',
    category: 'HUD',
    build: () =>
      buildTemplate('Health Bar', (root, els) => {
        const container = addChild(root, els, createElement('Frame', {
          name: 'HealthBar',
          size: udim2Offset(240, 28),
          position: udim2Offset(20, 20),
          backgroundColor3: T.panelRaised,
          ...corner(radius.md),
          uiStroke: stroke(),
        }))
        addChild(container.id, els, createElement('Frame', {
          name: 'Fill',
          size: udim2Offset(188, 20),
          position: udim2Offset(4, 4),
          backgroundColor3: T.danger,
          ...corner(radius.sm),
        }))
        label(container.id, els, 'HP', '88 / 100', udim2Offset(0, 0), udim(1, 0, 1, 0), {
          font: 'GothamBold',
          textSize: 12,
        })
      }),
  },
  {
    id: 'currency-hud',
    name: 'Currency HUD',
    description: 'Top-right coin display pill',
    category: 'HUD',
    build: () =>
      buildTemplate('Currency HUD', (root, els) => {
        const pill = addChild(root, els, createElement('Frame', {
          name: 'Currency',
          size: udim2Offset(160, 40),
          position: udim2Offset(1186, 20),
          backgroundColor3: T.panel,
          ...corner(radius.lg),
          uiStroke: stroke(),
        }))
        label(pill.id, els, 'Coins', '💰  1,250', udim2Offset(0, 0), udim(1, 0, 1, 0), {
          font: 'GothamBold',
          textSize: 15,
        })
      }),
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Toast notification card',
    category: 'UI',
    build: () =>
      buildTemplate('Notifications', (root, els) => {
        const toast = addChild(root, els, createElement('Frame', {
          name: 'Notification',
          size: udim2Offset(320, 72),
          position: udim2Offset(1026, 80),
          backgroundColor3: T.panel,
          ...corner(radius.lg),
          uiStroke: stroke(T.accent, 2),
        }))
        addChild(toast.id, els, createElement('Frame', {
          name: 'Accent',
          size: udim2Offset(4, 72),
          backgroundColor3: T.accent,
          ...corner(radius.sm),
        }))
        label(toast.id, els, 'Title', 'Quest Complete', udim2Offset(16, 12), udim2Offset(280, 20), {
          font: 'GothamBold',
          textSize: 14,
        })
        label(toast.id, els, 'Body', 'You earned 50 coins!', udim2Offset(16, 36), udim2Offset(280, 20), {
          textSize: 12,
          textColor3: T.textMuted,
        })
      }),
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    description: 'Scoreboard with ranked player rows',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Leaderboard', (root, els) => {
        const board = addChild(
          root,
          els,
          panel('Leaderboard', udim2Offset(300, 380), udim2Offset(20, 60), {
            backgroundTransparency: 0.08,
          }),
        )
        headerBar(board.id, els, 'Leaderboard', 300, { subtitle: 'Top players' })
        const names = ['PlayerOne', 'You', 'Guest_442', 'Builder99', 'ProGamer']
        const scores = ['12,400', '9,820', '8,100', '7,550', '6,200']
        names.forEach((n, i) => listRow(board.id, els, `Row${i + 1}`, `#${i + 1}  ${n}`, scores[i], 64 + i * 56, 268))
      }),
  },
  {
    id: 'daily-rewards',
    name: 'Daily Rewards',
    description: '7-day reward calendar grid',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Daily Rewards', (root, els) => {
        const p = addChild(root, els, panel('DailyRewards', udim2Offset(540, 400), udim2Offset(413, 184)))
        headerBar(p.id, els, 'Daily Rewards', 540, { subtitle: 'Day 3 streak' })
        closeBtn(p.id, els, 540)
        const days = addChild(p.id, els, createElement('Frame', {
          name: 'Days',
          size: udim2Offset(508, 280),
          position: udim2Offset(16, 68),
          backgroundTransparency: 1,
        }))
        addChild(days.id, els, createElement('UIGridLayout', {
          uiGridLayout: {
            cellSize: udim2Offset(64, 88),
            cellPadding: udim2Offset(10, 10),
            fillDirection: 'Horizontal',
            horizontalAlignment: 'Left',
            verticalAlignment: 'Top',
            sortOrder: 'LayoutOrder',
            startCorner: 'TopLeft',
          },
        }))
        for (let i = 0; i < 7; i++) {
          const day = slot(days.id, els, `Day${i + 1}`, 64, i)
          label(day.id, els, 'Label', `Day ${i + 1}`, udim2Offset(0, 8), udim(1, 0, 0, 20), {
            textSize: 10,
            textColor3: T.textMuted,
            font: 'GothamBold',
          })
          label(day.id, els, 'Reward', i === 2 ? '✓' : '🎁', udim2Offset(0, 28), udim(1, 0, 1, 0), {
            textSize: 20,
          })
        }
        primaryBtn(p.id, els, 'Claim', 'Claim Reward', udim2Offset(130, 340), 280)
      }),
  },
  {
    id: 'battle-pass',
    name: 'Battle Pass',
    description: 'Season pass with tier scroll track',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Battle Pass', (root, els) => {
        const p = addChild(root, els, panel('BattlePass', udim2Offset(800, 480), udim2Offset(283, 144)))
        headerBar(p.id, els, 'Season 1 Pass', 800, { subtitle: 'Tier 4 / 50' })
        closeBtn(p.id, els, 800)
        const track = addChild(p.id, els, createElement('ScrollingFrame', {
          name: 'Tiers',
          size: udim2Offset(768, 360),
          position: udim2Offset(16, 68),
          canvasSize: udim2Offset(1100, 360),
          backgroundColor3: T.panelRaised,
          ...corner(radius.md),
          clipsDescendants: true,
        }))
        for (let i = 0; i < 6; i++) {
          const tier = addChild(track.id, els, createElement('Frame', {
            name: `Tier${i + 1}`,
            size: udim2Offset(160, 320),
            position: udim2Offset(16 + i * 176, 20),
            backgroundColor3: T.slot,
            ...corner(radius.lg),
            uiStroke: stroke(i === 3 ? T.accent : T.border, i === 3 ? 2 : 1),
          }))
          label(tier.id, els, 'Num', `Tier ${i + 1}`, udim2Offset(0, 12), udim(1, 0, 0, 24), {
            font: 'GothamBold',
            textSize: 13,
          })
          addChild(tier.id, els, createElement('Frame', {
            name: 'Reward',
            size: udim2Offset(120, 120),
            position: udim2Offset(20, 48),
            backgroundColor3: T.panelRaised,
            ...corner(radius.md),
          }))
        }
      }),
  },
  {
    id: 'quest-log',
    name: 'Quest Log',
    description: 'Side panel with active quest cards',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Quest Log', (root, els) => {
        const p = addChild(root, els, panel('QuestLog', udim2Offset(360, 480), udim2Offset(20, 144)))
        headerBar(p.id, els, 'Quests', 360, { subtitle: '2 active' })
        const quests = [
          ['Find the Key', '0 / 1'],
          ['Defeat 5 Enemies', '3 / 5'],
          ['Talk to Merchant', 'Done'],
          ['Explore the Cave', '0 / 1'],
        ]
        quests.forEach(([title, prog], i) => {
          const card = addChild(p.id, els, createElement('Frame', {
            name: `Quest${i + 1}`,
            size: udim2Offset(328, 72),
            position: udim2Offset(16, 68 + i * 84),
            backgroundColor3: T.panelRaised,
            ...corner(radius.md),
            uiStroke: stroke(),
          }))
          label(card.id, els, 'Title', title, udim2Offset(14, 12), udim2Offset(240, 22), {
            font: 'GothamBold',
            textSize: 14,
          })
          label(card.id, els, 'Progress', prog, udim2Offset(14, 38), udim2Offset(240, 18), {
            textSize: 12,
            textColor3: prog === 'Done' ? T.success : T.textMuted,
          })
        })
      }),
  },
  {
    id: 'trading-ui',
    name: 'Trading UI',
    description: 'Two-sided trade window with accept button',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Trading UI', (root, els) => {
        const trade = addChild(root, els, panel('TradingUI', udim2Offset(660, 440), udim2Offset(353, 164)))
        headerBar(trade.id, els, 'Trade', 660, { subtitle: 'With PlayerTwo' })
        closeBtn(trade.id, els, 660)
        ;(['Your', 'Their'] as const).forEach((side, i) => {
          const box = addChild(trade.id, els, createElement('Frame', {
            name: `${side}Offer`,
            size: udim2Offset(300, 280),
            position: udim2Offset(16 + i * 328, 68),
            backgroundColor3: T.panelRaised,
            ...corner(radius.lg),
            uiStroke: stroke(),
          }))
          label(box.id, els, 'Label', side === 'Your' ? 'Your Offer' : 'Their Offer', udim2Offset(12, 10), udim2Offset(200, 20), {
            font: 'GothamBold',
            textSize: 13,
            textColor3: T.textMuted,
          })
          for (let s = 0; s < 4; s++) {
            const col = s % 2
            const row = Math.floor(s / 2)
            addChild(box.id, els, createElement('Frame', {
              name: `Slot${s + 1}`,
              size: udim2Offset(120, 100),
              position: udim2Offset(20 + col * 132, 44 + row * 112),
              backgroundColor3: T.slot,
              ...corner(radius.md),
              uiStroke: stroke(),
            }))
          }
        })
        successBtn(trade.id, els, 'Accept', 'Accept Trade', udim2Offset(260, 368), 140)
        ghostBtn(trade.id, els, 'Decline', 'Decline', udim2Offset(420, 368), 120)
      }),
  },
  {
    id: 'character-stats',
    name: 'Character Stats',
    description: 'RPG stat sheet with labeled rows',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Character Stats', (root, els) => {
        const p = addChild(root, els, panel('CharacterStats', udim2Offset(380, 460), udim2Offset(493, 154)))
        headerBar(p.id, els, 'Character', 380, { subtitle: 'Level 12 Knight' })
        closeBtn(p.id, els, 380)
        ;['Health', 'Strength', 'Defense', 'Speed', 'Luck'].forEach((stat, i) => {
          statRow(p.id, els, stat, `${stat}  ·  ${50 + i * 10}`, 72 + i * 48, 348)
        })
      }),
  },
  {
    id: 'popup-window',
    name: 'Popup Windows',
    description: 'Modal confirm dialog with overlay',
    category: 'UI',
    build: () =>
      buildTemplate('Popup Window', (root, els) => {
        const overlay = addChild(root, els, createElement('Frame', {
          name: 'Overlay',
          size: udim(1, 0, 1, 0),
          backgroundColor3: T.overlay,
          backgroundTransparency: 0.45,
        }))
        const popup = addChild(overlay.id, els, panel('Popup', udim2Offset(400, 220), udim2Offset(483, 274)))
        headerBar(popup.id, els, 'Confirm', 400)
        label(popup.id, els, 'Message', 'Are you sure you want to continue?', udim2Offset(20, 72), udim2Offset(360, 48), {
          textWrapped: true,
          textSize: 14,
          textColor3: T.textMuted,
        })
        ghostBtn(popup.id, els, 'Cancel', 'Cancel', udim2Offset(20, 160), 170)
        primaryBtn(popup.id, els, 'Confirm', 'Confirm', udim2Offset(210, 160), 170)
      }),
  },
  {
    id: 'user-accounts',
    name: 'User Accounts',
    description: 'Login and sign-up form layout',
    category: 'Menus',
    build: () =>
      buildTemplate('User Accounts', (root, els) => {
        fullBg(root, els)
        const p = addChild(root, els, panel('AccountPanel', udim2Offset(380, 420), udim2Offset(493, 174)))
        headerBar(p.id, els, 'Account', 380, { subtitle: 'Sign in to play' })
        for (const [i, ph] of ['Email address', 'Password'].entries()) {
          const field = addChild(p.id, els, createElement('Frame', {
            name: ph.replace(' ', ''),
            size: udim2Offset(348, 44),
            position: udim2Offset(16, 80 + i * 56),
            backgroundColor3: T.panelRaised,
            ...corner(radius.md),
            uiStroke: stroke(),
          }))
          label(field.id, els, 'Placeholder', ph, udim2Offset(12, 0), udim(1, -12, 1, 0), {
            textSize: 13,
            textColor3: T.textDim,
          })
        }
        primaryBtn(p.id, els, 'Login', 'Log In', udim2Offset(20, 210), 348)
        ghostBtn(p.id, els, 'SignUp', 'Create Account', udim2Offset(20, 266), 348)
      }),
  },
] as const

export type TemplateId = (typeof TEMPLATE_CATALOG)[number]['id']

export function getTemplate(id: TemplateId): ProjectDocument {
  const template = TEMPLATE_CATALOG.find((t) => t.id === id)
  if (!template) throw new Error(`Template not found: ${id}`)
  return template.build()
}
