# CodeRanker Backend

A competitive coding leaderboard backend that combines LeetCode problem-solving stats with GitHub development activity.

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start MongoDB: `mongod`
5. Run development server: `npm run dev`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/refresh` - Refresh stats
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/compare/:userId` - Compare users

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard with filters
- `GET /api/leaderboard/top` - Get top performers
- `GET /api/leaderboard/stats` - Get leaderboard statistics
- `GET /api/leaderboard/user/:userId` - Get user rank

## Features

- User authentication with JWT
- GitHub API integration
- LeetCode API integration
- Smart scoring algorithm
- Real-time leaderboard ranking
- Auto-refresh via cron jobs
- Rate limiting
- Comprehensive error handling

## Environment Variables

See `.env.example` for all required variables.