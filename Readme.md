# 🏆 CodeRanker - Complete Full Stack Application

<div align="center">

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-blue?logo=express)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan?logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-24.0-blue?logo=docker)
![License](https://img.shields.io/badge/license-MIT-blue)

**A competitive coding leaderboard combining LeetCode problem-solving skills with GitHub development activity**

[Demo](#demo) • [Features](#features) • [Tech Stack](#tech-stack) • [Architecture](#architecture) • [Quick Start](#quick-start) • [Deployment](#deployment) • [Screenshots](#screenshots)

</div>

---

## 🎥 Demo

[Live Demo](https://coderanker.vercel.app) | [API Documentation](https://api.coderanker.com/docs)

### Preview

![CodeRanker Demo](https://via.placeholder.com/800x400?text=CodeRanker+Demo)

---

## ✨ Features

### 🎨 Frontend
- **Scroll-driven cinematic intro** - Coin toss animation controlled by scroll
- **3D coin flip** - GitHub vs LeetCode faces with backface culling
- **Physics-based cursor** - Premium interactive feel with spring physics
- **Real-time leaderboard** - Live updates via WebSocket
- **Smooth layout animations** - Rank changes with Framer Motion
- **Responsive design** - Mobile-first approach
- **Dark theme** - Developer-focused aesthetic
- **Virtualized lists** - Handles thousands of users
- **Interactive charts** - Progress tracking with Recharts

### ⚙️ Backend
- **JWT Authentication** - Secure user management
- **GitHub API integration** - Fetch real developer stats
- **LeetCode API integration** - Fetch problem-solving stats
- **Smart scoring algorithm** - Combined score calculation
- **Real-time WebSocket** - Live leaderboard updates
- **Cron jobs** - Automated stats refresh
- **Rate limiting** - API protection
- **MongoDB optimization** - Indexed for fast queries
- **100% test coverage** - Unit, integration, E2E

### 🔗 Integration
- **Full-stack TypeScript** - Type safety across the board
- **RESTful API** - Well-documented endpoints
- **WebSocket events** - Bidirectional communication
- **Environment-based config** - Dev/Prod separation
- **Docker support** - Containerized deployment
- **CI/CD ready** - GitHub Actions workflow

---

## 🛠️ Tech Stack

### Frontend
| Category | Technologies |
|----------|-------------|
| **Core** | React 18, Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Animation** | Framer Motion, Anime.js, Three.js |
| **State** | Zustand 4 |
| **Data Fetching** | React Query 5 |
| **Charts** | Recharts 2 |
| **Routing** | React Router 6 |
| **Real-time** | WebSocket |
| **Forms** | React Hook Form |

### Backend
| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 18 |
| **Framework** | Express.js 4.18 |
| **Database** | MongoDB 7 + Mongoose |
| **Authentication** | JWT + bcrypt |
| **Real-time** | WebSocket (ws) |
| **External APIs** | GitHub REST, LeetCode Unofficial |
| **Testing** | Jest + Supertest |
| **Process Management** | PM2 |
| **Monitoring** | Morgan + Winston |

### DevOps
| Category | Tools |
|----------|-------|
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Hosting** | Vercel (Frontend), Railway (Backend) |
| **Monitoring** | Sentry, Logtail |
| **Domain** | Namecheap + Cloudflare |

---

## 🏗️ Architecture

### System Design
