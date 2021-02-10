const HttpError = require('../Models/http-error');
const dotenv = require('dotenv');

module.exports = (err, req, res, next) => {
    if (err.status >= 100 && err.status < 600) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    } else {
        res.status(500);
        res.json({ message: err.message });
    }


};

