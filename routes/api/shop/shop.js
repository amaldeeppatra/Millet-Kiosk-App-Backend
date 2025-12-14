require('dotenv').config();
const express = require('express');
const Shop = require('../../../models/Shop');
const router = express.Router();

router.post('/new', async (req, res) => {
    try {
    const { name, code, address } = req.body;

    if (!name || !code || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Shop.findOne({ code });
    if (existing) {
      return res.status(409).json({ message: "Shop code already exists." });
    }

    const shop = await Shop.create({ name, code, address });

    res.status(201).json({
      message: "Shop created successfully.",
      shop
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating shop", error });
  }
});

router.patch("/update/:id", async (req, res) => {
    try {
    const shopId = req.params.id;

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      req.body,
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({
      message: "Shop updated successfully",
      shop
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating shop", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
    try {
    const shopId = req.params.id;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.isActive = false; // Soft delete
    await shop.save();

    res.status(200).json({
      message: "Shop deleted (deactivated) successfully",
      shop
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shop", error });
  }
});

router.get("/all", async (req, res) => {
    try {
    const shops = await Shop.find().sort({ createdAt: -1 });

    res.status(200).json({ shops });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops", error });
  }
});

router.get("/active", async (req, res) => {
    try {
    const shops = await Shop.find({ isActive: true }).select("name code address");

    res.status(200).json({ shops });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active shops", error });
  }
});

router.get("/:id", async (req, res) => {
    try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ shop });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop", error });
  }
});

module.exports = router;