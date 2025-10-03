const express = require('express');
const {changeUserRole,getAllSellers} = require('../../../controllers/manageSeller');
;

const router = express.Router();


router.patch('/manage', changeUserRole);
router.get('/sellers', getAllSellers);

module.exports = router;