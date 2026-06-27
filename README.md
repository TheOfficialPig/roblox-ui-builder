# Roblox UI Builder

A professional web application for visually creating Roblox UIs without Roblox Studio. Design interfaces with a Figma-like editor, then export to **Lua**, **PNG layers**, or **JSON** for a future Studio plugin.

## Features

### Visual Editor
- Infinite design canvas with pan (Space + drag / scroll) and zoom (Ctrl + scroll)
- Device preview: Phone, Tablet, Desktop
- Drag-and-drop, multi-select, alignment guides, smart snapping, grid
- Copy / paste / duplicate / undo / redo
- Roblox Studio–inspired dark theme

### Roblox Objects
ScreenGui, Frame, TextLabel, TextButton, ImageLabel, ImageButton, ScrollingFrame, ViewportFrame, UIStroke, UICorner, UIGradient, UIAspectRatioConstraint, UIPadding, UIListLayout, UIGridLayout, UIPageLayout, Folder

### Hierarchy
- Explorer with create, rename, reorder, parent, lock, hide, group, collapse/expand
- Layers panel with z-index ordering
- Roblox-style Properties inspector

### Export
| Format | Description |
|--------|-------------|
| **Lua** | Production-ready script with hierarchy, UDim2, colors, fonts, modifiers |
| **PNG** | Each visible layer as transparent PNG (preserves strokes, corners, gradients) |
| **JSON** | Full project schema for future Studio plugin import |

### Templates
Main Menu, Inventory, Shop, Settings, Dialog Box, Loading Screen, Health Bar, Currency HUD, Notifications, Leaderboard, and more.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| State | Zustand + Immer |
| Backend | Express (Node.js) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| Storage | Supabase / AWS S3 (configured via env) |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the Next.js dev server
npm run dev

# (Optional) Start the Express API
npm run dev:api

# Or run both concurrently
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

```bash
# Configure DATABASE_URL in .env, then:
npm run db:push
npm run db:generate
```

### Demo Login
- Email: `demo@example.com`
- Password: `demo1234`

Projects are stored in localStorage until PostgreSQL is connected.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── editor/[id]/        # Visual editor
│   ├── dashboard/          # Project management
│   ├── login/              # Authentication
│   └── api/                # NextAuth routes
├── components/
│   └── editor/             # Canvas, Explorer, Properties, Toolbar
└── lib/
    ├── core/               # Roblox types, defaults, utilities
    ├── export/             # Lua, JSON, PNG export engines
    ├── store/              # Zustand editor state + undo/redo
    ├── templates/          # Built-in UI templates
    └── canvas/             # Snapping and guides
server/                     # Express API
prisma/                     # Database schema
```

## Architecture (Future-Ready)

The codebase is modular to support planned features:
- Real-time multiplayer editing (WebSocket layer on Express)
- Team workspaces (Prisma `User` + shared projects)
- Version history (project snapshots table)
- Template marketplace & asset library
- Animation editor & responsive previews
- Studio plugin via JSON import
- AI-assisted UI generation
- `.rbxl` / `.rbxm` import pipeline
- Theme manager & reusable component system

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+D | Duplicate |
| Delete | Delete selected |
| Space + drag | Pan canvas |
| Ctrl + scroll | Zoom |

## License

Private — all rights reserved.
