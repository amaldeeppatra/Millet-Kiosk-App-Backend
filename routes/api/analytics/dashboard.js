// analytics.js - New analytics routes to add to your backend
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import your models - adjust paths according to your structure
const Order = require('../../../models/order');
const Product = require('../../../models/product');
const User = require('../../../models/user');
const Rating = require('../../../models/rating');

// Helper function to convert Decimal128 to number
const decimal128ToNumber = (decimal128) => {
  return decimal128 ? parseFloat(decimal128.toString()) : 0;
};

// Get dashboard analytics summary
router.get('/dashboard', async (req, res) => {
  try {
    const shopId = req.query.shopId; // from frontend
    if (!shopId) {
      return res.status(400).json({ success: false, msg: "shopId query param is required" });
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // TODAY'S REVENUE (filtered by shop)
    const todayOrders = await Order.find({
      orderStatus: 'COMPLETED',
      shopId, // 👈 filter applied
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + decimal128ToNumber(order.totalPrice), 0);

    // ALL COMPLETED ORDERS (filtered by shop)
    const completedOrders = await Order.find({ orderStatus: 'COMPLETED', shopId });

    const totalSales = completedOrders.reduce((sum, order) => sum + decimal128ToNumber(order.totalPrice), 0);
    const totalOrders = await Order.countDocuments({ shopId });
    const avgOrderValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;

    // TOTAL PRODUCTS OF THAT SHOP ONLY
    const totalProducts = await Product.countDocuments();

    // TOTAL USERS WHO ORDERED FROM THAT SHOP
    const totalUsers = await Order.distinct('userId', { shopId }).then(list => list.length);

    res.json({
      success: true,
      data: {
        todayRevenue,
        totalSales,
        totalOrders,
        completedOrders: completedOrders.length,
        avgOrderValue,
        totalProducts,
        totalUsers
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get revenue trend (last 7 days)
router.get('/revenue-trend', async (req, res) => {
  try {
    const shopId = req.query.shopId;
    if (!shopId) return res.status(400).json({ success: false, error: "shopId is required" });

    const days = parseInt(req.query.days) || 7;
    const includeAllOrders = req.query.includeAll === 'true';
    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const queryCondition = {
        shopId,
        createdAt: { $gte: start, $lt: end }
      };
      if (!includeAllOrders) queryCondition.orderStatus = 'COMPLETED';

      const dayOrders = await Order.find(queryCondition);

      const completedOrders = dayOrders.filter(o => o.orderStatus === 'COMPLETED');
      const placedOrders = dayOrders.filter(o => o.orderStatus === 'PLACED');

      const dayRevenue = completedOrders.reduce((sum, o) => sum + decimal128ToNumber(o.totalPrice), 0);
      const pendingRevenue = placedOrders.reduce((sum, o) => sum + decimal128ToNumber(o.totalPrice), 0);

      trends.push({
        date: start.toISOString().split('T')[0],
        revenue: dayRevenue,
        pendingRevenue,
        orders: completedOrders.length,
        placedOrders: placedOrders.length,
        totalOrders: dayOrders.length
      });
    }

    res.json({ success: true, data: trends });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get best selling products
router.get('/products/best-selling', async (req, res) => {
  try {
    const shopId = req.query.shopId;
    const limit = parseInt(req.query.limit) || 10;

    if (!shopId) {
      return res.status(400).json({ success: false, message: "shopId is required" });
    }

    // Convert shopId => ObjectId
    const shopObjectId = new mongoose.Types.ObjectId(shopId);

    const productSales = await Order.aggregate([
      { 
        $match: { 
          orderStatus: 'COMPLETED', 
          shopId: shopObjectId 
        } 
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.prodId',
          totalQuantity: { $sum: '$items.quantity' },
          productName: { $first: '$items.prodName' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit }
    ]);

    // Fetch product details
    const bestSelling = await Promise.all(
      productSales.map(async sale => {
        const product = await Product.findOne({ prodId: sale._id }).lean();
        return {
          productId: sale._id,
          productName: sale.productName,
          productImage: product?.prodImg || null,
          totalQuantity: sale.totalQuantity,
          price: product ? decimal128ToNumber(product.price) : 0,
          totalRevenue: sale.totalQuantity * (product ? decimal128ToNumber(product.price) : 0)
        };
      })
    );

    res.json({ success: true, data: bestSelling });
  } catch (error) {
    console.error("Best selling products error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get least selling products
router.get('/products/least-selling', async (req, res) => {
  try {
    const shopId = req.query.shopId;
    const limit = parseInt(req.query.limit) || 10;

    if (!shopId) {
      return res.status(400).json({ success: false, message: "shopId is required" });
    }

    // STEP 1 — Aggregate sales only for specific shop
    const productSales = await Order.aggregate([
      { $match: { orderStatus: 'COMPLETED', shopId: new mongoose.Types.ObjectId(shopId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.prodId',
          totalQuantity: { $sum: '$items.quantity' },
          productName: { $first: '$items.prodName' }
        }
      }
    ]);

    // STEP 2 — Load all products (least-selling includes unsold ones)
    const allProducts = await Product.find().lean();

    // Create map for quick lookup
    const salesMap = new Map(productSales.map(sale => [sale._id, sale.totalQuantity]));

    // STEP 3 — Combine products with shop-wise sales quantities
    const productsWithSales = allProducts.map(product => {
      const qty = salesMap.get(product.prodId) || 0;  // zero if no sales in this shop
      const price = decimal128ToNumber(product.price);

      return {
        productId: product.prodId,
        productName: product.prodName,
        productImage: product.prodImg,
        totalQuantity: qty,
        price,
        totalRevenue: qty * price
      };
    });

    // STEP 4 — Sort by lowest qty first (least-selling)
    const leastSelling = productsWithSales
      .sort((a, b) => a.totalQuantity - b.totalQuantity)
      .slice(0, limit);

    res.json({ success: true, data: leastSelling });

  } catch (error) {
    console.error("Least selling products error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get operational funnel (live status)
router.get('/operational-funnel', async (req, res) => {
  try {
    const shopId = req.query.shopId;
    if (!shopId) return res.status(400).json({ success: false, msg: "shopId is required" });

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const placed = await Order.countDocuments({ orderStatus: 'PLACED', shopId });
    const completed = await Order.countDocuments({ orderStatus: 'COMPLETED', shopId });

    const todayPlaced = await Order.countDocuments({ orderStatus: 'PLACED', shopId, createdAt: { $gte: start } });
    const todayCompleted = await Order.countDocuments({ orderStatus: 'COMPLETED', shopId, updatedAt: { $gte: start } });

    res.json({
      success: true,
      data: {
        orders: { placed, completed },
        today: { newOrders: todayPlaced, completedOrders: todayCompleted },
        totalActiveOrders: placed
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get monthly revenue comparison
router.get('/monthly-revenue', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const shopId = req.query.shopId; // ⬅️ shop filter added

    const matchCondition = {
      orderStatus: 'COMPLETED',
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    };

    // apply shop filter only if shopId is provided
    if (shopId) {
      matchCondition.shopId = shopId;
    }

    const monthlyData = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: { $toDouble: '$totalPrice' } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing months with zero
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const result = months.map((month, index) => {
      const data = monthlyData.find(m => m._id === index + 1);
      return {
        month,
        revenue: data ? data.revenue : 0,
        orders: data ? data.orders : 0
      };
    });

    res.json({ success: true, data: result });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product performance by category
router.get('/products/category-performance', async (req, res) => {
  try {
    const shopId = req.query.shopId;

    const matchCondition = { orderStatus: 'COMPLETED' };

    const categoryPerformance = await Order.aggregate([
      { $match: matchCondition },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.prodId',
          foreignField: 'prodId',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', { $toDouble: '$product.price' }] } },
          uniqueProducts: { $addToSet: '$items.prodId' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalQuantity: 1,
          totalRevenue: 1,
          productCount: { $size: '$uniqueProducts' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ success: true, data: categoryPerformance });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user analytics
router.get('/users/analytics', async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // User counts by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // New users this week
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // New users this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Users with orders
    const usersWithOrders = await Order.distinct('userId');

    res.json({
      success: true,
      data: {
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id.toLowerCase()] = item.count;
          return acc;
        }, {}),
        newUsersThisWeek,
        newUsersThisMonth,
        activeUsers: usersWithOrders.length,
        totalUsers: await User.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;