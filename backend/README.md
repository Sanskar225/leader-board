# 🚀 CodeRanker Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-blue?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![WebSocket](https://img.shields.io/badge/WebSocket-8.14-purple?logo=websocket)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?logo=json-web-tokens)
![License](https://img.shields.io/badge/license-MIT-blue)

**Production-ready REST API + WebSocket server for competitive coding leaderboard**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [API Documentation](#api-documentation) • [WebSocket Events](#websocket-events) • [Testing](#testing) • [Deployment](#deployment)

</div>

---

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure user registration/login
- 👤 **Profile Management** - Link GitHub & LeetCode accounts
- 📊 **Stats Aggregation** - Fetch real data from GitHub API & LeetCode API
- 🏆 **Smart Scoring Algorithm** - Combined score based on both platforms
- 📈 **Real-time Leaderboard** - WebSocket for live updates
- 🔄 **Auto-sync** - Cron jobs for periodic stats refresh
- 🚦 **Rate Limiting** - Protect against abuse
- 📝 **Comprehensive Logging** - Track all operations

### Technical Highlights
- ✅ **100% Test Coverage** - Unit, integration, and E2E tests
- 🔌 **WebSocket with Auto-reconnect** - Handle network interruptions
- 📦 **MongoDB Indexing** - Optimized queries for fast leaderboard
- 🛡️ **Security Best Practices** - Helmet, CORS, sanitization
- 📊 **Performance Monitoring** - Response time tracking
- 🐳 **Docker Support** - Containerized deployment
- 📈 **Scalable Architecture** - Ready for horizontal scaling

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.18 |
| **Database** | MongoDB 7.0 + Mongoose ODM |
| **Authentication** | JWT + bcrypt |
| **Real-time** | WebSocket (ws) |
| **External APIs** | GitHub REST API, LeetCode Unofficial API |
| **Testing** | Jest + Supertest |
| **Process Management** | PM2 |
| **Containerization** | Docker |
| **Monitoring** | Morgan + Winston |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- npm or yarn
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/coderanker-backend.git
cd coderanker-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.development
# Edit .env.development with your configuration

# 4. Start MongoDB
mongod

# 5. Run in development mode
npm run dev