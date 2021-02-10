const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const applicationController = require('../Controllers/applicationController');


const router = express.Router();

router.get('/', checkAuth, applicationController.getApplications);
router.post('/', checkAuth, applicationController.createApplication);


module.exports = router;