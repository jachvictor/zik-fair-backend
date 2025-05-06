// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

dotenv.config(); // Load env variables
connectDB(); // Connect to MongoDB
app.use(express.json()); // For parsing application/json
app.use(cors());

// import roustes
const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/business");

app.get("/", (req, res) => {
  res.send("API is running...");
});

// use routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);

server.listen(PORT, () => {
  console.log(`🚀  Server is running on http://localhost:${PORT}`);
});
