const User = require('../Models/userModel');
const HttpError = require('../Models/http-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Configure multer for image uploads and storage 
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${Date.now()}.${ext}`);
    }
});

// Filter out file types which are not images
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new HttpError('File must be an image', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.updatePhoto = upload.single('image');

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'applications',
            select: "animal status",
            populate: {
                path: 'animal',
                select: 'name'
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        return next(new HttpError('Could not find user with that ID', 404));
    }
};

// Sign up new user, encrypt password, and assign JSON web token
const signup = async (req, res, next) => {
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(req.body.password, 12);
        console.log();
    } catch (error) {
        next(new HttpError('Could not create user. Please try again.'), 500);
    }

    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            image: req.body.image,
            role: req.body.role
        });

        let token;
        try {
            token = jwt.sign(
                { userId: newUser._id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' });

        } catch (error) {
            next(new HttpError('Could not sign you in. Please try again later.'), 500);
        }

        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    image: newUser.image,
                    role: newUser.role
                },
                token: token
            },
        });


    } catch (error) {
        if (error.message.includes('email')) {
            return next(new HttpError('This email already exists. Please log in instead.'), 400);
        } else if (error.message.includes('password')) {
            return next(new HttpError('The password is too short. Minimum 8 characters.'), 400);
        }
        return next(new HttpError(error.message, 400));
    }
};

// Log in existing user
const login = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists with provided email
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError('Something went wrong!', 400));
    }

    // Return error if no user with that email is found
    if (!existingUser) {
        return next(new HttpError('Invalid credentials. Please try again', 401));
    }

    // Check if entered password matched encrytped password saved for this user
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
        return next(new HttpError('Something went wrong, please try again.', 500));
    }

    // Return error if psasword entered is incorrect
    if (!isValidPassword) {
        return next(new HttpError('Incorrect password. Please try again', 401));
    }

    // Assign JSON web token and set expiration time
    let token;
    try {
        token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });

    } catch (error) {
        next(new HttpError('Could not log you in. Please try again later.'), 500);
    }

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                image: existingUser.image,
                role: existingUser.role
            },
            token: token
        },
    });

};

const updateUser = async (req, res, next) => {
    try {
        const updatedBody = { ...req.body };
        // Add image file to database if available
        if (req.file) updatedBody.image = req.file.filename;
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updatedBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    image: updatedUser.image,
                    _id: updatedUser._id
                }
            }
        });

    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
