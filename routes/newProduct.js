const express = require('express');
const { createProduct } = require('../controllers/createProduct');
const router = express.Router();
const path = require('path'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'createProduct.html'));
});

router.post('/new', upload.single('prodImg') , createProduct);

module.exports = router;