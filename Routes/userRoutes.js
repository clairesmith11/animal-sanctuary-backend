const express = require('express');
const checkAuth = require('../middleware/checkAuth');

userController = require('../Controllers/userController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.patch('/updatePhoto/:userId', userController.updatePhoto, userController.updateUser);
router.get('/:userId', checkAuth, userController.getUserById);


module.exports = router;