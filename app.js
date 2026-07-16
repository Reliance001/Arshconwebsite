require("dotenv").config();

const express = require("express");
const app = express();
const sessionConfig = require("./config/session");
const path = require("path");
const connectDB = require("./config/db");
const methodOverride = require('method-override');

const PORT = process.env.PORT || 3000;

// Registering all Routes
const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use(sessionConfig);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");

app.use("/api", pageRoutes);
app.use("/api", authRoutes);
app.use("/api", projectRoutes);

app.use((err, req, res, next) => {
  console.log("ERROR HANDLER:");
  console.log(err);

  res.status(500).send(err.message);
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on Port: http://localhost:${PORT}/`);
});
