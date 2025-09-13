const express = require('express');
const sendRequestController = require('../../../controllers/request/request');
const router = express.Router();

router.post('/:sellerId', sendRequestController);

module.exports = router;