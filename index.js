const express = require("express");

const cors = require("cors");

const mysql = require("mysql2");

require("dotenv").config();



const app = express();



// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());



// =========================
// DATABASE CONNECTION
// =========================

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME
});



db.connect((err) => {

    if (err) {

        console.error("Database connection failed:", err);

        return;
    }

    console.log("Connected to MySQL database");
});



// =========================
// SALES TRENDS
// =========================

app.get("/api/analytics/sales-trends", (req, res) => {

    const query = `
        SELECT
            DATE(sale_date) AS sale_day,

            SUM(quantity_sold) AS total_items_sold

        FROM sales

        GROUP BY sale_day

        ORDER BY sale_day ASC
    `;

    db.query(query, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch sales trends"
            });
        }

        res.status(200).json(results);
    });
});



// =========================
// LOW STOCK PRODUCTS
// =========================

app.get("/api/analytics/low-stock", (req, res) => {

    const query = `
        SELECT
            products.product_id,

            products.product_name,

            stock_levels.current_stock,

            products.reorder_level

        FROM stock_levels

        JOIN products
        ON stock_levels.product_id = products.product_id

        WHERE stock_levels.current_stock <= products.reorder_level

        ORDER BY stock_levels.current_stock ASC
    `;

    db.query(query, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch low stock products"
            });
        }

        res.status(200).json(results);
    });
});



// =========================
// CATEGORY SALES ANALYTICS
// =========================

app.get("/api/analytics/category-sales", (req, res) => {

    const query = `
        SELECT
            products.category,

            SUM(sales.quantity_sold) AS total_sales

        FROM sales

        JOIN products
        ON sales.product_id = products.product_id

        GROUP BY products.category

        ORDER BY total_sales DESC
    `;

    db.query(query, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch category analytics"
            });
        }

        res.status(200).json(results);
    });
});



// =========================
// TOP SELLING PRODUCTS
// =========================

app.get("/api/analytics/top-products", (req, res) => {

    const query = `
        SELECT
            products.product_id,

            products.product_name,

            SUM(sales.quantity_sold) AS units_sold

        FROM sales

        JOIN products
        ON sales.product_id = products.product_id

        GROUP BY products.product_id, products.product_name

        ORDER BY units_sold DESC

        LIMIT 5
    `;

    db.query(query, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch top products"
            });
        }

        res.status(200).json(results);
    });
});



// =========================
// INVENTORY HEALTH
// =========================

app.get("/api/analytics/inventory-health", (req, res) => {

    const query = `
        SELECT

            COUNT(*) AS total_products,

            SUM(current_stock) AS total_stock_units,

            SUM(
                CASE
                    WHEN current_stock <= 10
                    THEN 1
                    ELSE 0
                END
            ) AS low_stock_items

        FROM stock_levels
    `;

    db.query(query, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch inventory health"
            });
        }

        res.status(200).json(results[0]);
    });
});



// =========================
// ROOT ROUTE
// =========================

app.get("/", (req, res) => {

    res.send("Retail Analytics Dashboard API Running");
});



// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});