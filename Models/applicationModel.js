const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Application must belong to a user']
    },
    animal: {
        type: mongoose.Schema.ObjectId,
        ref: 'Animal',
        required: [true, 'Application must belong to an animal']
    },
    status: {
        type: String,
        default: 'pending',
        enum: {
            values: ['approved', 'pending', 'declined'],
        },
    },
    name: String,
    age: Number,
    address: String,
    phone: Number,
    email: String,
    children: Boolean,
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;