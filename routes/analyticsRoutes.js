const express = require("express");

const router = express.Router();

const {
    getSalesTrends,
    getLowStockProducts,
    getProductProfitability,
    getInventoryHealth,
    getTopSellingProducts
} = require("../controllers/analyticsController");



router.get("/sales-trends", getSalesTrends);

router.get("/low-stock", getLowStockProducts);

router.get("/profitability", getProductProfitability);

router.get("/inventory-health", getInventoryHealth);

router.get("/top-products", getTopSellingProducts);



module.exports = router;