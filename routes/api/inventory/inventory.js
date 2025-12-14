const express = require("express");
const router = express.Router();
const { createInventoryItem } = require("../../../controllers/inventory/inventoryController");
const { updateStock } = require("../../../utils/updateStock");
const { getInventoryForShop, getInventoryForProduct } = require("../../../controllers/inventory/getInventoryController");

router.post("/:shopId/create", createInventoryItem);

router.patch("/:shopId/update/:prodId", updateStock);

router.get("/:shopId/all", getInventoryForShop);

router.get("/:shopId/product/:prodId", getInventoryForProduct);

module.exports = router;