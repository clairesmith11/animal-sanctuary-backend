const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An animal must have a name'],
        trim: true,
    },
    gender: {
        type: String,
        required: [true, 'An animal must be male or female'],
        enum: {
            values: ['male', 'female'],
            message: 'An amimal must be either male or female',
        }
    },
    age: {
        type: Number,
        required: [true, 'An animal must have an age']
    },
    breed: {
        type: String,
        required: [true, 'An animal must have a breed']
    },
    adoptionStatus: {
        type: String,
        required: [true, 'An animal must have an adoption status'],
        enum: {
            values: ['available', 'pending', 'adopted'],
            message: 'An amimal must be either: available, pending, or adopted',
        },
    },
    goodWithChildren: {
        type: Boolean,
        required: [true, 'Is animal good with children?']
    },
    likes: [String],
    dislikes: [String],
    healthIssues: [String],
    image: {
        type: String,
        default: 'https://tacm.com/wp-content/uploads/2018/01/no-image-available-768x510.jpeg'
    },
    summary: String
});

const Animal = mongoose.model('Animal', animalSchema);

animalSchema.virtual('applications', {
    ref: 'Application',
    foreignField: 'animal',
    localField: '_id'
});

module.exports = Animal;