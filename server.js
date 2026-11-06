const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(error => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Portfolio schema
const portfolioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    college: String,
    course: String,
    email: String,
    phone: String,
    location: String,
    about: String,
    skills: String,
    projects: String
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

// Main form webpage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Save portfolio details
app.post("/api/portfolios", async (req, res) => {
    try {
        const portfolio = new Portfolio(req.body);
        await portfolio.save();

        res.status(201).json({
            message: "Portfolio created successfully",
            portfolio
        });

    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to save portfolio"
        });
    }
});

// Get portfolio details from MongoDB
app.get("/api/portfolios/:id", async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found"
            });
        }

        res.json(portfolio);

    } catch (error) {
        res.status(400).json({
            message: "Invalid portfolio ID"
        });
    }
});

// Separate portfolio display webpage
app.get("/portfolio/:id", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="/style.css">
</head>

<body>

<nav class="navbar">
    <a href="/" class="logo">Portfolio<span>.</span></a>
    <a href="/" class="nav-link">Create New Portfolio ↗</a>
</nav>

<section class="display-hero">
    <span class="tag">✦ PERSONAL PORTFOLIO</span>

    <h1>My <span>Portfolio</span></h1>

    <p>Welcome to my personal portfolio website.</p>
</section>

<main class="display-main">

    <div class="profile-card">

        <div class="profile-icon">✦</div>

        <h1 id="displayName">Loading...</h1>

        <p class="profile-subtitle">Personal Portfolio</p>

        <div id="portfolioDetails" class="details-grid"></div>

        <a href="/" class="hero-btn back-btn">
            Create Another Portfolio →
        </a>

    </div>

</main>

<footer>
    <a href="/" class="logo">Portfolio<span>.</span></a>
    <p>Designed to showcase your potential ✦</p>
</footer>

<script src="/script.js"></script>

</body>
</html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Portfolio website running at http://localhost:${PORT}`);
});