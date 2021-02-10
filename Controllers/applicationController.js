const Application = require('../Models/applicationModel');
const HttpError = require('../Models/http-error');
const User = require('../Models/userModel');

const getApplications = async (req, res, next) => {
    try {
        const apps = await Application.find().populate({
            path: 'animal',
            select: 'name'
        });

        res.status(200).json({
            status: 'success',
            data: {
                applications: apps
            }
        });
    } catch (error) {
        next(new HttpError('Something went wrong!', 500));
    }
};

const createApplication = async (req, res, next) => {
    try {
        const newApp = await Application.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                application: newApp
            }
        });
    } catch (error) {
        if (error.message.startsWith('Application validation failed: creator')) {
            next(new HttpError('Could not find a user with that Id', 400));
        }
        if (error.message.startsWith('Application validation failed: animal')) {
            next(new HttpError('Could not find an animal with that ID', 404));
        }
        next(new HttpError(error.message, 400));

    }
};

exports.getApplications = getApplications;
exports.createApplication = createApplication;
