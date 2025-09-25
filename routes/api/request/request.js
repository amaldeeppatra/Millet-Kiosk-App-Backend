const express = require('express');
const {sendRequestController, getAllRequestsByIdController} = require('../../../controllers/request/request');
const router = express.Router();

router.post('/:sellerId', sendRequestController);

router.get('/getAllRequests/:sellerId', getAllRequestsByIdController);

module.exports = router;