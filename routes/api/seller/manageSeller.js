const express = require('express');
const changeUserRole = require('../../../controllers/manageSeller');

const router = express.Router();

router.patch('/manage', changeUserRole);

module.exports = router;