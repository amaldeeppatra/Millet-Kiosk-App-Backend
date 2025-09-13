const express = require('express');
const router = express.Router();
const dashboardController = require('../../../controllers/dashboardController');
const isAuthenticated = require('../../../middlewares/authentication');
const authorize = require('../../../middlewares/dashboardAuth');

router.get(
    '/',
    // isAuthenticated,
    // authorize(['SELLER']),
    dashboardController.getKioskAnalytics
);

module.exports = router;