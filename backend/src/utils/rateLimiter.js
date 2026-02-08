const rateLimit = require("express-rate-limit");

/**
 * General API limiter
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Auth / login limiter
 */
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Refresh limiter (user-aware, IPv6 safe)
 * NOTE: We avoid req.ip completely.
 */
const refreshLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req, res) => {
    // express-rate-limit provides a safe fallback internally
    return req.user?.id || "anonymous";
  },
  message: "You can only refresh stats 5 times per hour",
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  refreshLimiter
};
