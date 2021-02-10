const HttpError = require('../Models/http-error');
const jwt = require('jsonwebtoken');

// Middleware for routes restricted to authorized users only. Checks if user is logged in.

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        // Check if there is a bearer token header on the request object
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }

        // Verify the token against our JSON web token secret
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        return next(new HttpError('You must log in or sign up to continue'), 401);
    }



};