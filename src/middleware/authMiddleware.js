// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            status: 'unauthorized',
            message: 'No token provided. Access denied.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'unauthorized',
                message: 'Invalid token. Access denied.'
            });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
