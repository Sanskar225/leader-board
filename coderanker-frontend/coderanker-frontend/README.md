# 🎮 CodeRanker Frontend

Dark cyberpunk-themed React frontend for the CodeRanker competitive coding leaderboard.

## Tech Stack

- **React 18** + Vite 5
- **React Router v6** for navigation
- **Recharts** for data visualization
- **Vanilla CSS** with CSS variables (zero UI framework dependencies)
- **WebSocket** real-time leaderboard updates

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Live leaderboard with search, filters, compare |
| `/login` | Public | JWT authentication |
| `/register` | Public | Account creation |
| `/dashboard` | Protected | Personal stats + charts |
| `/profile` | Protected | Edit profile, sync GitHub/LeetCode |

## Features

- 🔴 **Live leaderboard** — WebSocket auto-updates
- 🏆 **Podium display** — Top 3 with gold/silver/bronze medals
- 🔍 **Search + filter** — By username or platform (All / GitHub / LeetCode)
- 📊 **Charts** — Difficulty breakdown bar chart, skills radar chart
- ⚔️ **Head-to-head compare** — Modal comparison vs any ranked user
- ↕️ **Rank change indicators** — See who climbed or fell
- 📈 **Progress bars** — Score bars relative to #1
- ⚡ **Manual stat sync** — Trigger refresh (rate-limited 5/hr)
- 🔄 **Auto-reconnect WebSocket** — Handles network interruptions

## Quick Start

```bash
# Install dependencies
npm install

# Development (proxies /api to localhost:3001)
npm run dev

# Production build
npm run build
```

## Environment Variables

```env
VITE_API_URL=/api          # Backend API base URL
VITE_WS_URL=ws://localhost:3001   # WebSocket URL
```

## Docker

```bash
docker build -t coderanker-frontend .
docker run -p 3000:80 coderanker-frontend
```

## Design System

CSS Variables defined in `src/index.css`:
- `--neon-green` `#00ff88` — Primary accent, scores, CTA
- `--neon-cyan` `#00d4ff` — Secondary accent, links
- `--neon-purple` `#8b5cf6` — GitHub stats
- `--neon-orange` `#ff6b35` — LeetCode stats
- `--neon-pink` `#ff2d6b` — Errors, negative changes
- `--font-display` — Bebas Neue (headings)
- `--font-mono` — Space Mono (labels, values)
- `--font-body` — Inter (body text)
