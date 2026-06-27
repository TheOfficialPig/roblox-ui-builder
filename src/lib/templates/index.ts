import { createElement } from '@/lib/core/defaults'
import { color3, udim, udim2Offset } from '@/lib/core/utils'
import type { ProjectDocument } from '@/lib/core/types'

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

function addChild(
  parentId: string,
  elements: Record<string, ReturnType<typeof createElement>>,
  el: ReturnType<typeof createElement>,
) {
  el.parentId = parentId
  elements[el.id] = el
  elements[parentId].children.push(el.id)
  return el
}

export const TEMPLATE_CATALOG = [
  {
    id: 'main-menu',
    name: 'Main Menu',
    description: 'Classic game main menu with play, shop, and settings buttons',
    category: 'Menus',
    build: () =>
      buildTemplate('Main Menu', (root, els) => {
        const bg = addChild(root, els, createElement('Frame', {
          name: 'Background',
          size: udim(1, 0, 1, 0),
          backgroundColor3: color3(15, 15, 20),
          uiCorner: { cornerRadius: udim(0, 0, 0, 0) },
        }))
        const menu = addChild(root, els, createElement('Frame', {
          name: 'Main Menu',
          size: udim2Offset(320, 400),
          position: udim2Offset(523, 184),
          anchorPoint: { x: 0.5, y: 0.5 },
          backgroundColor3: color3(25, 25, 35),
          backgroundTransparency: 0.1,
        }))
        addChild(menu.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'MY GAME',
          size: udim2Offset(280, 60),
          position: udim2Offset(20, 20),
          textSize: 32,
          font: 'GothamBlack',
          backgroundTransparency: 1,
        }))
        for (const [i, label] of ['Play', 'Shop', 'Settings'].entries()) {
          addChild(menu.id, els, createElement('TextButton', {
            name: `${label} Button`,
            text: label.toUpperCase(),
            size: udim2Offset(280, 48),
            position: udim2Offset(20, 100 + i * 60),
            backgroundColor3: color3(0, 120, 215),
            font: 'GothamBold',
            textSize: 18,
            uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
          }))
        }
        void bg
      }),
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Grid-based inventory panel with item slots',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Inventory', (root, els) => {
        const panel = addChild(root, els, createElement('Frame', {
          name: 'Inventory',
          size: udim2Offset(500, 400),
          position: udim2Offset(433, 184),
          backgroundColor3: color3(20, 20, 28),
        }))
        addChild(panel.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'INVENTORY',
          size: udim2Offset(460, 40),
          position: udim2Offset(20, 16),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 22,
        }))
        const slots = addChild(panel.id, els, createElement('Frame', {
          name: 'Slots',
          size: udim2Offset(460, 300),
          position: udim2Offset(20, 70),
          backgroundTransparency: 1,
        }))
        addChild(slots.id, els, createElement('UIGridLayout', {}))
        for (let i = 0; i < 12; i++) {
          addChild(slots.id, els, createElement('Frame', {
            name: `Slot${i + 1}`,
            size: udim2Offset(80, 80),
            backgroundColor3: color3(35, 35, 45),
            layoutOrder: i,
            uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
          }))
        }
      }),
  },
  {
    id: 'shop',
    name: 'Shop',
    description: 'In-game shop with item cards',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Shop', (root, els) => {
        const shop = addChild(root, els, createElement('Frame', {
          name: 'Shop',
          size: udim2Offset(700, 500),
          position: udim2Offset(333, 134),
          backgroundColor3: color3(18, 18, 26),
        }))
        addChild(shop.id, els, createElement('TextLabel', {
          name: 'ShopTitle',
          text: 'SHOP',
          size: udim2Offset(660, 50),
          position: udim2Offset(20, 16),
          backgroundTransparency: 1,
          font: 'GothamBlack',
          textSize: 28,
        }))
        const currency = addChild(root, els, createElement('Frame', {
          name: 'Currency',
          size: udim2Offset(160, 40),
          position: udim2Offset(1186, 20),
          backgroundColor3: color3(30, 30, 40),
          uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
        }))
        addChild(currency.id, els, createElement('TextLabel', {
          name: 'Coins',
          text: '💰 1,250',
          size: udim(1, 0, 1, 0),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 16,
        }))
      }),
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Game settings panel with toggles',
    category: 'Menus',
    build: () =>
      buildTemplate('Settings', (root, els) => {
        const settings = addChild(root, els, createElement('Frame', {
          name: 'Settings',
          size: udim2Offset(400, 450),
          position: udim2Offset(483, 159),
          backgroundColor3: color3(22, 22, 30),
        }))
        addChild(settings.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'SETTINGS',
          size: udim2Offset(360, 44),
          position: udim2Offset(20, 16),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 24,
        }))
        for (const [i, label] of ['Music', 'SFX', 'Graphics'].entries()) {
          addChild(settings.id, els, createElement('TextButton', {
            name: label,
            text: label,
            size: udim2Offset(360, 44),
            position: udim2Offset(20, 80 + i * 56),
            backgroundColor3: color3(40, 40, 52),
            font: 'Gotham',
            uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
          }))
        }
      }),
  },
  {
    id: 'dialog-box',
    name: 'Dialog Box',
    description: 'NPC dialog box with text and choices',
    category: 'UI',
    build: () =>
      buildTemplate('Dialog Box', (root, els) => {
        const dialog = addChild(root, els, createElement('Frame', {
          name: 'DialogBox',
          size: udim2Offset(600, 180),
          position: udim2Offset(383, 558),
          backgroundColor3: color3(10, 10, 15),
          backgroundTransparency: 0.15,
          uiCorner: { cornerRadius: udim(0, 12, 0, 12) },
          uiStroke: { color: color3(80, 80, 100), thickness: 2, transparency: 0, applyStrokeMode: 'Contextual', lineJoinMode: 'Round' },
        }))
        addChild(dialog.id, els, createElement('TextLabel', {
          name: 'DialogText',
          text: 'Welcome, traveler! What would you like to do?',
          size: udim2Offset(560, 80),
          position: udim2Offset(20, 20),
          backgroundTransparency: 1,
          textWrapped: true,
          textSize: 16,
        }))
        addChild(dialog.id, els, createElement('TextButton', {
          name: 'Continue',
          text: 'Continue',
          size: udim2Offset(120, 36),
          position: udim2Offset(460, 130),
          backgroundColor3: color3(0, 120, 215),
          uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
        }))
      }),
  },
  {
    id: 'loading-screen',
    name: 'Loading Screen',
    description: 'Full-screen loading screen with progress bar',
    category: 'UI',
    build: () =>
      buildTemplate('Loading Screen', (root, els) => {
        const bg = addChild(root, els, createElement('Frame', {
          name: 'Background',
          size: udim(1, 0, 1, 0),
          backgroundColor3: color3(8, 8, 12),
        }))
        addChild(bg.id, els, createElement('TextLabel', {
          name: 'LoadingText',
          text: 'LOADING...',
          size: udim2Offset(300, 50),
          position: udim2Offset(533, 320),
          backgroundTransparency: 1,
          font: 'GothamBlack',
          textSize: 36,
        }))
        const barBg = addChild(bg.id, els, createElement('Frame', {
          name: 'ProgressBarBg',
          size: udim2Offset(400, 8),
          position: udim2Offset(483, 400),
          backgroundColor3: color3(40, 40, 50),
          uiCorner: { cornerRadius: udim(0, 4, 0, 4) },
        }))
        addChild(barBg.id, els, createElement('Frame', {
          name: 'ProgressBarFill',
          size: udim2Offset(200, 8),
          backgroundColor3: color3(0, 170, 255),
          uiCorner: { cornerRadius: udim(0, 4, 0, 4) },
        }))
      }),
  },
  {
    id: 'health-bar',
    name: 'Health Bar',
    description: 'Player health bar HUD element',
    category: 'HUD',
    build: () =>
      buildTemplate('Health Bar', (root, els) => {
        const container = addChild(root, els, createElement('Frame', {
          name: 'HealthBar',
          size: udim2Offset(220, 24),
          position: udim2Offset(20, 20),
          backgroundColor3: color3(30, 30, 35),
          uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
        }))
        addChild(container.id, els, createElement('Frame', {
          name: 'Fill',
          size: udim2Offset(176, 20),
          position: udim2Offset(2, 2),
          backgroundColor3: color3(220, 50, 50),
          uiCorner: { cornerRadius: udim(0, 4, 0, 4) },
        }))
        addChild(container.id, els, createElement('TextLabel', {
          name: 'HP',
          text: '88 / 100',
          size: udim(1, 0, 1, 0),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 12,
        }))
      }),
  },
  {
    id: 'currency-hud',
    name: 'Currency HUD',
    description: 'Top-right currency display',
    category: 'HUD',
    build: () =>
      buildTemplate('Currency HUD', (root, els) => {
        addChild(root, els, createElement('Frame', {
          name: 'Currency',
          size: udim2Offset(180, 44),
          position: udim2Offset(1166, 20),
          backgroundColor3: color3(20, 20, 28),
          uiCorner: { cornerRadius: udim(0, 10, 0, 10) },
          uiStroke: { color: color3(60, 60, 80), thickness: 1, transparency: 0, applyStrokeMode: 'Contextual', lineJoinMode: 'Round' },
        }))
      }),
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Toast notification stack',
    category: 'UI',
    build: () =>
      buildTemplate('Notifications', (root, els) => {
        addChild(root, els, createElement('Frame', {
          name: 'Notifications',
          size: udim2Offset(320, 80),
          position: udim2Offset(1026, 80),
          backgroundColor3: color3(25, 25, 35),
          uiCorner: { cornerRadius: udim(0, 10, 0, 10) },
          uiStroke: { color: color3(0, 120, 215), thickness: 2, transparency: 0, applyStrokeMode: 'Contextual', lineJoinMode: 'Round' },
        }))
      }),
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    description: 'Player score leaderboard panel',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Leaderboard', (root, els) => {
        const board = addChild(root, els, createElement('Frame', {
          name: 'Leaderboard',
          size: udim2Offset(280, 360),
          position: udim2Offset(20, 60),
          backgroundColor3: color3(15, 15, 22),
          backgroundTransparency: 0.2,
        }))
        addChild(board.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'LEADERBOARD',
          size: udim2Offset(240, 36),
          position: udim2Offset(20, 12),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 16,
        }))
      }),
  },
  {
    id: 'daily-rewards',
    name: 'Daily Rewards',
    description: 'Daily login reward calendar',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Daily Rewards', (root, els) => {
        const panel = addChild(root, els, createElement('Frame', {
          name: 'DailyRewards',
          size: udim2Offset(520, 380),
          position: udim2Offset(423, 194),
          backgroundColor3: color3(18, 18, 26),
        }))
        addChild(panel.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'DAILY REWARDS',
          size: udim2Offset(480, 44),
          position: udim2Offset(20, 16),
          backgroundTransparency: 1,
          font: 'GothamBlack',
          textSize: 24,
        }))
        const days = addChild(panel.id, els, createElement('Frame', {
          name: 'Days',
          size: udim2Offset(480, 240),
          position: udim2Offset(20, 70),
          backgroundTransparency: 1,
        }))
        addChild(days.id, els, createElement('UIGridLayout', {}))
        for (let i = 0; i < 7; i++) {
          addChild(days.id, els, createElement('Frame', {
            name: `Day${i + 1}`,
            size: udim2Offset(60, 80),
            backgroundColor3: color3(35, 35, 48),
            layoutOrder: i,
            uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
          }))
        }
      }),
  },
  {
    id: 'battle-pass',
    name: 'Battle Pass',
    description: 'Season pass progression track',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Battle Pass', (root, els) => {
        const panel = addChild(root, els, createElement('Frame', {
          name: 'BattlePass',
          size: udim2Offset(800, 500),
          position: udim2Offset(283, 134),
          backgroundColor3: color3(12, 12, 20),
        }))
        addChild(panel.id, els, createElement('TextLabel', {
          name: 'SeasonTitle',
          text: 'SEASON 1 — BATTLE PASS',
          size: udim2Offset(760, 50),
          position: udim2Offset(20, 16),
          backgroundTransparency: 1,
          font: 'GothamBlack',
          textSize: 26,
        }))
        addChild(panel.id, els, createElement('ScrollingFrame', {
          name: 'Tiers',
          size: udim2Offset(760, 380),
          position: udim2Offset(20, 80),
          canvasSize: udim2Offset(1200, 380),
          backgroundColor3: color3(20, 20, 30),
        }))
      }),
  },
  {
    id: 'quest-log',
    name: 'Quest Log',
    description: 'Active and completed quests panel',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Quest Log', (root, els) => {
        const panel = addChild(root, els, createElement('Frame', {
          name: 'QuestLog',
          size: udim2Offset(360, 480),
          position: udim2Offset(20, 144),
          backgroundColor3: color3(16, 16, 24),
          backgroundTransparency: 0.1,
        }))
        addChild(panel.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'QUESTS',
          size: udim2Offset(320, 40),
          position: udim2Offset(20, 12),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 20,
        }))
        for (let i = 0; i < 4; i++) {
          addChild(panel.id, els, createElement('Frame', {
            name: `Quest${i + 1}`,
            size: udim2Offset(320, 72),
            position: udim2Offset(20, 60 + i * 84),
            backgroundColor3: color3(28, 28, 38),
            uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
          }))
        }
      }),
  },
  {
    id: 'trading-ui',
    name: 'Trading UI',
    description: 'Player-to-player trade window',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Trading UI', (root, els) => {
        const trade = addChild(root, els, createElement('Frame', {
          name: 'TradingUI',
          size: udim2Offset(640, 420),
          position: udim2Offset(363, 174),
          backgroundColor3: color3(14, 14, 22),
        }))
        addChild(trade.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'TRADE',
          size: udim2Offset(600, 40),
          position: udim2Offset(20, 12),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 22,
        }))
        addChild(trade.id, els, createElement('Frame', {
          name: 'YourOffer',
          size: udim2Offset(280, 280),
          position: udim2Offset(20, 60),
          backgroundColor3: color3(25, 25, 35),
        }))
        addChild(trade.id, els, createElement('Frame', {
          name: 'TheirOffer',
          size: udim2Offset(280, 280),
          position: udim2Offset(340, 60),
          backgroundColor3: color3(25, 25, 35),
        }))
        addChild(trade.id, els, createElement('TextButton', {
          name: 'Accept',
          text: 'ACCEPT',
          size: udim2Offset(140, 40),
          position: udim2Offset(200, 360),
          backgroundColor3: color3(40, 160, 80),
        }))
      }),
  },
  {
    id: 'character-stats',
    name: 'Character Stats',
    description: 'RPG character stats and attributes panel',
    category: 'Gameplay',
    build: () =>
      buildTemplate('Character Stats', (root, els) => {
        const stats = addChild(root, els, createElement('Frame', {
          name: 'CharacterStats',
          size: udim2Offset(400, 520),
          position: udim2Offset(483, 124),
          backgroundColor3: color3(16, 16, 24),
        }))
        addChild(stats.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'CHARACTER',
          size: udim2Offset(360, 44),
          position: udim2Offset(20, 16),
          backgroundTransparency: 1,
          font: 'GothamBlack',
          textSize: 24,
        }))
        for (const [i, stat] of ['Health', 'Strength', 'Defense', 'Speed', 'Luck'].entries()) {
          addChild(stats.id, els, createElement('TextLabel', {
            name: stat,
            text: `${stat}: ${50 + i * 10}`,
            size: udim2Offset(360, 36),
            position: udim2Offset(20, 80 + i * 44),
            backgroundTransparency: 1,
            font: 'Gotham',
            textSize: 16,
          }))
        }
      }),
  },
  {
    id: 'popup-window',
    name: 'Popup Windows',
    description: 'Modal popup with title and action buttons',
    category: 'UI',
    build: () =>
      buildTemplate('Popup Window', (root, els) => {
        const overlay = addChild(root, els, createElement('Frame', {
          name: 'Overlay',
          size: udim(1, 0, 1, 0),
          backgroundColor3: color3(0, 0, 0),
          backgroundTransparency: 0.5,
        }))
        const popup = addChild(overlay.id, els, createElement('Frame', {
          name: 'Popup',
          size: udim2Offset(400, 240),
          position: udim2Offset(483, 264),
          backgroundColor3: color3(22, 22, 30),
          uiCorner: { cornerRadius: udim(0, 12, 0, 12) },
        }))
        addChild(popup.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'Confirm Action',
          size: udim2Offset(360, 40),
          position: udim2Offset(20, 20),
          backgroundTransparency: 1,
          font: 'GothamBold',
          textSize: 20,
        }))
        addChild(popup.id, els, createElement('TextLabel', {
          name: 'Message',
          text: 'Are you sure you want to continue?',
          size: udim2Offset(360, 60),
          position: udim2Offset(20, 70),
          backgroundTransparency: 1,
          textWrapped: true,
          textSize: 14,
        }))
        addChild(popup.id, els, createElement('TextButton', {
          name: 'Confirm',
          text: 'Confirm',
          size: udim2Offset(120, 36),
          position: udim2Offset(260, 180),
          backgroundColor3: color3(0, 120, 215),
          uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
        }))
      }),
  },
  {
    id: 'user-accounts',
    name: 'User Accounts',
    description: 'Login and account management UI',
    category: 'Menus',
    build: () =>
      buildTemplate('User Accounts', (root, els) => {
        const panel = addChild(root, els, createElement('Frame', {
          name: 'AccountPanel',
          size: udim2Offset(380, 460),
          position: udim2Offset(493, 154),
          backgroundColor3: color3(18, 18, 26),
        }))
        addChild(panel.id, els, createElement('TextLabel', {
          name: 'Title',
          text: 'ACCOUNT',
          size: udim2Offset(340, 44),
          position: udim2Offset(20, 20),
          backgroundTransparency: 1,
          font: 'GothamBlack',
          textSize: 26,
        }))
        addChild(panel.id, els, createElement('TextButton', {
          name: 'Login',
          text: 'Log In',
          size: udim2Offset(340, 44),
          position: udim2Offset(20, 100),
          backgroundColor3: color3(0, 120, 215),
          uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
        }))
        addChild(panel.id, els, createElement('TextButton', {
          name: 'SignUp',
          text: 'Create Account',
          size: udim2Offset(340, 44),
          position: udim2Offset(20, 156),
          backgroundColor3: color3(40, 40, 52),
          uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
        }))
      }),
  },
] as const

export type TemplateId = (typeof TEMPLATE_CATALOG)[number]['id']

export function getTemplate(id: TemplateId): ProjectDocument {
  const template = TEMPLATE_CATALOG.find((t) => t.id === id)
  if (!template) throw new Error(`Template not found: ${id}`)
  return template.build()
}
