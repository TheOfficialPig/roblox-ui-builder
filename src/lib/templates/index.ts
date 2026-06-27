import { createElement } from '@/lib/core/defaults'
import { udim, udim2Offset } from '@/lib/core/utils'
import type { ProjectDocument } from '@/lib/core/types'
import {
  T,
  addChild,
  centerPos,
  corner,
  fullBg,
  ghostBtn,
  gridSlots,
  label,
  panel,
  panelTitle,
  primaryBtn,
  radius,
  rowFrame,
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
    description: 'Play, shop, and settings buttons',
    category: 'Menus',
    build: () =>
      buildTemplate('Main Menu', (root, els) => {
        fullBg(root, els)
        const menu = addChild(
          root,
          els,
          panel('MainMenu', 320, 380, udim2Offset(523, 194)),
        )
        panelTitle(menu.id, els, 'My Game', 320)
        successBtn(menu.id, els, 'Play', 'Play', 30, 60, 260)
        primaryBtn(menu.id, els, 'Shop', 'Shop', 30, 114, 260)
        ghostBtn(menu.id, els, 'Settings', 'Settings', 30, 168, 260)
      }),
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: '12-slot item grid',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Inventory', (root, els) => {
        const p = addChild(root, els, panel('Inventory', 460, 400))
        panelTitle(p.id, els, 'Inventory', 460)
        gridSlots(p.id, els, 12, 4, 80, 8, 16, 52)
      }),
  },
  {
    id: 'shop',
    name: 'Shop',
    description: 'Three item cards with buy buttons',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Shop', (root, els) => {
        const p = addChild(root, els, panel('Shop', 700, 460))
        panelTitle(p.id, els, 'Shop', 700)
        label(p.id, els, 'Coins', '💰 1,250', 560, 16, 120, 24, {
          font: 'GothamBold',
          textSize: 14,
        })
        for (let i = 0; i < 3; i++) {
          const card = rowFrame(p.id, els, `Item${i + 1}`, 20 + i * 224, 52, 200, 380)
          addChild(card.id, els, createElement('Frame', {
            name: 'Thumb',
            size: udim2Offset(168, 100),
            position: udim2Offset(16, 16),
            backgroundColor3: T.slot,
            ...corner(radius.md),
          }))
          label(card.id, els, 'Name', `Item ${i + 1}`, 16, 126, 168, 22, { font: 'GothamBold' })
          label(card.id, els, 'Price', '250 coins', 16, 152, 168, 18, {
            textSize: 12,
            textColor3: T.textMuted,
          })
          primaryBtn(card.id, els, 'Buy', 'Buy', 16, 180, 168)
        }
      }),
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Music, SFX, and graphics toggles',
    category: 'Menus',
    build: () =>
      buildTemplate('Settings', (root, els) => {
        const p = addChild(root, els, panel('Settings', 380, 320))
        panelTitle(p.id, els, 'Settings', 380)
        for (const [i, name] of ['Music', 'Sound Effects', 'Graphics'].entries()) {
          const row = rowFrame(p.id, els, name, 16, 52 + i * 52, 348, 44)
          label(row.id, els, 'Label', name, 12, 0, 200, 44, { font: 'GothamBold' })
          addChild(row.id, els, createElement('Frame', {
            name: 'Toggle',
            size: udim2Offset(40, 22),
            position: udim2Offset(296, 11),
            backgroundColor3: T.accent,
            ...corner(radius.sm),
          }))
        }
      }),
  },
  {
    id: 'dialog-box',
    name: 'Dialog Box',
    description: 'NPC dialog with continue button',
    category: 'UI',
    build: () =>
      buildTemplate('Dialog Box', (root, els) => {
        const p = addChild(root, els, panel('DialogBox', 620, 140, udim2Offset(373, 580)))
        label(p.id, els, 'Text', 'Welcome, traveler! What would you like to do?', 16, 16, 588, 60, {
          textWrapped: true,
          textSize: 15,
        })
        primaryBtn(p.id, els, 'Continue', 'Continue', 480, 88, 120)
      }),
  },
  {
    id: 'loading-screen',
    name: 'Loading Screen',
    description: 'Full-screen loader with progress bar',
    category: 'UI',
    build: () =>
      buildTemplate('Loading Screen', (root, els) => {
        const bg = fullBg(root, els)
        label(bg.id, els, 'Title', 'MY GAME', 0, 300, 1366, 40, {
          font: 'GothamBlack',
          textSize: 36,
        })
        label(bg.id, els, 'Status', 'Loading...', 0, 350, 1366, 20, {
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
    description: 'HP bar HUD element',
    category: 'HUD',
    build: () =>
      buildTemplate('Health Bar', (root, els) => {
        const bar = addChild(root, els, createElement('Frame', {
          name: 'HealthBar',
          size: udim2Offset(220, 24),
          position: udim2Offset(20, 20),
          backgroundColor3: T.panelRaised,
          ...corner(radius.md),
          uiStroke: stroke(),
        }))
        addChild(bar.id, els, createElement('Frame', {
          name: 'Fill',
          size: udim2Offset(170, 18),
          position: udim2Offset(3, 3),
          backgroundColor3: T.danger,
          ...corner(radius.sm),
        }))
        label(bar.id, els, 'HP', '88 / 100', 0, 0, 220, 24, {
          font: 'GothamBold',
          textSize: 11,
        })
      }),
  },
  {
    id: 'currency-hud',
    name: 'Currency HUD',
    description: 'Top-right coin counter',
    category: 'HUD',
    build: () =>
      buildTemplate('Currency HUD', (root, els) => {
        const pill = addChild(root, els, createElement('Frame', {
          name: 'Currency',
          size: udim2Offset(150, 36),
          position: udim2Offset(1196, 20),
          backgroundColor3: T.panel,
          ...corner(radius.lg),
          uiStroke: stroke(),
        }))
        label(pill.id, els, 'Coins', '💰 1,250', 0, 0, 150, 36, {
          font: 'GothamBold',
          textSize: 14,
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
          size: udim2Offset(300, 64),
          position: udim2Offset(1046, 80),
          backgroundColor3: T.panel,
          ...corner(radius.lg),
          uiStroke: stroke(),
        }))
        label(toast.id, els, 'Title', 'Quest Complete', 16, 10, 268, 20, {
          font: 'GothamBold',
          textSize: 14,
        })
        label(toast.id, els, 'Body', 'You earned 50 coins!', 16, 32, 268, 20, {
          textSize: 12,
          textColor3: T.textMuted,
        })
      }),
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    description: 'Top 5 player scores',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Leaderboard', (root, els) => {
        const p = addChild(root, els, panel('Leaderboard', 280, 360, udim2Offset(20, 60)))
        panelTitle(p.id, els, 'Leaderboard', 280)
        const players = ['PlayerOne', 'You', 'Guest_442', 'Builder99', 'ProGamer']
        const scores = ['12,400', '9,820', '8,100', '7,550', '6,200']
        players.forEach((name, i) => {
          const row = rowFrame(p.id, els, `Row${i + 1}`, 12, 50 + i * 52, 256, 44)
          label(row.id, els, 'Name', `${i + 1}. ${name}`, 10, 0, 180, 44, { font: 'GothamBold', textSize: 13 })
          label(row.id, els, 'Score', scores[i], 170, 0, 76, 44, {
            textSize: 12,
            textColor3: T.textMuted,
          })
        })
      }),
  },
  {
    id: 'daily-rewards',
    name: 'Daily Rewards',
    description: '7-day reward calendar',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Daily Rewards', (root, els) => {
        const p = addChild(root, els, panel('DailyRewards', 520, 300))
        panelTitle(p.id, els, 'Daily Rewards', 520)
        for (let i = 0; i < 7; i++) {
          const day = rowFrame(p.id, els, `Day${i + 1}`, 16 + i * 70, 52, 60, 80)
          label(day.id, els, 'Label', `Day ${i + 1}`, 0, 8, 60, 16, {
            textSize: 10,
            textColor3: T.textMuted,
            font: 'GothamBold',
          })
          label(day.id, els, 'Icon', i === 2 ? '✓' : '🎁', 0, 30, 60, 30, { textSize: 18 })
        }
        primaryBtn(p.id, els, 'Claim', 'Claim', 130, 210, 260)
      }),
  },
  {
    id: 'battle-pass',
    name: 'Battle Pass',
    description: 'Horizontal tier track',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Battle Pass', (root, els) => {
        const p = addChild(root, els, panel('BattlePass', 760, 400))
        panelTitle(p.id, els, 'Battle Pass', 760)
        for (let i = 0; i < 4; i++) {
          const tier = rowFrame(p.id, els, `Tier${i + 1}`, 16 + i * 182, 52, 170, 300)
          label(tier.id, els, 'Num', `Tier ${i + 1}`, 0, 10, 170, 22, {
            font: 'GothamBold',
            textSize: 13,
          })
          addChild(tier.id, els, createElement('Frame', {
            name: 'Reward',
            size: udim2Offset(130, 130),
            position: udim2Offset(20, 44),
            backgroundColor3: T.slot,
            ...corner(radius.md),
          }))
        }
      }),
  },
  {
    id: 'quest-log',
    name: 'Quest Log',
    description: 'Four active quest entries',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Quest Log', (root, els) => {
        const p = addChild(root, els, panel('QuestLog', 340, 400, udim2Offset(20, 144)))
        panelTitle(p.id, els, 'Quests', 340)
        const quests = [
          ['Find the Key', '0 / 1'],
          ['Defeat 5 Enemies', '3 / 5'],
          ['Talk to Merchant', 'Done'],
          ['Explore the Cave', '0 / 1'],
        ]
        quests.forEach(([title, prog], i) => {
          const card = rowFrame(p.id, els, `Quest${i + 1}`, 12, 50 + i * 76, 316, 64)
          label(card.id, els, 'Title', title, 12, 10, 240, 22, { font: 'GothamBold', textSize: 13 })
          label(card.id, els, 'Progress', prog, 12, 34, 240, 18, {
            textSize: 12,
            textColor3: prog === 'Done' ? T.success : T.textMuted,
          })
        })
      }),
  },
  {
    id: 'trading-ui',
    name: 'Trading UI',
    description: 'Two-sided trade window',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Trading UI', (root, els) => {
        const p = addChild(root, els, panel('TradingUI', 640, 400))
        panelTitle(p.id, els, 'Trade', 640)
        ;(['Your', 'Their'] as const).forEach((side, i) => {
          const box = rowFrame(p.id, els, `${side}Offer`, 16 + i * 320, 52, 300, 260)
          label(box.id, els, 'Label', `${side} Offer`, 12, 8, 200, 20, {
            font: 'GothamBold',
            textSize: 12,
            textColor3: T.textMuted,
          })
          gridSlots(box.id, els, 4, 2, 120, 10, 20, 36, 'Slot')
        })
        successBtn(p.id, els, 'Accept', 'Accept', 180, 330, 130)
        ghostBtn(p.id, els, 'Decline', 'Decline', 330, 330, 130)
      }),
  },
  {
    id: 'character-stats',
    name: 'Character Stats',
    description: 'Five stat rows',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Character Stats', (root, els) => {
        const p = addChild(root, els, panel('CharacterStats', 360, 360))
        panelTitle(p.id, els, 'Character', 360)
        ;['Health', 'Strength', 'Defense', 'Speed', 'Luck'].forEach((stat, i) => {
          const row = rowFrame(p.id, els, stat, 16, 50 + i * 48, 328, 40)
          label(row.id, els, 'Value', `${stat}: ${50 + i * 10}`, 12, 0, 304, 40, { textSize: 14 })
        })
      }),
  },
  {
    id: 'popup-window',
    name: 'Popup Windows',
    description: 'Confirm dialog with overlay',
    category: 'UI',
    build: () =>
      buildTemplate('Popup Window', (root, els) => {
        const overlay = addChild(root, els, createElement('Frame', {
          name: 'Overlay',
          size: udim(1, 0, 1, 0),
          backgroundColor3: T.overlay,
          backgroundTransparency: 0.45,
        }))
        const popup = addChild(overlay.id, els, panel('Popup', 380, 200, centerPos(380, 200)))
        panelTitle(popup.id, els, 'Confirm', 380)
        label(popup.id, els, 'Message', 'Are you sure you want to continue?', 16, 52, 348, 48, {
          textWrapped: true,
          textSize: 14,
          textColor3: T.textMuted,
        })
        ghostBtn(popup.id, els, 'Cancel', 'Cancel', 16, 140, 165)
        primaryBtn(popup.id, els, 'Confirm', 'Confirm', 195, 140, 165)
      }),
  },
  {
    id: 'user-accounts',
    name: 'User Accounts',
    description: 'Login and sign-up form',
    category: 'Menus',
    build: () =>
      buildTemplate('User Accounts', (root, els) => {
        fullBg(root, els)
        const p = addChild(root, els, panel('AccountPanel', 360, 340))
        panelTitle(p.id, els, 'Account', 360)
        for (const [i, ph] of ['Email', 'Password'].entries()) {
          const field = rowFrame(p.id, els, ph, 16, 52 + i * 52, 328, 40)
          label(field.id, els, 'Placeholder', ph, 12, 0, 304, 40, {
            textSize: 13,
            textColor3: T.textDim,
          })
        }
        primaryBtn(p.id, els, 'Login', 'Log In', 16, 170, 328)
        ghostBtn(p.id, els, 'SignUp', 'Create Account', 16, 222, 328)
      }),
  },
] as const

export type TemplateId = (typeof TEMPLATE_CATALOG)[number]['id']

export function getTemplate(id: TemplateId): ProjectDocument {
  const template = TEMPLATE_CATALOG.find((t) => t.id === id)
  if (!template) throw new Error(`Template not found: ${id}`)
  return template.build()
}
