const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const errorHandler = require('./Controllers/errorHandler');
const animalsRoutes = require('./Routes/animalsRoutes');
const userRoutes = require('./Routes/userRoutes');
const applicationsRoutes = require('./Routes/applicationRoutes');
// const { response } = require('express');

const app = express();
app.use(bodyParser.json());

// Set security headers 
app.use(helmet());

// NoSQL query injection defense
app.use(mongoSanitize());

// XSS attack defense
app.use(xss());

// Middleware to handle CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

// Serve static files
app.use('/public', express.static('public'));

// Routing
app.use('/api/animals', animalsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/applications', applicationsRoutes);

// Configure .env file
dotenv.config({ path: './config.env' });

// Access MongoDB Atlas
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// Connect to database
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection successful!');
    }).catch((error) => console.log(error));

// Global error handling middleware
app.use(errorHandler);

// Start the server
app.listen(process.env.PORT);