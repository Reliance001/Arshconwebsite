const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://kit.fontawesome.com",
          "https://ka-f.fontawesome.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://ka-f.fontawesome.com",
          "https://kit-free.fontawesome.com",
          "https://fonts.googleapis.com",
        ],
        "font-src": [
          "'self'",
          "https://ka-f.fontawesome.com",
          "https://fonts.gstatic.com",
          "https://kit-free.fontawesome.com",
        ],
        "connect-src": [
          "'self'",
          "https://ka-f.fontawesome.com",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
        ],
        "img-src": ["'self'", "data:", "https://ka-f.fontawesome.com"],
      },
    },
  })
);
app.use(cors());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// serve uploaded files as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Import route
app.use("/", require("./routes/PagesRoutes"));
app.use("/", require("./routes/authRoutes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
