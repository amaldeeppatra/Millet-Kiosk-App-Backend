const express = require('express');
const { 
    sendRequestController, 
    getAllRequestsByIdController, 
    getAllRequests,
    acceptRequest,
    rejectRequest
} = require('../../../controllers/request/request');
const router = express.Router();

router.post('/:sellerId', sendRequestController);
router.get('/getAllRequests/:sellerId', getAllRequestsByIdController);
router.get('/getAllRequests', getAllRequests);
router.patch('/requests/:id/accept', acceptRequest);
router.patch('/requests/:id/reject', rejectRequest);
module.exports = router;