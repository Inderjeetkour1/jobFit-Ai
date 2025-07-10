const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Resume API Routes
const resumeRoutes = require("./routes/resumeRoutes");
app.use("/resume", resumeRoutes);

// 👉 Serve frontend build from /client/dist (always do this after routes)
app.use(express.static(path.join(__dirname, "client", "dist")));

// 👉 SPA fallback (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// Port
const PORT = process.env.PORT || 10000;

// DB Connect and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
