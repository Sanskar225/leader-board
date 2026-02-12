// CORS configuration for production and development
const corsOptions = {
    development: {
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        optionsSuccessStatus: 200
    },
    production: {
        origin: process.env.FRONTEND_URL || 'https://coderanker.vercel.app',
        credentials: true,
        optionsSuccessStatus: 200
    }
};

const getCorsOptions = () => {
    const env = process.env.NODE_ENV || 'development';
    return corsOptions[env] || corsOptions.development;
};

module.exports = { getCorsOptions };