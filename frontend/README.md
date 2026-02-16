# 🎨 CodeRanker Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan?logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-pink?logo=framer)
![Three.js](https://img.shields.io/badge/Three.js-0.160-black?logo=three.js)
![License](https://img.shields.io/badge/license-MIT-blue)

**Cinematic, scroll-driven frontend for competitive coding leaderboard**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Animations](#animations) • [Deployment](#deployment)

</div>

---

## ✨ Features

### 🎬 Cinematic Experience
- **Scroll-driven intro** - Coin toss animation controlled by scroll
- **3D coin flip** - GitHub vs LeetCode faces
- **Physics-based cursor** - Premium interactive feel
- **Smooth transitions** - Layout animations for rank changes

### 📊 Data Visualization
- **Real-time leaderboard** - Live updates via WebSocket
- **Interactive charts** - Progress tracking and statistics
- **Podium display** - Top 3 with animated highlights
- **User comparison** - Side-by-side stat comparison

### 🎨 Design System
- **Premium dark theme** - Developer-focused aesthetic
- **Glass morphism** - Modern blurred cards
- **Responsive design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant

### ⚡ Performance
- **Virtualized lists** - Handles thousands of users
- **Code splitting** - Lazy loaded components
- **Optimized animations** - GPU accelerated
- **Progressive loading** - Skeletons and placeholders

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | React 18, Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Animation** | Framer Motion, Anime.js, Three.js |
| **State** | Zustand 4 |
| **Data Fetching** | React Query 5 |
| **Charts** | Recharts 2 |
| **Routing** | React Router 6 |
| **HTTP Client** | Axios |
| **Real-time** | WebSocket |
| **Forms** | React Hook Form |
| **Notifications** | React Hot Toast |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/coderanker-frontend.git
cd coderanker-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.development
# Edit .env.development with your configuration

# 4. Start development server
npm run dev