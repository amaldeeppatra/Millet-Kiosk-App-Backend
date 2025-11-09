const express = require('express');
const { createProduct } = require('../../../controllers/createProduct');
const router = express.Router();
const path = require('path'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { updateStock } = require("../../../utils/updateStock");
const { updateProduct } = require('../../../controllers/updateProduct');
const deleteProduct = require('../../../controllers/deleteProduct');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'createProduct.html'));
});

router.post('/new', upload.single('prodImg') , createProduct);

router.patch("/restock/:prodId", updateStock);

router.patch("/update/:prodId", updateProduct);

router.delete("/delete/:prodId", deleteProduct);

module.exports = router;