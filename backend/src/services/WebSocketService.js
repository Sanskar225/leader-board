const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // Store connected clients with their userId
        this.rooms = new Map();    // Store room subscriptions
        
        this.initialize();
    }

    initialize() {
        this.wss.on('connection', async (ws, req) => {
            try {
                // Get token from query parameters
                const url = new URL(req.url, `http://${req.headers.host}`);
                const token = url.searchParams.get('token');
                
                if (!token) {
                    ws.close(1008, 'No token provided');
                    return;
                }

                // Verify JWT token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                
                if (!user) {
                    ws.close(1008, 'Invalid user');
                    return;
                }

                // Store client connection
                this.clients.set(ws, {
                    userId: user._id.toString(),
                    username: user.username,
                    subscriptions: new Set()
                });

                console.log(`🔌 Client connected: ${user.username}`);

                // Send initial connection success
                ws.send(JSON.stringify({
                    type: 'connection',
                    status: 'connected',
                    message: `Welcome ${user.username}!`,
                    timestamp: new Date().toISOString()
                }));

                // Handle incoming messages
                ws.on('message', (message) => this.handleMessage(ws, message));
                
                // Handle client disconnect
                ws.on('close', () => this.handleDisconnect(ws));

                // Send initial data
                await this.sendInitialData(ws, user._id);

            } catch (error) {
                console.error('WebSocket connection error:', error);
                ws.close(1008, 'Authentication failed');
            }
        });

        // Start broadcasting leaderboard updates
        this.startLeaderboardBroadcast();
        
        console.log('✅ WebSocket Server initialized');
    }

    async handleMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            const client = this.clients.get(ws);
            
            if (!client) return;

            switch (data.type) {
                case 'subscribe':
                    await this.handleSubscribe(ws, data.room);
                    break;
                    
                case 'unsubscribe':
                    this.handleUnsubscribe(ws, data.room);
                    break;
                    
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
                    break;
                    
                case 'refresh_stats':
                    await this.handleRefreshStats(ws, client.userId);
                    break;
                    
                default:
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Unknown message type'
                    }));
            }
        } catch (error) {
            console.error('Error handling message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process message'
            }));
        }
    }

    async handleSubscribe(ws, room) {
        const client = this.clients.get(ws);
        
        if (!client) return;

        // Add room to client's subscriptions
        client.subscriptions.add(room);
        
        // Add client to room
        if (!this.rooms.has(room)) {
            this.rooms.set(room, new Set());
        }
        this.rooms.get(room).add(ws);

        // Send room data based on room type
        switch (room) {
            case 'leaderboard':
                await this.sendLeaderboardUpdate(ws);
                break;
            case 'global':
                await this.sendGlobalStats(ws);
                break;
            default:
                if (room.startsWith('user_')) {
                    const userId = room.replace('user_', '');
                    await this.sendUserStats(ws, userId);
                }
        }

        ws.send(JSON.stringify({
            type: 'subscribed',
            room,
            message: `Subscribed to ${room}`,
            timestamp: new Date().toISOString()
        }));

        console.log(`📡 Client ${client.username} subscribed to ${room}`);
    }

    handleUnsubscribe(ws, room) {
        const client = this.clients.get(ws);
        
        if (client) {
            client.subscriptions.delete(room);
            
            if (this.rooms.has(room)) {
                this.rooms.get(room).delete(ws);
            }
        }

        ws.send(JSON.stringify({
            type: 'unsubscribed',
            room,
            timestamp: new Date().toISOString()
        }));
    }

    handleDisconnect(ws) {
        const client = this.clients.get(ws);
        
        if (client) {
            // Remove client from all rooms
            client.subscriptions.forEach(room => {
                if (this.rooms.has(room)) {
                    this.rooms.get(room).delete(ws);
                }
            });
            
            console.log(`🔌 Client disconnected: ${client.username}`);
            this.clients.delete(ws);
        }
    }

    async sendInitialData(ws, userId) {
        try {
            // Send user stats
            await this.sendUserStats(ws, userId);
            
            // Send leaderboard preview
            await this.sendLeaderboardUpdate(ws, 10);
            
            // Send global stats
            await this.sendGlobalStats(ws);
            
        } catch (error) {
            console.error('Error sending initial data:', error);
        }
    }

    async sendUserStats(ws, userId) {
        try {
            const GitHubStats = require('../models/GitHubStats');
            const LeetCodeStats = require('../models/LeetCodeStats');
            const Leaderboard = require('../models/Leaderboard');
            const Profile = require('../models/Profile');

            const [github, leetcode, leaderboard, profile] = await Promise.all([
                GitHubStats.findOne({ user: userId }),
                LeetCodeStats.findOne({ user: userId }),
                Leaderboard.findOne({ user: userId }),
                Profile.findOne({ user: userId })
            ]);

            ws.send(JSON.stringify({
                type: 'user_stats',
                userId,
                data: {
                    github: github || {},
                    leetcode: leetcode || {},
                    leaderboard: leaderboard || {},
                    profile: profile || {}
                },
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error sending user stats:', error);
        }
    }

    async sendLeaderboardUpdate(ws, limit = 50) {
        try {
            const leaderboard = await Leaderboard.find()
                .populate('user', 'username avatar')
                .sort({ rank: 1 })
                .limit(limit)
                .lean();

            ws.send(JSON.stringify({
                type: 'leaderboard_update',
                data: leaderboard,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error sending leaderboard update:', error);
        }
    }

    async sendGlobalStats(ws) {
        try {
            const Leaderboard = require('../models/Leaderboard');
            const User = require('../models/User');

            const [totalUsers, totalScores, averageScore] = await Promise.all([
                User.countDocuments(),
                Leaderboard.aggregate([
                    { $group: { _id: null, total: { $sum: '$totalScore' } } }
                ]),
                Leaderboard.aggregate([
                    { $group: { _id: null, avg: { $avg: '$totalScore' } } }
                ])
            ]);

            ws.send(JSON.stringify({
                type: 'global_stats',
                data: {
                    totalUsers,
                    totalScore: totalScores[0]?.total || 0,
                    averageScore: Math.round(averageScore[0]?.avg || 0),
                    timestamp: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error sending global stats:', error);
        }
    }

    async handleRefreshStats(ws, userId) {
        try {
            const RefreshService = require('./RefreshService');
            const Profile = require('../models/Profile');

            const profile = await Profile.findOne({ user: userId });
            
            if (profile && profile.githubUsername && profile.leetcodeUsername) {
                const result = await RefreshService.refreshUserStats(
                    userId,
                    profile.githubUsername,
                    profile.leetcodeUsername,
                    'both'
                );

                ws.send(JSON.stringify({
                    type: 'refresh_complete',
                    success: result.success,
                    data: result,
                    timestamp: new Date().toISOString()
                }));

                // Broadcast updated user stats to all subscribers
                if (result.success) {
                    this.broadcastToRoom(`user_${userId}`, {
                        type: 'user_stats_updated',
                        userId,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.error('Error refreshing stats:', error);
            ws.send(JSON.stringify({
                type: 'refresh_error',
                error: error.message,
                timestamp: new Date().toISOString()
            }));
        }
    }

    startLeaderboardBroadcast() {
        // Broadcast leaderboard updates every 30 seconds
        setInterval(async () => {
            try {
                const leaderboard = await Leaderboard.find()
                    .populate('user', 'username avatar')
                    .sort({ rank: 1 })
                    .limit(100)
                    .lean();

                this.broadcastToRoom('leaderboard', {
                    type: 'leaderboard_update',
                    data: leaderboard,
                    timestamp: new Date().toISOString()
                });

                // Also broadcast to global room
                this.broadcastToRoom('global', {
                    type: 'leaderboard_snapshot',
                    count: leaderboard.length,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('Error broadcasting leaderboard:', error);
            }
        }, 30000);

        // Broadcast global stats every minute
        setInterval(async () => {
            try {
                const Leaderboard = require('../models/Leaderboard');
                const User = require('../models/User');

                const totalUsers = await User.countDocuments();
                const topUser = await Leaderboard.findOne()
                    .populate('user', 'username avatar')
                    .sort({ rank: 1 });

                this.broadcastToRoom('global', {
                    type: 'global_stats_update',
                    data: {
                        totalUsers,
                        topUser: topUser ? {
                            username: topUser.user.username,
                            score: topUser.totalScore
                        } : null,
                        timestamp: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('Error broadcasting global stats:', error);
            }
        }, 60000);
    }

    broadcastToRoom(room, message) {
        if (this.rooms.has(room)) {
            const clients = this.rooms.get(room);
            const messageStr = JSON.stringify(message);
            
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(messageStr);
                }
            });
        }
    }

    broadcastToAll(message) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    // Public method to notify about leaderboard changes
    notifyLeaderboardChange(change) {
        this.broadcastToRoom('leaderboard', {
            type: 'leaderboard_change',
            data: change,
            timestamp: new Date().toISOString()
        });
    }

    // Public method to notify about user achievements
    notifyUserAchievement(userId, achievement) {
        this.broadcastToRoom(`user_${userId}`, {
            type: 'achievement_unlocked',
            achievement,
            timestamp: new Date().toISOString()
        });
    }

    getConnectedClientsCount() {
        return this.clients.size;
    }

    getRoomsCount() {
        return this.rooms.size;
    }
}

module.exports = WebSocketService;