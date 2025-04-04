const express = require('express');
const { rateItem } = require('../../../utils/rateItem');
const router = express.Router();

router.post('/:prodId', rateItem);

module.exports = router;