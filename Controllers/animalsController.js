const Animal = require('../Models/animalModel');
const HttpError = require('../Models/http-error');


const getAllAnimals = async (req, res, next) => {
    try {
        // Extract the query and filter out fields we do not want to handle
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Convert query into mongoose query format
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Find animal based on the query and populate applications by creator onto the animal document
        const query = Animal.find(JSON.parse(queryStr)).populate({
            path: 'applications',
            select: 'creator'
        });

        const animals = await query;

        res.status(200).json({
            status: 'success',
            results: animals.length,
            data: {
                animals
            },
        });
    } catch (error) {
        return next(new HttpError('Something went wrong!', 500));
    }
};

const getAnimalById = async (req, res, next) => {
    try {
        const animal = await Animal.findById(req.params.animalId).populate('applications');

        res.status(200).json({
            status: 'success',
            data: {
                animal
            }
        });
    } catch (error) {
        return next(new HttpError('Could not find animal with that ID', 404));
    }
};

const createAnimal = async (req, res, next) => {
    try {
        const newAnimal = await Animal.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                animal: newAnimal,
            },
        });
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

const updateAnimal = async (req, res, next) => {
    try {
        // Find animal by ID and overwrite old fields with new, also recheck the fields against our validation requirements
        const updatedAnimal = await Animal.findByIdAndUpdate(req.params.animalId, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                animal: updatedAnimal
            }
        });

    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

const deleteAnimal = async (req, res, next) => {
    try {
        const animalId = req.params.animalId;
        await Animal.findByIdAndDelete(animalId);

        res.status(200).json({
            status: 'Success',
            data: {
                message: 'Successfully deleted!'
            }
        });

    } catch (error) {
        next(new HttpError('Could not delete animal with that ID', 400));
    }
};

exports.getAllAnimals = getAllAnimals;
exports.getAnimalById = getAnimalById;
exports.createAnimal = createAnimal;
exports.updateAnimal = updateAnimal;
exports.deleteAnimal = deleteAnimal;