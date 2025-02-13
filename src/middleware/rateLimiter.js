// // src/middleware/rateLimiter.js
// const rateLimit = require('express-rate-limit');

// // Create a limiter configuration
// const createLimiter = (options = {}) => {
//     return rateLimit({
//         windowMs: options.windowMs || 15 * 60 * 1000, // Default: 15 minutes
//         max: options.max || 100, // Default: 100 requests per windowMs
//         message: {
//             status: 'error',
//             message: 'Too many requests from this IP, please try again later.',
//             retryAfter: options.windowMs / 1000 / 60 + ' minutes'
//         },
//         standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//         legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//         // Skip rate limiting in test environment
//         skip: (req) => process.env.NODE_ENV === 'test',
//         // Custom key generator based on user ID if authenticated, else IP
//         keyGenerator: (req) => {
//             return req.user ? `user-${req.user._id}` : req.ip;
//         }
//     });
// };

// // Different rate limits for different routes
// const limiter = {
//     // Strict limit for search operations
//     search: createLimiter({
//         windowMs: 5 * 60 * 1000, // 5 minutes
//         max: 30 // 30 requests per 5 minutes
//     }),

//     // More lenient for general fighter info
//     fighter: createLimiter({
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100 // 100 requests per 15 minutes
//     }),

//     // Very strict for image requests
//     image: createLimiter({
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 50 // 50 requests per 15 minutes
//     }),

//     // Strict limit for matchup analysis
//     matchup: createLimiter({
//         windowMs: 5 * 60 * 1000, // 5 minutes
//         max: 20 // 20 requests per 5 minutes
//     })
// };

// // Store rate limit instances for cleanup during tests
// if (process.env.NODE_ENV === 'test') {
//     module.exports.instances = limiter;
// }

// module.exports = limiter;