const express = require('express');
const checkAdmin = require('../middleware/checkAdmin');
const animalsController = require('../Controllers/animalsController');


const router = express.Router();

router.get('/', animalsController.getAllAnimals);
router.get('/:animalId', animalsController.getAnimalById);
router.post('/', checkAdmin, animalsController.createAnimal);
router.patch('/:animalId', checkAdmin, animalsController.updateAnimal);
router.delete('/:animalId', animalsController.deleteAnimal);

module.exports = router;