// controllers/dashboard.controller.js
// const mongoose = require('mongoose');
// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const { getDashboardDateRange } = require('../utils/dateHelper'); // We will use this again

// // Helper function to convert Decimal128 to a clean float
// const toFloat = (decimal) => {
//     if (!decimal) return 0;
//     try {
//         return parseFloat(decimal.toString());
//     } catch (e) {
//         return 0;
//     }
// };

exports.getKioskAnalytics = async (req, res) => {
    // try {
    //     const { timespan } = req.query;
    //     // Re-introducing the date helper
    //     const { startDate, endDate } = getDashboardDateRange(timespan);

    //     console.log(`\n--- [PRODUCTION] Request for timespan: ${timespan} ---`);
    //     console.log(`[PRODUCTION] Querying between (server time): ${startDate.toISOString()} and ${endDate.toISOString()}`);
        
    //     // --- Define All Aggregation Pipelines ---

    //     // Pipeline for KPIs
    //     const kpiPipeline = [
    //         { $match: { orderStatus: 'COMPLETED', createdAt: { $gte: startDate, $lte: endDate } } },
    //         { $group: { _id: null, totalSales: { $sum: { $toDouble: '$totalPrice' } }, totalOrders: { $sum: 1 } } }
    //     ];

    //     // Pipeline for Sales Over Time Chart
    //     const salesOverTimePipeline = [
    //         { $match: { orderStatus: 'COMPLETED', createdAt: { $gte: startDate, $lte: endDate } } },
    //         { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } }, dailySales: { $sum: { $toDouble: '$totalPrice' } } } },
    //         { $sort: { _id: 1 } },
    //         { $project: { _id: 0, date: '$_id', sales: '$dailySales' } }
    //     ];

    //     // Pipeline for Product-level analysis (most complex one)
    //     const productAnalyticsPipeline = [
    //         { $match: { orderStatus: 'COMPLETED', createdAt: { $gte: startDate, $lte: endDate } } },
    //         { $unwind: '$items' },
    //         {
    //             $lookup: {
    //                 from: 'products',
    //                 localField: 'items.prodId',
    //                 foreignField: 'prodId',
    //                 as: 'productDetails'
    //             }
    //         },
    //         { $unwind: '$productDetails' },
    //         {
    //             $group: {
    //                 _id: '$items.prodId',
    //                 prodName: { $first: '$items.prodName' },
    //                 unitsSold: { $sum: '$items.quantity' },
    //                 totalProductSales: { $sum: { $multiply: [{ $toDouble: '$productDetails.price' }, '$items.quantity'] } },
    //                 category: { $first: '$productDetails.category' }
    //             }
    //         }
    //     ];

    //     // --- Execute all pipelines concurrently ---
    //     const [
    //         kpiResults,
    //         salesOverTimeChart,
    //         productResults
    //     ] = await Promise.all([
    //         Order.aggregate(kpiPipeline),
    //         Order.aggregate(salesOverTimePipeline),
    //         Order.aggregate(productAnalyticsPipeline)
    //     ]);

    //     // --- Process Results ---
    //     const kpisData = kpiResults[0] || { totalSales: 0, totalOrders: 0 };
    //     const allProducts = await Product.find({}).lean();
        
    //     const kpis = {
    //         totalSales: kpisData.totalSales,
    //         totalOrders: kpisData.totalOrders,
    //         averageOrderValue: kpisData.totalOrders > 0 ? kpisData.totalSales / kpisData.totalOrders : 0,
    //         averageProductRating: allProducts.length > 0 ? allProducts.reduce((sum, p) => sum + toFloat(p.rating), 0) / allProducts.length : 0
    //     };

    //     const topSellingProducts = [...productResults]
    //         .sort((a, b) => b.unitsSold - a.unitsSold)
    //         .slice(0, 5)
    //         .map(p => ({ name: p.prodName, unitsSold: p.unitsSold }));
        
    //     const salesByCategoryMap = productResults.reduce((acc, product) => {
    //         const category = product.category || 'Uncategorized';
    //         acc[category] = (acc[category] || 0) + product.totalProductSales;
    //         return acc;
    //     }, {});
    //     const salesByCategory = Object.entries(salesByCategoryMap).map(([name, value]) => ({ name, value }));

    //     const productPerformance = allProducts.map(p => {
    //         const saleData = productResults.find(sale => sale._id === p.prodId);
    //         return {
    //             id: p._id,
    //             name: p.prodName,
    //             unitsSold: saleData ? saleData.unitsSold : 0,
    //             totalSales: saleData ? saleData.totalProductSales : 0,
    //             stock: p.stock,
    //             rating: toFloat(p.rating)
    //         };
    //     });
        
    //     // --- Send Final Response ---
    //     res.status(200).json({
    //         kpis,
    //         salesOverTime: salesOverTimeChart,
    //         topSellingProducts,
    //         salesByCategory,
    //         productPerformance
    //     });

    // } catch (error) {
    //     console.error('[FATAL] Kiosk analytics error:', error);
    //     res.status(500).json({ message: 'Server error while fetching analytics.', error: error.message });
    // }
};