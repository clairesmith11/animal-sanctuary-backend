const HttpError = require('../Models/http-error');

// Middleware for routes restricted to site administrators. Checks if user role equals "admin".
module.exports = (req, res, next) => {
    if (req.body.user.role === true) {
        return next();
    } else {
        return next(new HttpError('You do not have persmission to access this'), 403);
    }
};