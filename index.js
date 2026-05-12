const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const ticketRoutes = require("./routes/ticketRoutes");

app.use(cors());
app.use(express.json());

const PORT = process.env.DB_PORT || 5000;

app.get("/", (req, res) => {
    res.send("Support Ticket API running.");
});

app.listen(PORT, () => {
    console.log(`Server running on server ${PORT}`);
});