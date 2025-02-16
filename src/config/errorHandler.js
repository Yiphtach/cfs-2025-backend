// errorHandler.js - Centralized error handling middleware
// src/middleware/errorHandler.js - Centralized Error Handling Middleware

const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};



module.exports = errorHandler;